"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Users,
  FileText,
  Briefcase,
  CheckCircle2,
  User,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Assistance, Requirement } from "@/app/types/assistance.type";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";

import { ROUTES } from "@/app/routes";
import SpinnerPage from "@/components/shared/spinner-page";
import { getGraduatedAssistanceById } from "@/app/services/assistance.service";

interface AssistanceProps {
  assistance: Assistance;
  setIsApplying: (value: boolean) => void;
}

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

/**
 * AssistanceDetails Component
 *
 * Main component for displaying and managing graduate assistance position details and application process.
 *
 * States:
 * - assistance: Object containing all details about the assistance position
 * - isApplying: Boolean to toggle between details view and application form
 * - isLoading: Boolean to track data fetching state
 *
 * Features:
 * - Fetches and displays assistance details
 * - Handles navigation and 404 errors
 * - Toggles between information display and application form
 * - Shows loading state during data fetch
 *
 * @returns {JSX.Element} A div containing either assistance details or application form
 */
export default function AssistanceDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [assistance, setAssistance] = useState<Assistance>({
    id: "",
    title: "",
    clasification: "",
    publication_date: new Date(),
    end_date: new Date(),
    start_semester: "",
    description: "",
    requirements: [],
    professor: {
      name: "",
      email: "",
    },
  });

  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return router.push("/404");
      try {
        const data = await getGraduatedAssistanceById(id as string);
        console.log(data);
        setAssistance(data);
      } catch {
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <SpinnerPage />;
  }

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {!isApplying ? (
        <AssistanceInscription
          assistance={assistance}
          setIsApplying={setIsApplying}
        />
      ) : (
        <AssistanceApplying
          assistance={assistance}
          setIsApplying={setIsApplying}
        />
      )}
    </div>
  );
}

/**
 * AssistanceInscription Component
 *
 * Displays detailed information about the assistance position including main info,
 * requirements, and contact details.
 *
 * Props:
 * - assistance: Assistance object containing position details
 * - setIsApplying: Function to toggle application state
 *
 * Layout:
 * - Card container with header and content sections
 * - Organized sections for different types of information
 * - Apply button at the bottom
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Card containing assistance position details
 */
function AssistanceInscription({
  assistance,
  setIsApplying,
}: {
  assistance: Assistance;
  setIsApplying: (value: boolean) => void;
}) {
  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className=" rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-core">
          Información de la asistencia
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-6">
        <div className="space-y-11">
          <MainInformation assistance={assistance} />
          <Requisites requisites={assistance.requirements} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactInfo assistance={assistance} />
          </div>
        </div>
        <Button
          className="w-40 mx-auto block"
          onClick={() => setIsApplying(true)}
        >
          Aplicar
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * InfoItem Component
 *
 * Reusable component for displaying information with an icon and title.
 *
 * Props:
 * - icon: React node for the icon element
 * - title: String for the information title
 * - content: String content to display
 *
 * @param {InfoItemProps} props Component props
 * @returns {JSX.Element} Formatted information item
 */
function InfoItem({ icon, title, content }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h2 className="font-bold text-xl text-core-highlight">{title}:</h2>
        <p className="text-xl">{content}</p>
      </div>
    </div>
  );
}

/**
 * MainInformation Component
 *
 * Displays the primary information about the assistance position including
 * name, classification, and description.
 *
 * Props:
 * - assistance: Assistance object containing position details
 *
 * Features:
 * - Icons for each information type
 * - Consistent styling and spacing
 * - Responsive layout
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Section containing main position information
 */
function MainInformation({ assistance }: { assistance: Assistance }) {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <InfoItem
          icon={
            <Briefcase className="w-10 h-10 text-core-highlight flex-shrink-0 mt-1" />
          }
          title="Nombre"
          content={assistance.title}
        />
        <InfoItem
          icon={
            <Users className="w-10 h-10 text-core-highlight flex-shrink-0 mt-1" />
          }
          title="Clasificación"
          content={assistance.clasification}
        />
        <InfoItem
          icon={
            <FileText className="w-10 h-10 text-core-highlight flex-shrink-0 mt-1" />
          }
          title="Descripción"
          content={assistance.description}
        />
      </div>
    </div>
  );
}

/**
 * Requisites Component
 *
 * Displays a list of requirements for the assistance position.
 *
 * Props:
 * - requisites: Array of strings containing requirement descriptions
 *
 * Features:
 * - Checkmark icons for each requirement
 * - Consistent spacing and alignment
 * - Maps through requirements array
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} List of position requirements
 */
