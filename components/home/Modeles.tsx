"use client";
import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { models } from "@/constants";

export default function Models() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {}, 1000);

    return () => clearInterval(interval);
  }, [controls]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 bg-background text-foreground">
      <div className="px-4 md:px-14 lg:px-20">
        <div className="md:px-24">
          <h2 className="text-2xl md:text-3xl text-center font-bold mb-2">
            Modèles
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Découvrez nos modèles modernes et professionnels spécialement conçus
            pour mettre en avant vos compétences et expériences. Choisissez
            celui qui reflète le mieux votre personnalité et démarquez-vous
            auprès des recruteurs.
          </p>
        </div>

        <div className="relative ">
          {/* Bouton gauche */}
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 -left-3 transform bg-primary -translate-y-1/2 text-primary-foreground p-1 rounded-full z-10 shadow-md"
          >
            <ChevronLeft size={20} />
          </button>

          <motion.div
            ref={containerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4"
            animate={controls}
          >
            {models.map((model, idx) => (
              <div
                key={idx}
                className="min-w-[250px] relative group bg-white rounded-lg shadow-sm p-2 md:p-3 flex-shrink-0"
              >
                <Image
                  src={model.image}
                  alt={model.name}
                  height={500}
                  width={500}
                  className="w-full h-80 object-cover rounded-md transition-opacity duration-300 group-hover:opacity-40"
                />
                
                <Link
                  href={`/creer-cv?selected=${idx}`} passHref
                  className="absolute inset-0 flex justify-center items-center *bg-black/50 *text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                >
                  <Button size={"xl"}>Utiliser</Button>
                </Link>
              </div>
            ))}
          </motion.div>

          {/* Bouton droit */}
          <button
            onClick={scrollRight}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-primary text-primary-foreground p-1 rounded-full z-10 shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
