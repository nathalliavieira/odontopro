import { Button } from "@/components/ui/button";
import Image from "next/image";
import doctorImage from "../../../../public/doctor-hero.png";
import Link from "next/link";

export function Hero(){
    return(
        <section className="bg-white">
            <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8 pb-4 sm:pb-0">
                <main className="flex items-center justify-center">
                    <article className="flex-[2] space-y-8 max-w-3xl flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">Find the best professionals in one place!</h1>
                        <p className="text-base md:text-lg text-gray-600">We are a platform for healthcare professionals focused on streamlining your care in a simplified and organized way.</p>

                        <Button className="bg-[#17b7a4] hover:bg-[#1cd9c3] cursor-pointer w-fit px-6 font-semibold"><Link href="/#professionals">Find a clinic</Link></Button> 
                        {/* w-fit do botao acima significa que a largura do botao vai ser apenas o tamanho do conteudo que tem dentro dele */}
                    </article>

                    <div className="hidden lg:block">
                        <Image src={doctorImage} alt="Illustrative photo health professional" width={340} height={400} className="object-contain" quality={100} priority/>
                    </div>
                </main>
            </div>
        </section>
    )
}