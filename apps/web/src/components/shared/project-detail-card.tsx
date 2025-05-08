import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tag, Calendar, Mail, Users } from "lucide-react";
import { CategoryTagStatic } from "./category-tag";
import { Project } from "@/app/types/entities/project.type";
import { mapPeriodToString } from "@/app/mappers/period.mapper";


export function ProjectDetailCard({
  project,
  children,
}: {
  readonly project: Project;
  readonly children?: React.ReactElement;
}) {
  return (
    <Card className="w-full mx-auto shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-core-highlight">
          Información del proyecto de grado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <MainInformation project={project} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryAndSemesterInfo project={project} />
            <StudentsAndContactInfo project={project} />
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
/**
 * ProjectNotFound Component
 *
 * Displays a message when a project is not found in the system.
 * Provides a button to navigate back to the project list page.
 *
 * Features:
 * - Clear error message
 * - Navigation button to return to project list
 * - Consistent styling with the main application
 *
 * @returns {JSX.Element} Error card with navigation button
 */
export function ProjectNotFound() {
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
 * Displays the primary information of a project project including title and description.
 *
 * Features:
 * - Clear labeling for project title
 * - Formatted description with appropriate spacing
 * - Visual hierarchy through font styling
 *
 * @param {Object} props - Component props
 * @param {Project} props.project - The project object containing project details
 *
 * @returns {JSX.Element} Section with formatted title and description
 */
function MainInformation({ project }: { readonly project: Project }) {
  return (
    <div>
      <h3 className="font-semibold text-lg">
        Nombre del proyecto:{" "}
        <span className="text-foreground-soft font-normal">
          {" "}
          {project.title}
        </span>
      </h3>
      <h3 className="font-semibold text-lg mt-4">Descripción:</h3>
      <p className="text-foreground-soft">{project.description}</p>
      <Tags tags={project.areasOfInterest?.map(area => area.description) ?? []} />
    </div>
  );
}

/**
 * AreasOfInterest Component
 *
 * Displays a collection of interest areas related to the project as interactive badges.
 *
 * Features:
 * - Flexible layout that wraps on smaller screens
 * - Visual representation of areas as badges
 * - Consistent styling with hover effects
 *
 * @param {Object} props - Component props
 * @param {string[]} props.areas - Array of area names to display as badges
 *
 * @returns {JSX.Element} Section with heading and area badges
 */
function Tags({ tags }: { readonly tags: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-lg">Áreas de interés:</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags && tags.length > 0 ? (
          tags.map((area) => <CategoryTagStatic tag={area} key={area} />)
        ) : (
          <span className="text-gray-500">
            No hay áreas de interés especificadas
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * CategoryAndSemesterInfo Component
 *
 * Displays metadata about the project category and academic semester.
 * Uses icons to enhance visual understanding of the information.
 *
 * Features:
 * - Icon-paired information for visual clarity
 * - Consistent layout and spacing
 * - Semantic grouping of related information
 *
 * @param {Object} props - Component props
 * @param {Project} props.project - The project object containing category and semester data
 *
 * @returns {JSX.Element} Section with formatted category and semester information
 */
function CategoryAndSemesterInfo({ project }: { readonly project: Project }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Tag className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Categoría:</h3>
          <p className="text-foreground-soft">{project.category}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Calendar className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Periodo:</h3>
          <p className="text-foreground-soft">
            {project.period?.semester
              ? mapPeriodToString(project.period)
              : "Periodo no especificado"}
          </p>
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
 * @param {Project} props.project - The project object containing student capacity and contact information
 *
 * @returns {JSX.Element} Section with formatted student capacity and contact information
 */
function StudentsAndContactInfo({ project }: { readonly project: Project }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <Users className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Numero maximo de estudiantes:</h3>
          <p className="text-foreground-soft">
            {project.maxStudents} estudiantes
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Mail className="h-5 w-5 text-core-highlight mt-1" />
        <div>
          <h3 className="font-semibold">Contacto:</h3>
          <p className="text-foreground-soft">{project.professor?.user.name ?? "Profesor no encontrado"}</p>
          <a
            href={`mailto:${project.professor?.user.email ?? "correo no encontrado"}`}
            className="text-core-highlight hover:underline"
          >
            {project.professor?.user.email ?? "correo no encontrado"}
          </a>
        </div>
      </div>
    </div>
  );
}
