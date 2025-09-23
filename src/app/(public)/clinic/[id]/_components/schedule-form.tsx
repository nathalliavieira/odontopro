"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const appointmentSchema = z.object({
    name: z.string().min(1, "The name is mandatory!"),
    email: z.string().email("The email is mandatory!"),
    phone: z.string().min(1, "The phone number is mandatory!"),
    date: z.date(),
    serviceId: z.string().min(1, "The service is mandatory!"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function useAppointmentForm(){
    return useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            serviceId: "",
            date: new Date(),
        }
    })
}