"use server"

import { Session } from "next-auth";
import { addDays, isAfter } from "date-fns";
import { ResultPermissionProp } from "./canPermission";

import { TRIAL_DAYS } from "./trial-limits";

export async function checkSubscriptionExpired(session: Session): Promise<ResultPermissionProp>{
    const trialEndDate = addDays(session?.user?.createdAt!, TRIAL_DAYS); //addDays adiciona dias as frente

    if(isAfter(new Date(), trialEndDate)){
        //isAfter serve para comparar datas, no caso a do dia de hoje com a data que criamos de dias disponiveis de teste. Se tiver passado retorna true, se nao false
        return{
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null,
        }
    }

    return{
        hasPermission: true,
        planId: "TRIAL",
        expired: false,
        plan: null,
    }
}