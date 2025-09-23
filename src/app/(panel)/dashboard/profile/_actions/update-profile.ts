"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, {message: "The name is mandatory!"}),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean(),
    timeZone: z.string(),
    times: z.array(z.string())
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateProfile(formData: FormSchema){
    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "User not found."
        }
    }

    const schema = formSchema.safeParse(formData); //aqui usamos safeParse para garantir que o que seja passado aqui seja exatamente a tipagem de cima, string, boolean...

    if(!schema.success){
        return{
            error: "Fill in all the fields.",
        }
    }

    try{
        await prisma.user.update({
            where:{
                id: session?.user?.id
            },
            data:{
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                status: formData.status,
                timeZone: formData.timeZone,
                times: formData.times || [],
            }
        })

        revalidatePath("/dashboard/profile"); //Aqui estamos mandando relavidar o cash da pagina profile

        return{
            data: "Successfully updated clinic!"
        }

    }catch(err){
        return{
            error: "Failure to update the clinic."
        }
    }
}