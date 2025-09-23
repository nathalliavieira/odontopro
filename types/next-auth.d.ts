import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface Session{
        user: User & DefaultSession["user"]
    }
}

interface User{
    id: string;
    name: string;
    email: string;
    emailVerified?: null | string | booleanstring;
    image?: string;
    stripe_customer_id?: string;
    times: string[];
    address?: string;
    phone?: string;
    status: booleanstring;
    createdAt: string;
    updatedAt: string;
}