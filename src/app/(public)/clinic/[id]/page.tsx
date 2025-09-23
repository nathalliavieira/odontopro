import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-info-clinic";
import { ScheduleContent } from "./_components/schedule-content";

export default async function SchedulePage({
    params,
}: {
    params: Promise<{id: string}> //dentro de chaves passamos o mesmo nome que chamamos a pasta entre [].
}){
    const userId = (await params).id;
    const user = await getInfoSchedule({userId: userId});

    if(!user){
        redirect("/");
    }

    return(
        <ScheduleContent clinic={user}/>
    )
}