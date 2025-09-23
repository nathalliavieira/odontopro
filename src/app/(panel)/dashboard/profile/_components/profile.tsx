"use client"

import { ProfileFormData, useProfileForm } from "./profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, 
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { Prisma } from "@/generated/prisma";
import { updateProfile } from "../_actions/update-profile";

import { toast } from "sonner";
import { formatPhone } from "@/utils/formatphone";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AvatarProfile } from "./profile-avatar";

type UserWithSubscription = Prisma.UserGetPayload<{
    include:{
        subscription: true
    }
}>

interface ProfileContentProps{
    user: UserWithSubscription;
}

export function ProfileContent({user}: ProfileContentProps){
    const router = useRouter();

    const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? []);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const {update} = useSession();

    const form = useProfileForm({
        name: user.name,
        address: user.address,
        phone: user.phone,
        status: user.status,
        timeZone: user.timeZone
    });
    
    function generateTimeSlots(): string[]{
        const hours: string[] = [];

        for (let i=8; i<=24; i++){
            for (let j=0; j<2; j++){
                const hour = i.toString().padStart(2, "0"); //em padStart significa que se o retorno nao for um retorno de 2 dígitos (no caso 8 ou 9) ele irá colocar um 0 ANTES do número
                const minute = (j*30).toString().padStart(2, "0");

                hours.push(`${hour}:${minute}`);
            }
        }

        return hours;
    }

    const hours = generateTimeSlots();

    function toggleHour(hour: string){
        setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort()); //Aqui estamos fazendo o seguinte, pegando todas as horas que já estao na lista (prev) e estamos verificando se a hora clicada ja esta nessa lista. Se sim, a gente vai retornar um array com todas as horas diferente da hora clicada, porque isso significa que se a pessoa clicou duas vezes na mesma hora é porque ela quer retirar ela da lista. Se nao esta na lista, nós adicionamos ela entao e também usamos o .sort() que é para organizar a lista do menor para o maior.
    }

    const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) =>
        zone.startsWith("Europe/Madrid") ||
        zone.startsWith("Atlantic/Canary") ||
        zone.startsWith("America/Sao_Paulo") || 
        zone.startsWith("America/Fortaleza")
    );

    async function onSubmit(values: ProfileFormData){
        const response = await updateProfile({
            name: values.name,
            address: values.address,
            phone: values.phone,
            status: values.status === "active" ? true : false,
            timeZone: values.timeZone,
            times: selectedHours || [],
        });

        if(response.error){
            toast(response.error);
            return;
        }

        toast(response.data);
    }

    async function handleLogout(){
        await signOut();
        await update();
        router.replace("/");
    }

    return(
        <div className="mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>My profile</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <AvatarProfile avatarUrl={user.image} userId={user.id} />
                            </div>

                            <div className="space-y-4">
                                <FormField 
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Full name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter the name of the clinic..."/>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Full address</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter the address of the clinic..."/>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="phone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Phone number</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="123 45 67 89"
                                                onChange={(e) => {
                                                    const formattedValue = formatPhone(e.target.value)

                                                    field.onChange(formattedValue)
                                                }}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Clinic status</FormLabel>
                                            <FormControl>

                                                <Select onValueChange={field.onChange} defaultValue={field.value ? "active" : "inactive"}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select the clinic status" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="active">Active (open clinic)</SelectItem>

                                                        <SelectItem value="inactive">Inactive (clinic closed)</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2"> 
                                    <Label className="font-semibold">
                                        Setting up clinic hours
                                    </Label>

                                    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant=
                                            "outline" className="w-full justify-between">
                                                Click here to select timetables
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Clinic hours</DialogTitle>

                                                <DialogDescription>Select the clinic's opening hours below:</DialogDescription>
                                            </DialogHeader>

                                            <section className="py-4">
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Click on the times below to book or unbook:
                                                </p>

                                                <div className="grid grid-cols-5 gap-2">
                                                    {hours.map((hour) => (
                                                        <Button 
                                                            key={hour} 
                                                            variant="outline" 
                                                            className={cn("h-10", selectedHours.includes(hour) && "border-2 border-emerald-500 text-primary")}
                                                            onClick={() => toggleHour(hour)}
                                                        >
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </section>

                                            <Button className="w-full" onClick={() => setDialogIsOpen(false)}>Save schedules</Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <FormField 
                                    control={form.control}
                                    name="timeZone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Select the time zone</FormLabel>
                                            <FormControl>

                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select your time zone" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {timeZones.map((zone) => (
                                                            <SelectItem key={zone} value={zone}>
                                                                {zone}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-500 hover:bg-emerald-400"
                                >
                                    Save changes
                                </Button>

                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <section className="mt-4">
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer"
                >
                    Log out
                </Button>
            </section>
        </div>
    )
}