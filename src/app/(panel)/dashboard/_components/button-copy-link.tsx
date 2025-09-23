"use client"

import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function ButtonCopyLink({userId}: {userId: string}){
    async function handleCopyLink(){
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/clinic/${userId}`);

        toast.success("Clinic appointment link copied successfully!");
    }

    return(
        <Button onClick={handleCopyLink}>
            <LinkIcon className="w-5 h-5" />
        </Button>
    )
}