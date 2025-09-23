"use server"

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar({avatarUrl}: {avatarUrl: string}){
    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "User not found."
        }
    }

    if(!avatarUrl){
        return{
            error: "Failed to change image."
        }
    }

    try{
        await prisma.user.update({
            where:{
                id: session?.user?.id,
            },
            data:{
                image: avatarUrl,
            }
        })

        revalidatePath("/dashboard/profile");

        return{
            data: "Image changed successfully!"
        }

    }catch(err){
        return{
            error: "Failed to change image."
        }
    }
}