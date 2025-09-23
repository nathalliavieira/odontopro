import {
    Card,
    CardContent,
} from "@/components/ui/card";

import Image from "next/image";
import fotoImg from "../../../../public/foto1.png";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prisma } from "@/generated/prisma";
import { PremiumCardBadge } from "./premium-badge";

type UserWithSubscription = Prisma.UserGetPayload<{
    include:{
        subscription: true,
    }
}>

interface ProfessionalsProps{
    professionals: UserWithSubscription[];
}

export function Professionals({professionals}: ProfessionalsProps){
    return(
        <section className="bg-gray-50 py-16" id="professionals">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl text-center mb-12 font-bold">Clinics available</h2>

                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {professionals.map((clinic) => (
                        <Card className="overflow-hidden hover:shadow-lg duration-300" key={clinic.id}>
                            <CardContent className="p-0">
                                <div>
                                    <div className="relative h-48">
                                        <Image src={clinic.image ?? fotoImg} alt="Photo of the clinic" fill className="object-cover"/>

                                        {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" &&<PremiumCardBadge />}
                                    </div>
                                </div>

                                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-semibold">{clinic.name}</h3>
                                            
                                            <p className="text-sm text-gray-500 line-clamp-2">{clinic.address ?? "Address not informed"}</p>
                                        </div>
                                    </div>

                                    <Link href={`/clinic/${clinic.id}`}className="w-full bg-[#17b7a4] hover:bg-[#1cd9c3] text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base" target="_blank">Book an appointment <ArrowRight className="ml-2"/></Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </section>
    )
}