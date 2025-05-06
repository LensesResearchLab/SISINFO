"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPostgraduateThesisById,
  postThesisApplication,
} from "@/app/services/thesis.service";
import { Thesis } from "@/app/types/thesis.type";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { use, useEffect, useState } from "react";
import SpinnerPage from "@/components/shared/spinner-page";
import { useQuery } from "@tanstack/react-query";
import { useThesisInscriptionStore } from "./store";
import { ROUTES } from "@/app/routes";
import {
  ThesisDetailCard,
  ThesisNotFound,
} from "@/components/shared/thesis-detail-card";
import { useAuth } from "@/hooks/use-auth";

/**
 * ThesisInscription Component
 *
 * Main component for handling thesis inscription functionality.
 * Displays thesis details and application form based on user interaction.
 *
 * Features:
 * - Fetches thesis details using the provided ID
 * - Handles loading and error states
 * - Toggles between details view and application form
 * - Resets application state when ID changes
 *
 * @param {Object} params - URL parameters containing thesis ID
 */
export default function ThesisInscription({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reset = useThesisInscriptionStore((state) => state.reset);

  const {
    data: thesis,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-thesis-application", id],
    queryFn: () => getPostgraduateThesisById(id),
  });

  const isApplying = useThesisInscriptionStore((state) => state.isApplying);

  useEffect(() => {
    reset();
  }, [id, reset]);

  if (isFetching) return <SpinnerPage />;
  if (error || !thesis) return <ThesisNotFound />;
  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      {!isApplying && <ThesisDetails thesis={thesis} />}
      {isApplying && <ThesisApplying thesis={thesis} />}
    </div>
  );
}

/**
 * ThesisDetails Component
 *
 * Displays comprehensive information about a thesis project in a structured card layout.
 * Shows title, description, areas of interest, and other metadata.
 *
 * Features:
 * - Organized sections for different types of information
 * - Responsive layout with appropriate spacing
 * - Apply button to initiate the application process
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing all project details
 *
 * @returns {JSX.Element} Card with formatted thesis information
 */
function ThesisDetails({ thesis }: { readonly thesis: Thesis }) {
  const setIsApplying = useThesisInscriptionStore(
    (state) => state.setIsApplying
  );
  return (
    <ThesisDetailCard thesis={thesis}>
      <Button
        className="w-40 mx-auto block"
        onClick={() => setIsApplying(true)}
      >
        Aplicar
      </Button>
    </ThesisDetailCard>
  );
}

/**
 * ThesisApplying Component
 *
 * Handles the thesis application process with a form interface.
 * Allows students to submit their motivation and indicate contact status.
 *
 * Features:
 * - Form with text area for motivation statement
 * - Contact status checkbox
 * - Confirmation modal before submission
 * - Navigation back to thesis details
 * - Success feedback after submission
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing project details
 *
 * @returns {JSX.Element} Card containing the application form interface
 */
