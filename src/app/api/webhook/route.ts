import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";

import { manageSubscription } from "@/utils/manage-subscription";
import { Plan } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export const POST = async (request: Request) => {
    const signature = request.headers.get("stripe-signature");

    if(!signature){
        return NextResponse.error();
    }

    const text = await request.text();

    const event = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_SECRETE_WEBHOOK_KEY as string,
    );

    switch(event.type){
        case "customer.subscription.deleted":
            const payment = event.data.object as Stripe.Subscription;

            //agora precisamos ir no banco de dados e deletar a assinatura do usuario
            await manageSubscription(
                payment.id,
                payment.customer.toString(),
                false,
                true
            )

            break;
        case "customer.subscription.updated":
            const paymentIntent = event.data.object as Stripe.Subscription;

            //Ir la no banco e atualizar a assinatura do usuário
            await manageSubscription(
                paymentIntent.id,
                paymentIntent.customer.toString(),
                false,
                false,
            )

            revalidatePath("/dashboard/plans");

            break;
        case "checkout.session.completed":
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            const type = checkoutSession?.metadata?.type ? checkoutSession?.metadata?.type : "BASIC";

            //Ir la no banco e criar uma assinatura ativa para esse usuario
            if(checkoutSession.subscription && checkoutSession.customer){
                await manageSubscription(
                    checkoutSession.subscription?.toString(),
                    checkoutSession.customer.toString(),
                    true,
                    false,
                    type as Plan,
                )
            }
            
            revalidatePath("/dashboard/plans");

            break;

        default:
            console.log("Untreated event: ", event.type);
    }

    return NextResponse.json({recived: true});
}