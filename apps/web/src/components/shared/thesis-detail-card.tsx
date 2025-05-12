import { Thesis } from "@/app/types/entities/thesis.type";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tag, Calendar, Mail } from "lucide-react";
import { CategoryTagStatic } from "./category-tag";

export function ThesisDetailCard({
  thesis,
  children,
}: {
  readonly thesis: Thesis;
  readonly children?: React.ReactElement;
}) {
  return (
    <Card className="w-full mx-auto shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-core-highlight">
          Información de la tesis de maestria
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <MainInformation thesis={thesis} />
          {/*<AreasOfInterest areas={thesis.investigationSubarea} /> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryAndSemesterInfo thesis={thesis} />
            <StudentsAndContactInfo thesis={thesis} />
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
/**
 * ThesisNotFound Component
 *
 * Displays a message when a thesis is not found in the system.
 * Provides a button to navigate back to the thesis list page.
 *
 * Features:
 * - Clear error message
 * - Navigation button to return to thesis list
 * - Consistent styling with the main application
 *
 * @returns {JSX.Element} Error card with navigation button
 */
export function ThesisNotFound() {
  return (
    <div className="min-h-full max-w-[900px] container mx-auto p-4 space-y-8">
      <Card className="w-full mx-auto shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-core-highlight">
            Tesis no encontrada
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          La tesis que buscas no se encuentra en el sistema. Por favor
          verifica la URL o intenta de nuevo más tarde.
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * MainInformation Component
 *
 * Displays the primary information of a thesis project including title and description.
 *
 * Features:
 * - Clear labeling for project title
 * - Formatted description with appropriate spacing
 * - Visual hierarchy through font styling
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing project details
 *
 * @returns {JSX.Element} Section with formatted title and description
 */
function MainInformation({ thesis }: { readonly thesis: Thesis }) {
  return (
    <div>
      <h3 className="font-semibold text-lg">
        Nombre de de la tesis:{" "}
        <span className="text-foreground-soft font-normal">
          {" "}
          {thesis.title}
        </span>
      </h3>
      <h3 className="font-semibold text-lg mt-4">Descripción:</h3>
      <p className="text-foreground-soft words-break pr-8">{thesis.description}</p>
    </div>
  );
}


/**
 * CategoryAndSemesterInfo Component
 *
 * Displays metadata about the thesis category and academic semester.
 * Uses icons to enhance visual understanding of the information.
 *
 * Features:
 * - Icon-paired information for visual clarity
 * - Consistent layout and spacing
 * - Semantic grouping of related information
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing category and semester data
 *
 * @returns {JSX.Element} Section with formatted category and semester information
 */
function CategoryAndSemesterInfo({ thesis }: { readonly thesis: Thesis }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Tag className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Subareas de investigación:</h3>
          <p className="text-foreground-soft">{thesis.investigationSubarea}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Calendar className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Periodo:</h3>
          <p className="text-foreground-soft">{thesis.period ? `${thesis.period.year}-${thesis.period.period}` : ""}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * StudentsAndContactInfo Component
 *
 * Displays information about student capacity and professor contact details.
 * Includes interactive email link for direct communication.
 *
 * Features:
 * - Icon-paired information for visual clarity
 * - Clickable email link with mailto functionality
 * - Organized layout with consistent spacing
 *
 * @param {Object} props - Component props
 * @param {Thesis} props.thesis - The thesis object containing student capacity and contact information
 *
 * @returns {JSX.Element} Section with formatted student capacity and contact information
 */
function StudentsAndContactInfo({ thesis }: { readonly thesis: Thesis }) {
  return (
    <div className="space-y-6">
      {/* Student capacity section - commented out until we have the data
      <div className="flex items-start gap-2">
        <Users className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Numero maximo de estudiantes:</h3>
          <p className="text-foreground-soft">
            {thesis.maxStudents} estudiantes
          </p>
        </div>
      </div>
      */}
      <div className="flex items-start gap-2">
        <Mail className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Contacto:</h3>
          <p className="text-foreground-soft">{thesis.professor.user.name}</p>
          <a
            href={`mailto:${thesis.professor.user.email}`}
            className="text-core-highlight hover:underline"
          >
            {thesis.professor.user.email}
          </a>
        </div>
      </div>
    </div>
  );
}
