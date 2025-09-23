"use server"

import prisma from "@/lib/prisma";
import { addDays, isAfter } from "date-fns";
import { TRIAL_DAYS } from "./trial-limits";

export async function checkSubscription(userId: string){
    const user = await prisma.user.findFirst({
        where:{
            id: userId,
        },
        include:{
            subscription: true,
        }
    });

    if(!user){
        throw new Error("User not found.");
    }

    if(user.subscription && user.subscription.status === "active"){
        return{
            subscriptionStatus: "active",
            message: "Active subscription.",
            planId: user.subscription.plan
        }
    }

    const trialEndDate = addDays(user.createdAt, TRIAL_DAYS);

    if(isAfter(new Date(), trialEndDate)){
        return{
            subscriptionStatus: "EXPIRED",
            message: "Your trial period has expired.",
            planId: "TRIAL"
        }
    }

    return{
        subscriptionStatus: "TRIAL",
        message: `You are in the free trial period. Valid until: ${trialEndDate.toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" })}`,
        planId: "TRIAL"
    }
}