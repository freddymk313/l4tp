"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle } from "lucide-react"; // Ajout d'icônes

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!auth.currentUser) {
        router.push("/login"); // Rediriger l'utilisateur si pas connecté
        return;
      }

      try {
        const assignmentsRef = collection(db, "assignments");
        const q = query(assignmentsRef, where("studentId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const fetchedAssignments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAssignments(fetchedAssignments);
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
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Mes devoirs</h1>
        <p className="text-center text-gray-600 mt-2">Voici la liste de vos devoirs à compléter.</p>
      </div>

      {/* Liste des devoirs */}
      <div className="w-full max-w-4xl space-y-4">
        {assignments.length > 0 ? (
          assignments.map(assignment => (
            <div key={assignment.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2" />
                  {assignment.title}
                </h2>
                <span className={`text-sm font-semibold ${assignment.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                  {assignment.status === "completed" ? "Terminé" : "En cours"}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{assignment.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="mr-2" />
                  Date limite : {new Date(assignment.dueDate.seconds * 1000).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => router.push(`/dashboard/student/assignments/${assignment.id}`)}
                  className="w-1/3"
                  size={"xl"}
                >
                  Voir
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">Aucun devoir.</div>
        )}
      </div>
    </div>
  );
}
