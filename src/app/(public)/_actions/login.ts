"use server"

import { signIn } from "@/lib/auth";

type LoginType = "google" | "github";

export async function handleRegister(provider: LoginType){
    if(provider === "google"){
        await signIn(provider, {
            redirectTo: "/dashboard",
            prompt: "select_account"
        });
    }else{
        await signIn(provider, {redirectTo: "/dashboard"});
    }
}