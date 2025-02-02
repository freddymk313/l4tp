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
import { Calendar } from "@/components/ui/calendar";

export default function CreateTP() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [submissionType, setSubmissionType] = useState("link"); // "pdf" ou "link"
  const [link, setLink] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Ouvert");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleCreateTP = async () => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (!title || !description || !dueDate) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // if (submissionType === "link" && !link) {
    //   alert("Veuillez fournir un lien de dépôt !");
    //   return;
    // }

    // if (submissionType === "pdf" && !pdfFile) {
    //   alert("Veuillez joindre un fichier PDF !");
    //   return;
    // }

    setLoading(true);

    try {
      const tpRef = collection(db, "tps");
      await addDoc(tpRef, {
        title,
        description,
        dueDate,
        submissionType,
        submissionValue: submissionType === "link" ? link : "pdf_uploaded", // Remplace avec l'URL après upload
        status,
        teacherId: auth.currentUser.uid,
        createdAt: new Date(),
      });

      alert("TP créé avec succès !");
      router.push("/dashboard/teacher/assignments");
    } catch (error) {
      console.error("Erreur lors de la création du TP:", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Créer un Nouveau TP
        </h1>
      </div>

      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Titre du TP</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

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
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Choix du format de dépôt */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Format du dépôt</label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="link"
                checked={submissionType === "link"}
                onChange={() => setSubmissionType("link")}
              />
              Lien
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="pdf"
                checked={submissionType === "pdf"}
                onChange={() => setSubmissionType("pdf")}
              />
              Fichier PDF
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Statut du TP</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 border-gray-300 rounded-md p-2 w-full"
          >
            <option value="Ouvert">Ouvert</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>

        <Button onClick={handleCreateTP} size={"xl"} className="w-full mt-6" disabled={loading}>
          <Save className="mr-2" />
          {loading ? "Création en cours..." : "Créer le TP"}
        </Button>
      </div>
    </div>
  );
}
