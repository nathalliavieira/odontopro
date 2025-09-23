"use client"

import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const reminderSchema = z.object({
    description: z.string().min(1, "The description of the reminder is mandatory"),
});

export type ReminderFormdata = z.infer<typeof reminderSchema>

export function useReminderForm(){
    return useForm<ReminderFormdata>({
        resolver: zodResolver(reminderSchema),
        defaultValues:{
            description: ""
        }
    })
}