"use client"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import { DialogService } from "./dialog-service";
import { Service } from "@/generated/prisma";

import { formatCurrency } from "@/utils/formatCurrency";
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";
import { ResultPermissionProp } from "@/utils/permissions/canPermission";
import Link from "next/link";
import clsx from "clsx";

interface ServiceListProps{
    services: Service[];
    permissions: ResultPermissionProp;
}

export function ServicesList({services, permissions}: ServiceListProps){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<null | Service>(null);

    async function handleDeleteService(serviceId: string){
        const response = await deleteService({serviceId: serviceId});

        if(response.error){
            toast.error(response.error);
            return;
        }

        toast.success(response.data);
    }

    function handleEditService(service: Service){
        setEditingService(service);
        setIsDialogOpen(true);
    }

    return(
        <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
                setIsDialogOpen(open);

                if(!open){
                    setEditingService(null);
                }
        }}>
            <section className="mx-auto">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl md:text-2xl font-bold">Services</CardTitle>

                        {permissions.hasPermission && (
                            <DialogTrigger asChild>
                                <Button className="cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                        )}

                        {!permissions.hasPermission && (
                            <Link href="/dashboard/plans" className="text-red-500">Service limit reached</Link>
                        )}

                        <DialogContent
                            onInteractOutside={(e) => {
                                e.preventDefault();
                                setIsDialogOpen(false);
                                setEditingService(null);
                            }}
                        >
                            {/* onInteractOutside é a funcao que o shadcn nos da para quando clicamos fora do modal */}
                            <DialogService 
                                closeModal={() => {
                                    setIsDialogOpen(false);
                                    setEditingService(null);
                                }}
                                
                                serviceId={editingService ? editingService.id : undefined}

                                initialValues={editingService ? {
                                    name: editingService.name,
                                    price: (editingService.price / 100).toFixed(2).replace(".", ","),
                                    hours: Math.floor(editingService.duration / 60).toString(),
                                    minutes: (editingService.duration % 60).toString()
                                } : undefined}
                                />
                        </DialogContent>
                    </CardHeader>

                    <CardContent>
                        <section className="space-y-4 mt-5">
                            {services.map( (service, index) => {
                                const isDisabled = !permissions.hasPermission && index >= 3;

                                return(
                                    <article key={service.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={clsx("font-medium", {
                                                    "line-through text-gray-500": isDisabled,
                                                })}>{service.name}</span>
                                                <span className="font-medium text-gray-500">-</span>
                                                <span className={clsx("font-medium text-gray-500", {
                                                    "line-through": !permissions.hasPermission && index >= 3,
                                                })}>{formatCurrency((service.price / 100))}</span>
                                            </div>

                                            <div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditService(service)}
                                                    className="cursor-pointer"
                                                    disabled={isDisabled}
                                                >
                                                    <Pencil className="w-4 h-4"/>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="cursor-pointer"
                                                    disabled={isDisabled}
                                                >
                                                    <X className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </article>
                                )
                            })}
                        </section>
                    </CardContent>
                </Card>

            </section>
        </Dialog>
    )
}