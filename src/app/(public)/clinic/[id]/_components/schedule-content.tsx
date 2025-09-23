"use client"

import Image from "next/image";
import imgTeste from "../../../../../../public/foto1.png";
import { MapPin } from "lucide-react";

import { Prisma } from "@/generated/prisma";
import { useAppointmentForm, AppointmentFormData } from "./schedule-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { formatPhone } from "@/utils/formatphone";
import { DateTimePicker } from "./date-picker";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useState, useCallback, useEffect } from "react"; //O callback serve para toda vez que trocarmos algo, chamar uma funcao. no nosso caso iremos usar o useCallback para toda vez que trocarmos a data selecionado no formulario. Ela atua como um useEffect
import { Label } from "@/components/ui/label";

import { ScheduleTimeList } from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointment";
import { toast } from "sonner";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include:{
        subscription: true,
        services: true,
    }
}>

interface ScheduleContentProps{
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot{
    time: string;
    available: boolean;
}

export function ScheduleContent({clinic}: ScheduleContentProps){
    const form = useAppointmentForm();
    const { watch } = form;

    const selectedDate = watch("date");
    const selectedServiceId = watch("serviceId");

    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    //Quais os horários bloqueados:
    const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

    //Iremos fazer agora uma funcao que busca os horarios bloqueados (via fetch HTTP)
    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadingSlots(true);

        try{
            const dateString = date.toISOString().split("T")[0];
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`);

            const json = await response.json();

            setLoadingSlots(false);
            
            return json; //Irá retornar o array com horarios que ja tem bloqueados desse dia e dessa clinica

        }catch(err){
            setLoadingSlots(false);
            return [];
        }
    }, [clinic.id]);

    useEffect(() => {

        if(selectedDate){
            fetchBlockedTimes(selectedDate).then((blocked) => {
                setBlockedTimes(blocked); //Passamos aqui os horarios bloqueados

                //Agora vamos montar os arrays de horarios disponiveis
                const times = clinic.times || []; //Aqui temos os horarios que a clinica ta aberta

                const finalSlots = times.map((time) => ({
                    time: time,
                    available: !blocked.includes(time) //Aqui estamos passando os hroarios que nao estao incluidos no nosso array de horarios bloqueados. Irá devolver um true ou false
                }));

                setAvailableTimeSlots(finalSlots);

                //Vamos verificar se o slot atual estiver indisponivel, limpamos a selecao:
                const stillAvailable = finalSlots.find(
                    (slot) => slot.time === selectedTime && slot.available
                );

                if(!stillAvailable){
                    setSelectedTime("");
                }
            });
        }

    },[selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

    async function handleRegisterAppointment(formData: AppointmentFormData){
        if(!selectedTime){
            return;
        }

        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            time: selectedTime,
            date: formData.date,
            serviceId: formData.serviceId,
            clinicId: clinic.id,
        });

        if(response.error){
            toast.error(response.error);
        }

        toast.success("Appointment successfully booked!");
        form.reset();
        setSelectedTime("");
    }

    return(
        <div className="min-h-screen flex flex-col">
            <div className="h-32 bg-emerald-500" />

            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">

                    <article className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
                            <Image 
                                src={clinic.image ? clinic.image : imgTeste} 
                                alt="Photo of the clinic"
                                className="object-cover"
                                fill
                            />
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>

                        <div className="flex items-center gap-1">
                            <MapPin className="h-5 w-5" />

                            <span>{clinic.address ? clinic.address : "Address not given"}</span>
                        </div>
                    </article>

                </div>
            </section>

            {/* Formulário de agendamento */}
            <section className="max-w-2xl mx-auto w-full mt-4">
                <Form {...form}>
                    <form 
                        className="space-y-6 bg-white p-6 border rounded-md shadow-sm mx-2"
                        onSubmit={form.handleSubmit(handleRegisterAppointment)}
                    >

                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Full name:</FormLabel>

                                    <FormControl>
                                        <Input 
                                            id="name"
                                            placeholder="Enter your full name..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Email:</FormLabel>

                                    <FormControl>
                                        <Input 
                                            id="email"
                                            placeholder="Enter your email..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Phone number:</FormLabel>

                                    <FormControl>
                                        <Input 
                                            {...field}
                                            id="phone"
                                            placeholder="XXX XX XX XX"
                                            onChange={(e) => {
                                                const fomattedValue = formatPhone(e.target.value)
                                                
                                                field.onChange(fomattedValue)
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="date"
                            render={({field}) => (
                                <FormItem className="flex items-center gap-2 space-y-1">
                                    <FormLabel className="font-semibold">Date of appointment:</FormLabel>

                                    <FormControl>
                                        <DateTimePicker 
                                            initialDate={new Date()}
                                            className="rounded border p-2 w-full"
                                            onChange={(date) => {
                                                if(date){
                                                    field.onChange(date)
                                                    setSelectedTime("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="serviceId"
                            render={({field}) => (
                                <FormItem className="">
                                    <FormLabel className="font-semibold">Select the desired service:</FormLabel>

                                    <FormControl>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                            setSelectedTime("")
                                        }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a service"/>
                                            </SelectTrigger>

                                            <SelectContent>
                                                {clinic.services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name} - {Math.floor(service.duration / 60)}h{service.duration % 60}min
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {selectedServiceId && (
                            <div className="space-y-2">
                                <Label className="font-semibold">Available times:</Label>

                                <div className="bg-gray-100 p-4 rounded-lg">
                                    {loadingSlots ? (
                                        <p>Loading schedules...</p>
                                    ) : availableTimeSlots.length === 0 ? (
                                        <p>No time slots available!</p>
                                    ) : (
                                        <ScheduleTimeList 
                                            clinicTimes={clinic.times}
                                            blockedTimes={blockedTimes}
                                            availableTimeSlots={availableTimeSlots}
                                            selectedDate={selectedDate}
                                            selectedTime={selectedTime}
                                            requiredSlot={
                                                clinic.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 30) : 1
                                            }
                                            onSelectTime={(time) => setSelectedTime(time)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {clinic.status ? (
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-400" type="submit" disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}>
                                Make an appointment
                            </Button>
                        ) : (
                            <p className="bg-red-500 text-white rounded-md px-4 text-center py-2">
                                The clinic is temporarily closed!
                            </p>
                        )}
                    </form>
                </Form>
            </section>
        </div>
    )
}