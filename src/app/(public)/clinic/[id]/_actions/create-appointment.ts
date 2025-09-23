"use server"

import prisma from "@/lib/prisma";
import {z} from "zod";

const formSchema = z.object({
    name: z.string().min(1, "The name is mandatory"),
    email: z.string().min(1, "The email is mandatory"),
    phone: z.string().min(1, "The phone number is mandatory"),
    date: z.date(),
    serviceId: z.string().min(1, "The service is mandatory"),
    time: z.string().min(1, "The time is mandatory"),
    clinicId: z.string().min(1, "The time is mandatory"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewAppointment(formData: FormSchema){
    const schema = formSchema.safeParse(formData);

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try{
        const selectedDate = new Date(formData.date);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

        const newAppointment = await prisma.appointment.create({
            data:{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                time: formData.time,
                appointmentDate: appointmentDate,
                serviceId: formData.serviceId,
                userId: formData.clinicId
            }
        });

        return{
            data: newAppointment
        }

    }catch(err){
        console.log(err);
        return{
            error: "Error when registering an appointment."
        }
    }
}