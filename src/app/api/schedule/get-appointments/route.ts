import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
    //Buscar se tem agendamentos (appointments) em uma data especifica de uma clinica
    const {searchParams} = request.nextUrl;

    const userId = searchParams.get("userId");
    const dateParam = searchParams.get("date");

    if(!userId || userId === null || !dateParam || !dateParam === null){
        return NextResponse.json({
            error: "No appointments found"
        }, {
            status: 400
        })
    }

    try{
        //Converter a data recebida em um objeto Date:
        const [year, month, day] = dateParam.split("-").map(Number);

        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            }
        });

        if(!user){
            return NextResponse.json({
            error: "No appointments found"
        }, {
            status: 400
        })
        }

        const appointments = await prisma.appointment.findMany({
            where:{
                userId: userId,
                appointmentDate:{
                    gte: startDate, //gte é o filtro inicial para buscar a data, ou seja, a data inicial.
                    lte: endDate //lte data final
                }
            },
            include:{
                service: true,
            }
        });

        //Vamos montar um array com todos os agendamentos (slots) ocupados:
        const blockedSlots = new Set<string>(); //O set cria um array de strings de elementos unicos, ou seja, nao pode ter valores repetidos. Nele vamos armazenar os horarios

        for (const apt of appointments){
            //ex.: apt.time = "10:00", apt.service.duration = 60 (1h)
            const requiredSlots = Math.ceil(apt.service.duration / 30); //Dividimos por 30 porque vamos ter slots de 30 em 30 min

            const startIndex = user.times.indexOf(apt.time); //Aqui vamos ter a posicao de ontem devemos começar a bloquear o tempo. No caso, se o cliente tiver marcado horario as 08:00 receberemos na const 08:00

            if(startIndex !== -1){
                //Agora vamos percorrer os slots (caixinhas)
                for (let i = 0; i < requiredSlots; i++){
                    //Basicamente aqui vamos percorrer o for enquanto for menor que a quantidade de slots necessarios
                    const blockedSlot = user.times[startIndex + i]; //Aqui dentro dessa const iremos ter o horario

                    if(blockedSlot){
                        blockedSlots.add(blockedSlot);
                    }
                }
            }
        }

        const blockedTimes = Array.from(blockedSlots);

        return NextResponse.json(blockedTimes);

    }catch(err){
        return NextResponse.json({
            error: "No appointments found"
        }, {
            status: 400
        })
    }

    //Quais horarios estao reservados

}