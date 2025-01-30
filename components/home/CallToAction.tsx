import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function CallToAction() {
  return (
    <section className="py-12 bg-white text-center px-4 md:px-14 lg:px-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à créer votre CV parfait ?</h2>
      <p className="mb-6 text-gray-600">
        Ne perdez plus de temps. Lancez-vous dès maintenant et créez un CV professionnel qui fera la différence.
      </p>
      <Link
        href="/creer-cv"
        className="mb-4"
      >
        <Button size={"xl"}>Créer mon CV</Button>
      </Link>
    </section>
  );
}
