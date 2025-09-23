import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServiceContent } from "./_components/service-content";
import { Suspense } from "react"; //Componente para mostrar que a pagina esta carregando enquanto a requisicao nao termina

export default async function Services(){
    const session = await getSession();
    
    if(!session){
        redirect("/");
    }

    return(
        <Suspense fallback={<div>Loading...</div>}>
            <ServiceContent userId={session.user?.id!}/>
        </Suspense>
    )
}