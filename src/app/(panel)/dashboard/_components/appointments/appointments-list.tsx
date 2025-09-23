"use client"

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Prisma } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { toast } from "sonner";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DialogAppointment } from "./dialog-appointment";

import { ButtonPickerAppointment } from "./button-date";
import clsx from "clsx";

interface AppointmentsListProps{
    times: string[]
}

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
    include:{
        service: true,
    }
}>

export function AppointmentsList({times}: AppointmentsListProps){
    const searchParams = useSearchParams();
    const date = searchParams.get("date");

    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-appointments", date], //queryKey é pra fazer tudo que seja relacionado ao cashing
        queryFn: async () => {
            //Aqui vamos buscar da nossa rota
            let activeDate = date;

            if(!activeDate){
                const today = format(new Date(), "yyyy-MM-dd");

                activeDate = today;
            }

            const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`;

            const response = await fetch(url);

            const json = await response.json() as AppointmentWithService[];

            if(!response.ok){
                return [];
            }

            return json;
        },
        staleTime: 100000, //1 min de staleTime (demora 20 segundos para fazer uma requisicao nova, para nao gastar api atoa)
        refetchInterval: 300000, //Quanto tempo queremos fazer o refresh de forma automatica, sem precisar atualizar a pagina. De 3 em 3 minutos ele irá atualiar nossa api sozinho
    })

    //Montar occupantMap: slot -> appointment
    //Se um appointment começa no time 15:00 e tem um requiredSlots de 3, entao precisamos ter no nosso occupantMap = ["15:00", "15:30", "16:00"]
    const occupantMap: Record<string, AppointmentWithService> = {};

    if(data && data.length > 0){
        for( const appointment of data){
            //Calcular quantos slots necessarios ocupa o agendamento
            const requiredSlots = Math.ceil(appointment.service.duration / 30);

            //Descobrir qual é o índice do nosso array de horarios esse agendamento começa
            const startIndex = times.indexOf(appointment.time);

            //Se encontrou o index
            if(startIndex !== -1){
                for(let i = 0; i < requiredSlots; i++){
                    const slotIndex = startIndex + i;

                    if(slotIndex < times.length){
                        occupantMap[times[slotIndex]] = appointment;
                    }
                }
            }
        }
    }

    async function handleCancelAppointment(appointmentId: string){
        const response = await cancelAppointment({appointmentId: appointmentId});

        if(response.error){
            toast.error(response.error);
            return;
        }

        queryClient.invalidateQueries({queryKey: ["get-appointments"]})
        await refetch(); //Aqui precisamos chamar o refetch porque: é o useQuery quem esta fazendo a busca dos nossos dados aqui nesse componente query. Dessa forma, quando cancelamos um agendamento a nossa pagina nao é atualizada automaticamente. Mas para mudarmos esse comportamento, podemos chamar aqui o componente refetch que é fornecido pelo useQuery para que o refresh seja forçado e a pagina seja atualizada. Mas para isso, precisamos invalidar a nossa query como fizemos em cima, para que ela também seja atualizada automaticamente aqui, e nao espere os tempos de atualizacao que fornecemos lá em cima.
        toast.success(response.data);
    }

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl md:text-2xl font-bold">Appointments</CardTitle>

                    <ButtonPickerAppointment />
                </CardHeader>

                <CardContent className={clsx("pb-10", {
                    "pb-6": times.length === 0,
                })}>
                    {times.length === 0 && (
                        <p className="text-sm text-gray-500">Set up your profile to access your calendar.</p>
                    )}

                    <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
                        {isLoading ? (
                            <p>Loading schedule...</p>
                        ) : (
                            times.map((slot) => {
                                const occupant = occupantMap[slot];

                                if(occupant){
                                    return(
                                        <div key={slot} className="flex items-center py-2 border-t last:border-b">
                                            <div className="w-16 text-sm font-semibold">{slot}</div>

                                            <div className="flex-1 text-sm text-gray-500">
                                                <div className="font-semibold text-black">{occupant.name}</div>

                                                <div className="text-sm text-gray-500">{occupant.phone}</div>
                                            </div>

                                            <div className="ml-auto">
                                                <div className="flex">
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon"
                                                        onClick={() => setDetailAppointment(occupant)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <Button variant="ghost" size="icon" onClick={() => handleCancelAppointment(occupant.id)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                return(
                                    <div key={slot} className="flex items-center py-2 border-t last:border-b">
                                        <div className="w-16 text-sm font-semibold">{slot}</div>

                                        <div className="flex-1 text-sm text-gray-500">Available</div>
                                    </div>
                                )
                            })
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            <DialogAppointment appointment={detailAppointment}/>
        </Dialog>
    )
}