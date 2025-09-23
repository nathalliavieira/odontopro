"use client"

import { Subscription } from "@/generated/prisma";
import { toast } from "sonner";
import { Card, CardDescription, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans/index";
import { Button } from "@/components/ui/button";
import { createPortalCustomer } from "../_actions/create-portal-customer";

interface SubscriptionDetailProps{
    subscription: Subscription;
}

export function SubscriptionDetail({subscription}: SubscriptionDetailProps){
    const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan);

    async function handleManageSubscription(){
        const portal = await createPortalCustomer();

        if(portal.error){
            toast.error("An error occurred when creating the subscription portal.");
            return;
        }

        window.location.href = portal.sessionId;
    }

    return(
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Current Plan</CardTitle>

                <CardDescription>Your subscription is now active!</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg md:text-xl">{subscription.plan}</h3>

                    <div className="bg-emerald-500 text-white w-fit px-4 py-1 rounded-md">{subscription.status}</div>
                </div>

                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2 ml-2">
                    {subscriptionInfo && subscriptionInfo.features.map( feature => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button onClick={handleManageSubscription}>
                    Manage subscription
                </Button>
            </CardFooter>
        </Card>
    )
}