"use client"

import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useDialogServiceForm, DialogServiceFormData } from "./dialog-service-form";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { convertRealToCents } from "@/utils/convertCurrency";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";

import { useState } from "react";
import { updateService } from "../_actions/update-service";

interface DialogServiceProps{
    closeModal: () => void;
    serviceId?: string;
    initialValues?:{
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export function DialogService({closeModal, serviceId, initialValues}: DialogServiceProps){
    const form = useDialogServiceForm({initialValues: initialValues});
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: DialogServiceFormData){
        setLoading(true);

        const priceInCents = convertRealToCents(values.price);

        //Caso o usuario nao digite o tempo de duracao (porque é opcional) nós vamos colocar um valor padrao, que no caso será 1
        const hours = parseInt(values.hours) || 1;
        const minutes = parseInt(values.minutes) || 0;

        //Agora iremos converter as horas apenas para minutos, porque no nosso banco de dados está salvo apenas como minutos:
        const duration = (hours * 60) + minutes;

        //Identificar se estamos ou nao atualizando o serviço:
        if(serviceId){
            await editServiceById({
                serviceId: serviceId,
                name: values.name,
                priceInCents: priceInCents,
                duration: duration
            })

            return;
        }

        const response = await createNewService({
            name: values.name,
            price: priceInCents,
            duration: duration,
        });

        setLoading(false);

        if(response.error){
            toast.error(response.error);
            return;
        }

        toast.success("Service successfully registered!");
        handleCloseModal();
    }

    //Aqui vamos atualizar o nosso serviço:
    async function editServiceById({serviceId, name, priceInCents, duration}: {serviceId: string, name: string, priceInCents: number, duration: number}){
        
        const response = await updateService({
            serviceId: serviceId,
            name: name,
            price: priceInCents,
            duration: duration
        });

        setLoading(false);

        if(response.error){
            toast.error(response.error);
            return;
        }

        toast(response.data);
        handleCloseModal();
    }

    function handleCloseModal(){
        form.reset(); //Para resetar todos os campos do formulario e nao correr o risco de ele abrir o modal novamente depois de fechado e estar todos os campos preenchidos com as informacoes fornecidas anteriormente.

        closeModal();
    }

    function changeCurrency(event: React.ChangeEvent<HTMLInputElement>){
        let { value } = event.target;

        value = value.replace(/\D/g, "");

        if(value){
            value = (parseInt(value, 10) / 100).toFixed(2);

            value = value.replace(".", ","); // aqui trocamos ponto por vírgula
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); //Aqui o \B nos garante que o . nao será inserido no começo do número, antes do primeiro dígito. A partir do ?=... é o que chamamos de look ahead, que é basicamente encontrar grupo de tres digitos que estejam seguidos por outro grupo de tres digitos, garantindo que os pontos sejam inseridos entre os milhares. Ex.: 234562,90 irá garantir que será separado em: 234.562,90
        }

        event.target.value = value;
        form.setValue("price", value);
    }

    return(
        <>
            <DialogHeader className="flex items-center">
                <DialogTitle className="font-bold">New Service</DialogTitle>

                <DialogDescription className="text-sm text-gray-500">Add a new service</DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="flex flex-col">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Service name</FormLabel>

                                    <FormControl>
                                        <Input {...field} placeholder="Enter the name of the service..."/>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Service value</FormLabel>

                                    <FormControl>
                                        <Input {...field} placeholder="E.g.: € 50,00"
                                        onChange={changeCurrency}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <p className="font-semibold">Duration of service:</p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField 
                            control={form.control}
                            name="hours"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Hours:</FormLabel>

                                    <FormControl>
                                        <Input {...field} 
                                            placeholder="1"
                                            min="0"
                                            type="number"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="minutes"
                            render={({field}) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Minutes:</FormLabel>

                                    <FormControl>
                                        <Input {...field} 
                                            placeholder="0"
                                            min="0"
                                            type="number"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full font-semibold text-white cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : `${serviceId ? "Update service" : "Register service"}`}
                    </Button>

                </form>
            </Form>
        </>
    )
}