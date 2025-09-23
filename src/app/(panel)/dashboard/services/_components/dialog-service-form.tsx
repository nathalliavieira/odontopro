"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
    name: z.string().min(1, {message: "The name of the service is mandatory"}),
    price: z.string().min(1, {message: "The price of the service is mandatory"}),
    hours: z.string(),
    minutes: z.string()
});

export interface UseDialogServiceFormProps{
    initialValues?:{
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export type DialogServiceFormData = z.infer<typeof formSchema>;

export function useDialogServiceForm({initialValues}: UseDialogServiceFormProps){
    return useForm<DialogServiceFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues || {
            name: "",
            price: "",
            hours: "",
            minutes: ""
        }
    })
}