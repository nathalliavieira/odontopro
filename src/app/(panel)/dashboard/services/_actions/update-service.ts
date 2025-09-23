"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

import { revalidatePath } from "next/cache";

const formSchema = z.object({
    serviceId: z.string().min(1, "The service id is mandatory"),
    name: z.string().min(1, {message: "The service name is mandatory"}),
    price: z.number().min(1, {message: "The service price is mandatory"}),
    duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateService(formData: FormSchema){
    const session = await auth();
    
    if(!session?.user?.id){
        return{
            error: "Service update failed."
        }
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try{
        await prisma.service.update({
            where:{
                id: formData.serviceId,
                userId: session?.user?.id
            },
            data:{
                name: formData.name,
                price: formData.price,
                duration: formData.duration
            }
        })

        revalidatePath("/dashboard/services");
        
        return{
            data: "Service successfully updated!"
        };

    }catch(err){
        return{
            error: "Service update failed."
        };
    }
}