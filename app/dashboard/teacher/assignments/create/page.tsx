"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function CreateTP() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [link, setLink] = useState<string>(""); // Pour gérer les liens ou fichiers
  const [status, setStatus] = useState("Ouvert"); // Statut initial : Ouvert
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fonction pour créer un TP
  const handleCreateTP = async () => {
    if (!auth.currentUser) {
      router.push("/login"); // Rediriger l'utilisateur si non connecté
      return;
    }

    if (!title || !description || !dueDate || !link) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);

    try {
      const tpRef = collection(db, "tps");
      await addDoc(tpRef, {
        title,
        description,
        dueDate,
        link,
        status,
        teacherId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      alert("TP créé avec succès !");
      router.push("/dashboard/teacher/assignments"); // Rediriger vers la liste des TP
    } catch (error) {
      console.error("Erreur lors de la création du TP:", error);
      alert("Une erreur est survenue lors de la création du TP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Créer un Nouveau TP
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Remplissez les informations pour créer un TP.
        </p>
      </div>

      {/* Formulaire de création de TP */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        {/* Titre */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold" htmlFor="title">
            Titre du TP
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre du TP"
            className="mt-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold" htmlFor="description">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Entrez la description du TP"
            rows={4}
            className="mt-2"
            required
          />
        </div>

        {/* Date limite */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">
            Date limite de dépôt
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mt-2 w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Pièces jointes */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold" htmlFor="attachment">
            Lien fichier Drive ou Github
          </label>
          <Input
            id="attachment"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Entrez un lien"
            className="mt-2"
            required
          />
        </div>

        {/* Statut */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold" htmlFor="status">
            Statut du TP
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 border-gray-300 rounded-md p-2"
          >
            <option value="Ouvert">Ouvert</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>

        {/* Bouton pour créer le TP */}
        <Button
          onClick={handleCreateTP}
          className="w-full mt-6"
          size="xl"
          disabled={loading}
        >
          <Save className="mr-2" />
          {loading ? "Création en cours..." : "Créer le TP"}
        </Button>
      </div>
    </div>
  );
}
