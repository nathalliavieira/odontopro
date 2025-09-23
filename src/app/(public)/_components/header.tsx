"use client"

import Image from "next/image";
import Link from "next/link";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger, //acao de disparar para abrir ao lado da pagina. nada mais é do que o botao
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";

export function Header(){
    const {data: session, status} = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "#professionals", label: "Professionals" },
        // { href: "/contatos", label: "Contatos" }
    ];

    async function handleLogin(){
        await handleRegister("google");
    }

    const NavLinks = () => (
        <>
            {navItems.map((item) => (
                <Button key={item.href} asChild className="bg-transparent hover:bg-transparent hover:text-[#17b7a4] text-black shadow-none p-0 h-auto min-h-0" onClick={() => setIsOpen(false)}>
                    <Link href={item.href} className="text-base">{item.label}</Link>
                </Button>
            ))}

            {status === "loading" ? (
                <></>
            ) : session ? (
                <div className="flex items-center justify-between gap-2">
                    <div className="relative w-8 h-8">
                        <Image src={session?.user?.image!} alt="Foto de perfil" fill className="object-cover rounded-full" />
                    </div>
                    <Link href="/dashboard" className="hover:text-[#17b7a4] text-black text-sm font-medium shadow-none p-0 h-auto min-h-0">
                        Panel
                    </Link>
                </div>
            ) : (
                <Button onClick={handleLogin}>
                    <LogIn/>
                    Clinic profile
                </Button>
            )}
        </>
    )

    return(
        <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white">
            
            <div className="container mx-auto flex items-center justify-between">

                <Link href="/">
                    <Image src="/logo-odonto.png" alt="logo image" width={200} height={200}/>
                </Link>

                <nav className="hidden md:flex items-center space-x-4">
                    <NavLinks/>
                </nav>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden"> 
                        <Button 
                            className="text-black hover:bg-transparent" 
                            variant="ghost" 
                            size="icon"
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[240px] gap-2 px-2 sm:w-[300px] z-[9999]">

                        <SheetTitle>Menu</SheetTitle>
                        <SheetHeader className="gap-0 p-0"></SheetHeader>
                        <SheetDescription>See our links:</SheetDescription>

                        <nav className="flex flex-col items-start mt-4 gap-2 ">
                            <NavLinks/>
                        </nav>

                    </SheetContent>

                </Sheet>

            </div>

        </header>
    )
}