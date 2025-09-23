import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/professionals";
import { Footer } from "./_components/footer";
import { getProfessionals } from "./_data-access/get-professionals";

export const revalidate = 120; //Revalidacao de cache a cada 120 seg, 2 min.

export default async function Home(){
  const professionals = await getProfessionals();
  
  return(
    <div className="flex flex-col min-h-screen">
      <Header />

      <div>
        <Hero />
        <Professionals professionals={professionals || []}/>
        <Footer />
      </div>
    </div>
  )
}