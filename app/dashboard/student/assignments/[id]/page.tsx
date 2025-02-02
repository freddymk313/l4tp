'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: any;
  status: string;
  submissionType: 'pdf' | 'link';
}

export default function AssignmentDetails() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAssignment = async () => {
      try {
        const assignmentId = Array.isArray(id) ? id[0] : id;
        const docRef = doc(db, 'tps', assignmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssignment({
            id: docSnap.id,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            status: data.status,
            submissionType: data.submissionType || 'pdf', // Par défaut en PDF
          });
        } else {
          console.log('Aucun devoir trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du devoir:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleSubmission = async () => {
    if (!assignment) return;

    if (!auth.currentUser) {
      setMessage("Vous devez être connecté pour déposer un TP.");
      return;
    }

    if (assignment.submissionType === 'pdf' && !file) {
      setMessage('Veuillez sélectionner un fichier PDF.');
      return;
    }

    if (assignment.submissionType === 'link' && !link.trim()) {
      setMessage('Veuillez entrer un lien valide.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      let fileURL = '';

      // if (assignment.submissionType === 'pdf' && file) {
      //   const storageRef = ref(storage, `tps_submissions/${auth.currentUser.uid}/${file.name}`);
      //   await uploadBytes(storageRef, file);
      //   fileURL = await getDownloadURL(storageRef);
      // }

      // Enregistrer dans Firestore
      const submissionRef = doc(db, 'tps_submissions', `${auth.currentUser.uid}_${id}`);
      await setDoc(submissionRef, {
        studentId: auth.currentUser.uid,
        assignmentId: id,
        submissionType: assignment.submissionType,
        fileURL: assignment.submissionType === 'pdf' ? fileURL : '',
        link: assignment.submissionType === 'link' ? link : '',
        description,
        submittedAt: new Date(),
      });

      setMessage('TP déposé!');
      setFile(null);
      setLink('');
      setDescription('');
    } catch (error) {
      console.error('Erreur lors du dépôt du TP:', error);
      setMessage('Une erreur est survenue lors du dépôt.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className='text-center text-gray-500'>Chargement...</div>;
  if (!assignment) return <div className='text-center text-red-500'>Devoir introuvable.</div>;

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6'>
      <h1 className='text-2xl font-bold text-gray-800'>{assignment.title}</h1>
      <p className='text-gray-600 mt-2'>
        {assignment.description}
      </p>

      <div className='mt-4'>
        <p className='text-sm text-gray-500'>📅 Date limite: {new Date(assignment.dueDate.toDate()).toLocaleDateString()}</p>
        <p className='text-sm text-gray-500'>🚀 Statut: <span className='font-medium'>{assignment.status}</span></p>
      </div>

      <div className='mt-6 flex gap-4'>
        <Link href='/dashboard/teacher/assignments'>
          <span className='text-blue-500 hover:underline cursor-pointer'>⬅ Retour</span>
        </Link>
      </div>

      {/* Section Déposer TP */}
      <div className='mt-6 p-4 border border-gray-300 rounded-lg'>
        <h2 className='text-lg font-semibold text-gray-800'>📤 Déposer votre TP</h2>
        {message && <p className='mt-2 text-green-700 bg-green-200 text-center p-2 rounded-lg'>{message}</p>}
        
        <Textarea
          className='mt-2'
          placeholder='Ajouter une description'
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        {assignment.submissionType === 'pdf' ? (
          <Input
            type='file'
            accept='application/pdf'
            className='mt-2'
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        ) : (
          <Input
            type='text'
            className='mt-2'
            placeholder='Entrez le lien de votre TP'
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        )}

        <Button
          onClick={handleSubmission}
          className='mt-4 w-full'
          size={"xl"}
          disabled={uploading}
        >
          {uploading ? 'Dépôt en cours...' : 'Déposer le TP'}
        </Button>
      </div>
    </div>
  );
}
