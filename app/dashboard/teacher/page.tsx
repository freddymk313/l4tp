"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react"; // Ajout d'icônes

export default function TeacherDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter();

  // Vérifie l'état de l'utilisateur connecté
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        router.push("/login"); // Rediriger l'utilisateur vers la page de connexion s'il n'est pas connecté
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("Utilisateur non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignments = async () => {
      try {
        const assignmentsSnapshot = await getDocs(collection(db, "tps"));
        const assignmentsData = assignmentsSnapshot.docs.map((doc) => doc.data());
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des devoirs:", error);
      }
    };

    fetchUserData();
    fetchAssignments();
  }, [router]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center">Chargement...</div>;
  }

  if (!userData) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      {/* En-tête */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Tableau de bord - Enseignant</h1>
        <p className="text-center text-gray-600 mt-2">Bienvenue dans votre espace enseignant</p>
      </div>

      {/* Informations personnelles */}
      {/* <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <User className="mr-2" /> Informations personnelles
        </h2>
        <div className="mb-4">
          <strong className="text-gray-700">Email :</strong> {userData.email}
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Rôle :</strong> {userData.role}
        </div>
      </div> */}

      {/* Mes Devoirs */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2" /> Mes Devoirs
        </h2>
        {assignments.length === 0 ? (
          <div>Aucun devoir créé.</div>
        ) : (
          assignments.map((assignment, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 flex items-center justify-between rounded-lg shadow-md mb-4"
            >
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p className="text-primary">{assignment.status}</p>
              {/* <button
                onClick={() =>
                  router.push(`/dashboard/teacher/assignments/${assignment.id}`)
                }
                className="mt-2 py-2 px-4 border-2 border-blue-500 text-blue-500 bg-transparent rounded-full flex items-center"
              >
                Voir le devoir
              </button> */}
            </div>
          ))
        )}
        <Button
          onClick={() => router.push("/dashboard/teacher/assignments/create")}
          className="w-full mt-4"
          size={"xl"}
        >
          Créer un nouveau devoir
        </Button>
      </div>
    </div>
  );
}