function Requisites({ requisites }: { requisites?: Requirement[] }) {
  if (!requisites || requisites.length === 0) {
    return <p className="text-gray-500">No hay requisitos disponibles.</p>;
  }

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-2xl text-core-highlight mb-3">
        Requisitos:
      </h3>
      <ul className="space-y-1">
        {requisites.map((requisite) => (
          <li className="flex items-center gap-3" key={requisite.name}>
            <CheckCircle2 className="w-6 h-6 text-core-highlight flex-shrink-0" />
            <span className="text-xl">{requisite.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ContactInfo Component
 *
 * Displays contact information for the assistance position including
 * professor name and email.
 *
 * Props:
 * - assistance: Assistance object containing contact details
 *
 * Features:
 * - Icons for each contact method
 * - Consistent styling
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Section containing contact information
 */
function ContactInfo({ assistance }: { assistance: Assistance }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-2xl text-core-highlight">
        Información de contacto:
      </h3>
      <div className="space-y-4">
        <InfoItem
          icon={
            <User className="w-8 h-8 text-core-highlight flex-shrink-0 mt-1" />
          }
          title="Profesor"
          content={assistance.professor.name}
        />
        <InfoItem
          icon={
            <Mail className="w-8 h-8 text-core-highlight flex-shrink-0 mt-1" />
          }
          title="Email"
          content={assistance.professor.email}
        />
      </div>
    </div>
  );
}

/**
 * AssistanceApplying Component
 *
 * Handles the application process for the assistance position.
 *
 * Props:
 * - assistance: Assistance object containing position details
 * - setIsApplying: Function to toggle application state
 *
 * Features:
 * - File upload for CV
 * - Confirmation modal
 * - Form submission handling
 * - Navigation back to details
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Application form card
 */
function AssistanceApplying({ assistance, setIsApplying }: AssistanceProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const modalProps = {
    title: "¿Estás seguro de aplicar a esta asistencia graduada?",
    description: "Recuerda que una vez aplicas no podrás cambiar tu decisión",
    buttonText: "Aplicar",
    successTitle: "¡Aplicación enviada!",
    successText: "Tu aplicación ha sido enviada con éxito",
    url: `${ROUTES.HOME}/${ROUTES.ASSISTANCE_APPLIED_LIST}`,
  };

  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className=" flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-bold text-center text-core">
          {assistance.title}
        </CardTitle>
        <ButtonBack setIsApplying={setIsApplying} />
      </CardHeader>
      <CardContent>
        <form
          /* onSubmit={TODO: APLICAR EFECTOS EN BACKEND} */ className="space-y-6"
        >
          <UploadCV assistance={assistance} />
          <div className="flex justify-center pt-3.5">
            <Button
              type="button"
              onClick={() => setIsConfirmed(true)}
              className="bg-core hover:bg-core-highlight text-card px-10 py-5 rounded-xl text-lg font-semibold transition-colors shadow-lg hover:shadow-core-soft"
            >
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
 * Renders a button to return to the details view from the application form.
 *
 * Props:
 * - setIsApplying: Function to toggle application state
 *
 * Features:
 * - Consistent styling with main theme
 * - Icon integration
 * - Hover states
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Back button
 */
function ButtonBack({
  setIsApplying,
}: {
  setIsApplying: (value: boolean) => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-core hover:text-core-highlight border-core hover:border-core-highlight hover:bg-core-soft dark:hover:bg-core"
      onClick={() => setIsApplying(false)}
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver detalles
    </Button>
  );
}

/**
 * UploadCV Component
 *
 * Handles CV file upload functionality for the application process.
 *
 * Props:
 * - assistance: Assistance object containing position details
 *
 * States:
 * - uploadedFile: Object containing file name and URL
 *
 * Features:
 * - PDF file upload
 * - File preview
 * - Remove file capability
 * - Drag and drop area
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} File upload section
 */
function UploadCV({ assistance }: { assistance: Assistance }) {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setUploadedFile({ name: file.name, url });
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setUploadedFile({ name: file.name, url });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Hoja de vida</h2>
        <p className="text-ring">
          Adjunta tu hoja de vida en formato PDF para aplicar a esta asistencia
        </p>
      </div>

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!uploadedFile ? (
          <div>
            <Upload className="mx-auto h-12 w-12 text-ring" />
            <Label htmlFor="cv" className="mt-4 block text-sm font-medium">
              <span className="text-core-highlight">Click para subir</span> o
              arrastra y suelta
            </Label>
            <Input
              id="cv"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <p className="text-xs text-ring mt-2">Solo archivos PDF</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-core-highlight mr-2" />
              <span>{uploadedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setUploadedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
