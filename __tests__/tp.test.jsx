import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssignmentDetails from '../app/dashboard/student/assignments/[id]/page';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { db, auth } from '@/lib/firebase';
import { getDoc, setDoc } from 'firebase/firestore';

jest.mock('../lib/firebase.ts', () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
  },
  auth: {
    currentUser: {
      uid: 'test_user_id',
    },
  },
}));

describe('AssignmentDetails - Dépôt de TP', () => {
  const mockAssignment = {
    id: 'assignment_id_123',
    title: 'Devoir de Test',
    description: 'Ceci est un devoir de test.',
    dueDate: { toDate: () => new Date() },
    status: 'Open',
    submissionType: 'pdf', // Changer à 'link' pour tester le type de soumission par lien
  };

  beforeEach(() => {
    // Simuler la récupération du devoir
    (getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockAssignment,
      id: mockAssignment.id,
    });
  });

  it('devrait soumettre un TP avec succès (PDF)', async () => {
    render(
      <MemoryRouter initialEntries={[`/assignments/${mockAssignment.id}`]}>
        <Routes>
          <Route path="/assignments/:id" element={<AssignmentDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Attendre que le devoir soit chargé
    await waitFor(() => screen.getByText(mockAssignment.title));

    // Sélectionner un fichier PDF fictif
    const fileInput = screen.getByLabelText('Déposer votre TP');
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ajouter une description
    const descriptionInput = screen.getByPlaceholderText('Ajouter une description');
    fireEvent.change(descriptionInput, { target: { value: 'Mon devoir de test' } });

    // Simuler le clic sur le bouton de dépôt
    const submitButton = screen.getByRole('button', { name: /Déposer le TP/i });
    fireEvent.click(submitButton);

    // Attendre que le message de succès apparaisse
    await waitFor(() => screen.getByText('TP déposé!'));

    // Vérifier que le message de succès est bien affiché
    expect(screen.getByText('TP déposé!')).toBeInTheDocument();

    // Vérifier que la fonction `setDoc` a été appelée pour enregistrer le dépôt dans Firestore
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
      studentId: 'test_user_id',
      assignmentId: mockAssignment.id,
      submissionType: 'pdf',
      description: 'Mon devoir de test',
    }));
  });

  it('devrait afficher un message d\'erreur si aucun fichier PDF n\'est sélectionné', async () => {
    render(
      <MemoryRouter initialEntries={[`/assignments/${mockAssignment.id}`]}>
        <Routes>
          <Route path="/assignments/:id" element={<AssignmentDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Attendre que le devoir soit chargé
    await waitFor(() => screen.getByText(mockAssignment.title));

    // Ajouter une description sans fichier
    const descriptionInput = screen.getByPlaceholderText('Ajouter une description');
    fireEvent.change(descriptionInput, { target: { value: 'Mon devoir sans fichier' } });

    // Simuler le clic sur le bouton de dépôt
    const submitButton = screen.getByRole('button', { name: /Déposer le TP/i });
    fireEvent.click(submitButton);

    // Vérifier que le message d'erreur est affiché
    await waitFor(() => screen.getByText('Veuillez sélectionner un fichier PDF.'));
    expect(screen.getByText('Veuillez sélectionner un fichier PDF.')).toBeInTheDocument();
  });
});
