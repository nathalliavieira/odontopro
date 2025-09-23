"use server"

import prisma from "@/lib/prisma";

export async function getInfoSchedule({userId}: {userId: string}){
    try{
        if(!userId){
            return null;
        }

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            },
            include:{ //Aqui estamos dizendo o seguinte, se encontrar o usuario que tem o id igual ao que informamos, quero trazer todas as informacoes desse usuario e incluir também os serviços e as subescricoes
                subscription: true,
                services: {
                    where:{
                        status: true,
                    }
                },
            }
        });

        if(!user){
            return null;
        }

        return user;
    }catch(err){
        return null;
    }
}