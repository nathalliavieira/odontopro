"use server"

import { Plan } from "@/generated/prisma";
import { PlansProps } from "../plans";

export interface PlanDetailInfo{
    maxServices: number;
}

const PLANS_LIMITS: PlansProps = {
    BASIC: {
        maxServices: 3,
    },
    PROFESSIONAL: {
        maxServices: 50,
    }
};

export async function getPlan(planId: Plan){
    return PLANS_LIMITS[planId];
}