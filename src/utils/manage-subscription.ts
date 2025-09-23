import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { Plan } from "@/generated/prisma";

/**
 * Salvar, atualizar ou deletar informações das assninaturas (subscription) no banco de dados, sincronizando com a Stripe.
 * 
 * @async
 * @function manageSubscription
 * @param {string} subscriptionId - O ID da assinatura a ser gerenciada.
 * @param {string} customerId - O ID do cliente associado à assinatura.
 * @param {boolean} createAction - Indica se uma nova assinatura deve ser criada.
 * @param {boolean} deleteAction - Indica se uma assinatura deve ser deletada.
 * @param {Plan} [type] - O plano associado à assinatura.
 * @returns {Promise<Response|void>}
 */
export async function manageSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
    deleteAction = false,
    type?: Plan
){
    const findUser = await prisma.user.findFirst({
        where:{
            stripe_customer_id: customerId
        }
    });

    if(!findUser){
        return Response.json({ error: "Signature failure"}, {status: 400})
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id: subscription.id,
        userId: findUser.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        plan: type ?? "BASIC",
    };

    if(subscriptionId && deleteAction){
        await prisma.subscription.delete({
            where:{
                id: subscriptionId
            }
        })

        return;
    }

    if(createAction){
        try{
            await prisma.subscription.create({
                data: subscriptionData
            })

        }catch(err){
            console.log("Error saving the signature in the bank");
        }

    }else{
        try{
            const findSubscription = await prisma.subscription.findFirst({
                where:{
                    id: subscriptionId
                }
            });

            if(!findSubscription) return;

            await prisma.subscription.update({
                where:{
                    id: findSubscription.id
                },
                data:{
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                }
            })

        }catch(err){
            console.log("Failed to update the signature in the bank.");
        }
    }
}