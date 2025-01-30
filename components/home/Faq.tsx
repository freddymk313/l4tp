"use client"
import React, { useState } from "react";

const faqs = [
  {
    question: "Puis-je télécharger mon CV facilement ?",
    answer: "Oui, vous pouvez télécharger votre CV facilement au format PDF après l'avoir personnalisé.",
  },
  {
    question: "Quels types de modèles proposez-vous ?",
    answer: "Nous proposons des modèles professionnels, minimalistes, créatifs et modernes adaptés à divers secteurs.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument, nous prenons la confidentialité très au sérieux et vos données ne sont jamais partagées.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-6 md:px-16 lg:px-20 bg-background text-foreground">
      <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-4 border border-primary rounded-lg shadow-sm bg-white cursor-pointer"
            onClick={() => toggle(idx)}
          >
            <h3 className="flex justify-between items-center">
              {faq.question}
              <span>{openIndex === idx ? "-" : "+"}</span>
            </h3>
            {openIndex === idx && <p className="mt-2 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
