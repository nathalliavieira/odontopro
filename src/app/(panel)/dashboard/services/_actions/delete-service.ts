"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

import { revalidatePath } from "next/cache";

const formSchema = z.object({
    serviceId: z.string().min(1, "The service id is mandatory!")
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchema){
    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "Failed to delete service."
        }
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try{
        //Aqui nao vamos deletar realmente o serviço do banco de dados, porque pode ser que o cliente delete sem querer e por algum motivo ele tinha um relatorio referente ao id desse projeto e aí bagunça com tudo. Entao, por motivos de segurança vamos apenas trocar o status do serviço para false e tiralo da nossa pagina.

        await prisma.service.update({
            where:{
                id: formData.serviceId,
                userId: session?.user?.id
            },
            data:{
                status: false
            }
        });

        revalidatePath("/dashboard/services");
        
        return{
            data: "Service successfully deleted!"
        }
    }catch(err){
        return{
            error: "Failed to delete service."
        };
    }
}