import Link from "next/link";
import { Button } from "../ui/button";
// import Link from "next/navigation"

export default function Hero() {
  return (
    <section className="text-foreground py-32 md:py-52 flex items-center justify-center">
      <div className="px-4 md:px-19 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Créez votre CV parfait</h1>
        <p className="text-gray-600 mb-6">
          Découvrez nos modèles modernes et professionnels. Commandez le vôtre dès aujourd'hui !
        </p>
        
        <div className="flex items-center justify-center gap-x-1.5 md:gap-x-3">
          <Link href={"/modeles"}>
            <Button size={"xl"} variant={"ghost"} className="border border-primary">
              Voir les modèles
            </Button>
          </Link>
          <Link href={"/creer-cv"}>
            <Button size={"xl"} className="border border-primary">
            Créer un CV
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
