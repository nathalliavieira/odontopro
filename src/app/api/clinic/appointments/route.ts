import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//Rota para buscar todos os agendamentos de uma clinica. Para isso, preciso ter a data e também o id da clinica (MAS LEMBRE-SE, NUNCA PODEMOS FORNERCER O ID DO USUARIO ATRAVES DA ROTA.)

export const GET = auth(async function GET(request){
    if(!request.auth){
        return NextResponse.json({error: "Unauthorized access!"}, {status: 401})
    }

    const searchParams = request.nextUrl.searchParams;
    const dateString = searchParams.get("date") as string;
    const clinicId = request.auth?.user?.id;

    if(!dateString){
        return NextResponse.json({error: "Date not informed"}, {status: 400})
    }

    if(!clinicId){
        return NextResponse.json({error: "Unauthorized access!"}, {status: 400})
    }

    try{
        //Criar uma data formatada:
        const [year, month, day] = dateString.split("-").map(Number);

        const startDate = new Date(Date.UTC(year, month -1, day, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month -1, day, 23, 59, 59, 999));

        const appointments = await prisma.appointment.findMany({
            where:{
                userId: clinicId,
                appointmentDate:{
                    gte: startDate,
                    lte: endDate
                }
            },
            include:{
                service: true,
            }
        });

        return NextResponse.json(appointments);

    }catch(err){
        return NextResponse.json({error: "Failed to find appointments"}, {status: 400})
    }
}) as any;