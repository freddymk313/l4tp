'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  description: string;
  fileURL: string;
  link: string;
  studentId: string;
  submissionType: "file" | "link";
  submittedAt: Date;
  studentName?: string; // Nouveau champ pour stocker le nom de l'étudiant
}

export default function TeacherSubmittedAssignments() {
  const [submittedAssignments, setSubmittedAssignments] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const assignmentsRef = collection(db, 'tps_submissions');
        const querySnapshot = await getDocs(assignmentsRef);

        const fetchedAssignments: AssignmentSubmission[] = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const studentId = data.studentId;

            // Récupérer le prénom et le nom depuis la collection "users"
            let studentName = "Anonyme";
            // console.log('studentId ', studentId);
            if (studentId) {
              const userRef = doc(db, "users", studentId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                // console.log('userData ', userData);
                studentName = `${userData.prenom || ''} ${userData.nom || ''}`.trim();
              }
            }
            // console.log('nom ', studentName);

            return {
              id: docSnapshot.id,
              assignmentId: data.assignmentId,
              description: data.description,
              fileURL: data.fileURL,
              link: data.link,
              studentId: studentId,
              submissionType: data.submissionType,
              submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date(),
              studentName: studentName, // Ajout du nom de l'étudiant récupéré
            };
          })
        );

        setSubmittedAssignments(fetchedAssignments);
      } catch (error) {
        console.error('Erreur lors de la récupération des TP déposés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedAssignments();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">TP déposés par les étudiants</h1>

      {submittedAssignments.length === 0 ? (
        <p className="text-gray-500">Aucun TP déposé pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {submittedAssignments.map(tp => (
            <li key={tp.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-gray-500">👤 Étudiant : <span className='font-semibold'>{tp.studentName}</span></p>
              <p className="text-gray-600">{tp.description}</p>

              {tp.link && (
                <a href={tp.link} target="_blank" rel="noopener noreferrer" className="text-green-500 block mt-2 hover:underline">
                  📎 {tp.link}
                </a>
              )}

              {tp.fileURL && (
                <a href={tp.fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 block mt-2 hover:underline">
                  📄 Télécharger le fichier
                </a>
              )}

              <p className="text-sm text-gray-500 mt-2">
                📅 Déposé le : {tp.submittedAt.toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
