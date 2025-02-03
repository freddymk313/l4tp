import { render, screen, fireEvent } from "@testing-library/react";
import AssignmentDetails from "../app/dashboard/student/assignments/[id]/page";

test("Déposer un TP", async () => {
  render(<AssignmentDetails />);

  // Vérifier que le titre du devoir est affiché
  expect(screen.getByText("Titre du devoir")).toBeInTheDocument();

  // Simuler la saisie d'une description
  fireEvent.change(screen.getByPlaceholderText("Ajouter une description"), {
    target: { value: "Bonjour monsieur voici mon TP" },
  });

  // Simuler le téléchargement d'un fichier PDF
  //   const file = new File(['(⌐□_□)'], 'tp.pdf', { type: 'application/pdf' });
  //   const inputFile = screen.getByLabelText('Télécharger le fichier PDF');
  //   Object.defineProperty(inputFile, 'files', {
  //     value: [file],
  //   });
  //   fireEvent.change(inputFile);

  fireEvent.change(screen.getByPlaceholderText("Ajouter un lien de dépôt"), {
    target: { value: "https://mon-tp.com/depot" },
  });

  // Simuler le clic sur le bouton de dépôt
  fireEvent.click(screen.getByText("Déposer le TP"));

  // Vérifier que le message de succès est affiché
  expect(await screen.findByText("TP déposé!")).toBeInTheDocument();
});