function ThesisApplying({ thesis }: { readonly thesis: Thesis }) {
  const setIsApplying = useThesisInscriptionStore(
    (state) => state.setIsApplying
  );
  const motivation = useThesisInscriptionStore((state) => state.motivation);
  const setMotivation = useThesisInscriptionStore(
    (state) => state.setMotivation
  );
  const contacted = useThesisInscriptionStore((state) => state.contacted);
  const setContacted = useThesisInscriptionStore((state) => state.setContacted);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const thesisId = thesis.id;
    const userId = user?.id;
    console.log(userId);

    if (!thesisId || !userId) {
      console.log("Error: Missing thesis ID or user ID.");
      return;
    }

    postThesisApplication(thesisId, userId);
    alert("Aplicación enviada con éxito");
  };

  const modalProps = {
    title: "¿Estás seguro de aplicar a esta tesis?",
    description: "Recuerda que una vez aplicas no podrás cambiar tu decisión",
    buttonText: "Aplicar",
    successTitle: "¡Aplicación enviada!",
    successText: "Tu aplicación ha sido enviada con éxito",
    url: `${ROUTES.HOME}/${ROUTES.UNDERGRADUATE_THESIS_STATUS}`,
  };

  return (
    <Card className="w-full mx-auto shadow-lg border-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-medium text-core-highlight">
          {thesis.title}
        </CardTitle>
        <ButtonBack setIsApplying={setIsApplying} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfessorInformation thesis={thesis} />
          <MotivationTextArea
            motivation={motivation}
            setMotivation={setMotivation}
          />
          <ContactedCheckbox
            contacted={contacted}
            setContacted={setContacted}
          />

          <div className="flex justify-center pt-3.5">
            <Button type="button" onClick={() => setIsConfirmed(true)}>
              Aplicar
            </Button>
            <ConfirmationModal
              dialogText={modalProps}
              onConfirm={handleSubmit}
              open={isConfirmed}
              setIsOpen={setIsConfirmed}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * ButtonBack Component
 *
 * Renders a button that allows users to return to the thesis details view.
 * Provides visual feedback through icon and styling.
 *
 * Features:
 * - Clear visual indication of purpose with icon
 * - Consistent styling with the application
 * - Interactive hover effects
 * - Compact size for secondary action
 *
 * @param {Object} props - Component props
 * @param {Function} props.setIsApplying - Function to toggle application form visibility
 *
 * @returns {JSX.Element} Styled button for returning to thesis details
 */
function ButtonBack({
  setIsApplying,
}: {
  readonly setIsApplying: (value: boolean) => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-core-highlight hover:text-core-highlight border-core hover:border-core-highlight hover:bg-sky-50"
      onClick={() => setIsApplying(false)}
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver detalles
    </Button>
  );
}

/**
 * ProfessorInformation Component
 *
 * Displays the professor's contact information for the thesis project.
 * Includes name and interactive email link.
 *
 * Features:
 * - Clear presentation of professor name
 * - Interactive email link with icon
 * - Visual feedback on interaction
 * - Semantic grouping of related information
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing professor details
 *
 * @returns {JSX.Element} Section with formatted professor information
 */
function ProfessorInformation({ thesis }: { readonly thesis: Thesis }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <h2 className="text-lg font-semibold">
          Profesor:{" "}
          <span className="text-gray-900 font-normal">
            {thesis.professor.user.name}
          </span>
        </h2>
        <a
          href={`mailto:${thesis.professor.user.email}`}
          className="text-core-highlight hover:underline inline-flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {thesis.professor.user.email}
        </a>
      </div>
    </div>
  );
}

/**
 * MotivationTextArea Component
 *
 * Provides a text input area for students to express their motivation and relevant experience.
 * Includes descriptive label and appropriate styling.
 *
 * Features:
 * - Descriptive label explaining purpose
 * - Controlled component with state management
 * - Appropriate sizing for detailed responses
 * - Placeholder text for guidance
 *
 * @param {Object} props - Component props
 * @param {string} props.motivation - Current motivation text value
 * @param {function} props.setMotivation - Function to update motivation text
 *
 * @returns {JSX.Element} Labeled textarea for motivation input
 */
function MotivationTextArea({
  motivation,
  setMotivation,
}: {
  readonly motivation: string;
  readonly setMotivation: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">
        Escribe aquí las razones por las que quieres aplicar y tus conocimientos
        relevantes
      </label>
      <Textarea
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        placeholder="Describe tus motivaciones y experiencia"
        className="min-h-[200px] resize-none"
      />
    </div>
  );
}

/**
 * ContactedCheckbox Component
 *
 * Provides a checkbox for students to indicate if they have contacted the professor.
 * Includes accessible label and state management.
 *
 * Features:
 * - Accessible checkbox with associated label
 * - Controlled component with state management
 * - Visual styling consistent with application
 * - Clear labeling of purpose
 *
 * @param {Object} props - Component props
 * @param {boolean} props.contacted - Current checkbox state
 * @param {function} props.setContacted - Function to update checkbox state
 *
 * @returns {JSX.Element} Labeled checkbox for indicating professor contact
 */
function ContactedCheckbox({
  contacted,
  setContacted,
}: {
  readonly contacted: boolean;
  readonly setContacted: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="contacted"
        checked={contacted}
        onCheckedChange={(checked) => setContacted(checked as boolean)}
      />
      <label
        htmlFor="contacted"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Contacté al profesor por otro medio
      </label>
    </div>
  );
}
