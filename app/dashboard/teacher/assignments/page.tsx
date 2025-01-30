"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react"; // Icônes pour les actions

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Récupérer les devoirs de l'enseignant connecté
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!auth.currentUser) {
        router.push("/login"); // Rediriger l'utilisateur si non connecté
        return;
      }

      try {
        const assignmentsQuery = query(
          collection(db, "assignments"),
          where("teacherId", "==", auth.currentUser.uid)
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const assignmentsData = assignmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des devoirs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      {/* En-tête */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Devoirs Créés</h1>
        <p className="text-center text-gray-600 mt-2">Voici la liste de vos devoirs créés</p>
      </div>

      {/* Liste des devoirs */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        {assignments.length === 0 ? (
          <div className="text-center text-gray-600">Aucun devoir créé pour l'instant.</div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p className="text-gray-600">{assignment.description}</p>
              <Button
                onClick={() => router.push(`/dashboard/teacher/assignments/${assignment.id}`)}
                className="w-full mt-2"
                size={"xl"}
              >
                Voir le devoir
              </Button>
            </div>
          ))
        )}

        {/* Bouton pour créer un nouveau devoir */}
        <Button
          onClick={() => router.push("/dashboard/teacher/assignments/create")}
          className="mt-6 w-full"
          size="xl"
        >
          <Plus className="mr-2" /> Créer un nouveau devoir
        </Button>
      </div>
    </div>
  );
}
