import { LabelSubscription } from "@/components/ui/label-subscription";
import { getAllServices } from "../_data-access/get-all-services";
import { ServicesList } from "./services-list";
import { canPermission } from "@/utils/permissions/canPermission";

import { checkSubscription } from "@/utils/permissions/checkSubscription";

interface ServicesContentProps{
    userId: string;
}

export async function ServiceContent({userId}: ServicesContentProps){
    const services = await getAllServices({userId: userId});

    const permissions = await canPermission({type: "service"});

    const isTrial = await checkSubscription(userId);

    return(
        <>
            {permissions.planId === "TRIAL" && (
                <div className="bg-red-400 text-white text-sm md:text-base px-3 py-2 my-4 rounded-md">
                    <h3 className="font-semibold">{isTrial.message}</h3>
                </div>
            )}

            {!permissions.hasPermission ? (
                <LabelSubscription expired={permissions.expired}/>
            ) : (
                <ServicesList services={services.data || []} permissions={permissions}/>
            )}
            
        </>
    )
}