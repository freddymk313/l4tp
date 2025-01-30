import React from "react";
import { FolderOpen, Edit3, Download } from "lucide-react"; // Importation des icônes nécessaires

export default function HowItWorks() {
  const steps = [
    {
      icon: FolderOpen,
      title: "Choisir un modèle",
      description: "Parcourez notre collection de modèles professionnels et sélectionnez celui qui vous correspond.",
    },
    {
      icon: Edit3,
      title: "Remplir le formulaire",
      description: "Saisissez vos informations personnelles et professionnelles facilement.",
    },
    {
      icon: Download,
      title: "Télécharger votre CV",
      description: "Générez votre CV en un clic et téléchargez-le au format PDF prêt à être partagé.",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-14 lg:px-20 bg-white mt-12">
      <div className="md:px-24">
        <h2 className="text-3xl font-bold text-center mb-4">Comment Ça Marche ?</h2>
        <p className="text-gray-600 text-center mb-8">
          Créez votre CV professionnel en trois étapes simples et rapides. Suivez notre processus convivial pour obtenir un résultat de qualité en un rien de temps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 border border-primary"
          >
            <div className="mb-4 p-4 bg-primary rounded-full text-white">
              <step.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
