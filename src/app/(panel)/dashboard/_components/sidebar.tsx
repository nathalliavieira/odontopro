"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx"; //ja vem instalado quando instalamos o shadcn. Serve para fazermos a renderizacao condicional com o tailwind de forma mais fácil
import Image from "next/image";
import logoImage from "../../../../../public/logo-odonto.png";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, Settings } from "lucide-react";
import Link from "next/link";

import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible";

export function SidebarDashboard({children}: {children: React.ReactNode}){
    const pathname = usePathname(); //Vamos coletar o nome da rota em que estamos para deixarmos em envidencia posteriormente (no nosso caso em azul) no sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    return(
        <div className="flex min-h-screen w-full">

            <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
                "w-20": isCollapsed,
                "w-64": !isCollapsed,
                "hidden md:flex md:fixed": true
            })}>
                <div className="mb-6 mt-4">
                    {!isCollapsed && (
                        <Link href="/">
                            <Image src={logoImage} alt="Logo do odontoPRO" priority quality={100}/>
                        </Link>
                    )}
                </div>

                <Button className={clsx("bg-gray-100 hover:bg-gray-50 text-zinc-900 mb-2 cursor-pointer", {
                    "self-end": !isCollapsed,
                    "self-center w-12": isCollapsed
                })} onClick={() => setIsCollapsed(!isCollapsed)}>
                    {!isCollapsed ? <ChevronLeft className="w-12 h-12" /> : <ChevronRight className="w-12 h-12" />}
                </Button>

                {/* Mostrar apenas quando a sidebar estiver recolhida */}
                {isCollapsed && (
                    <nav className="flex flex-col gap-2 overflow-hidden mt-2">
                        <SidebarLink 
                            href="/dashboard"
                            label="Appointments"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<CalendarCheck2 className="w-6 h-6"/>}
                        />
                        <SidebarLink 
                            href="/dashboard/services"
                            label="Services"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Folder className="w-6 h-6"/>}
                        />
                        <SidebarLink 
                            href="/dashboard/profile"
                            label="My profile"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Settings className="w-6 h-6"/>}
                        />
                        <SidebarLink 
                            href="/dashboard/plans"
                            label="Plans"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Banknote className="w-6 h-6"/>}
                        />
                    </nav>
                )}


                <Collapsible open={!isCollapsed}>
                    <CollapsibleContent>
                        <nav className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Panel
                            </span>

                            <SidebarLink 
                                href="/dashboard"
                                label="Appointments"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                                icon={<CalendarCheck2 className="w-6 h-6"/>}
                            />
                            <SidebarLink 
                                href="/dashboard/services"
                                label="Services"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                                icon={<Folder className="w-6 h-6"/>}
                            />

                            <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                                Settings
                            </span>

                            <SidebarLink 
                                href="/dashboard/profile"
                                label="My profile"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                                icon={<Settings className="w-6 h-6"/>}
                            />
                            <SidebarLink 
                                href="/dashboard/plans"
                                label="Plans"
                                pathname={pathname}
                                isCollapsed={isCollapsed}
                                icon={<Banknote className="w-6 h-6"/>}
                            />
                        </nav>
                    </CollapsibleContent>
                </Collapsible>
            </aside>

            <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
                "md:ml-20": isCollapsed,
                "md:ml-64": !isCollapsed
            })}>

                <header className="md:hidden flex items-center justify-between border-b px-4 md:px-6 h-14 z-10 sticky top-0 bg-white">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="md:hidden"
                                    onClick={() => setIsCollapsed(false)}
                                >
                                    <List className="w-5 h-5"/>
                                </Button>
                            </SheetTrigger>

                            <h1 className="text-base md:text-lg font-semibold">Menu OdontoPRO</h1>
                        </div>

                        <SheetContent side="right" className="sm:max-w-xs text-black gap-0 px-2">
                            <SheetTitle>OdontoPRO</SheetTitle>
                            <SheetDescription></SheetDescription>

                            <div className="mt-6">
                                <p className="text-gray-500 text-sm">DASHBOARD</p>
                                <nav className="grid gap-2 text-base mt-2">
                                    <SidebarLink 
                                        href="/dashboard"
                                        label="Appointments"
                                        pathname={pathname}
                                        isCollapsed={isCollapsed}
                                        icon={<CalendarCheck2 className="w-6 h-6"/>}
                                    />
                                    <SidebarLink 
                                        href="/dashboard/services"
                                        label="Services"
                                        pathname={pathname}
                                        isCollapsed={isCollapsed}
                                        icon={<Folder className="w-6 h-6"/>}
                                    />
                                </nav>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-500 text-sm">MINHA CONTA</p>
                                <nav className="grid gap-2 text-base mt-2">
                                    <SidebarLink 
                                        href="/dashboard/profile"
                                        label="My profile"
                                        pathname={pathname}
                                        isCollapsed={isCollapsed}
                                        icon={<Settings className="w-6 h-6"/>}
                                    />
                                    <SidebarLink 
                                        href="/dashboard/plans"
                                        label="Plans"
                                        pathname={pathname}
                                        isCollapsed={isCollapsed}
                                        icon={<Banknote className="w-6 h-6"/>}
                                    />
                                </nav>
                            </div>
                        </SheetContent>

                    </Sheet>
                </header>

                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>
            </div>

        </div>
    )
}

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string;
    isCollapsed: boolean
};

function SidebarLink({href, icon, isCollapsed, label, pathname}: SidebarLinkProps){
    return(
        <Link href={href}>
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
                "text-white bg-blue-500": pathname === href,
                "text-gray-700 hover:bg-gray-100": pathname !== href
            })}>
                <span className="w-6 h-6">{icon}</span>
                {!isCollapsed && <span>{label}</span>}
            </div>
        </Link>
    )
}