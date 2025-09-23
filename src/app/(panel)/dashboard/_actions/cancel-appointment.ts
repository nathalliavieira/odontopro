"use server"

"use server"

import prisma from "@/lib/prisma";
import {z} from "zod";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    appointmentId: z.string().min(1, "You need to provide an appointment."),
});

type FormSchema = z.infer<typeof formSchema>;

export async function cancelAppointment(formData: FormSchema){
    const schema = formSchema.safeParse(formData);

    if(!schema.success){
        return{
            error: schema.error.issues[0]?.message
        }
    }

    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "User not found."
        }
    }

    try{
        await prisma.appointment.delete({
            where:{
                id: formData.appointmentId,
                userId: session?.user?.id
            }
        })

        revalidatePath("/dashboard");

        return{
            data: "Appointment successfully canceled!"
        }
    }catch(err){
        // console.log(err);
        return{
            error: "An error occurred when deleting this schedule."
        }
    }
}