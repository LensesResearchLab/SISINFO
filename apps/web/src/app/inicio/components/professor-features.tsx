import InformationSection, { InformationSectionProps } from "@/app/inicio/components/information-section";
import { professorData } from "@/components/links-per-group";

/**
 * ProfessorFeatures Component
 *
 * Displays a series of informational sections relevant to professors, such as undergraduate and graduate projects,
 * graduate assistantships, and monitor programs. Each section is rendered using the `InformationSection` component
 * with data mapped from the `professorData` set.
 *
 * Features:
 * - Dynamically maps specified feature titles to their respective content
 * - Renders each section with consistent visual styling
 * - Accepts optional child components to be rendered after the sections
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child elements to render after all feature sections
 *
 * @returns {JSX.Element} A full-width container with multiple professor-related feature sections
 */
export default function ProfessorFeatures({
  children,
}: {
  readonly children?: React.ReactNode;
}) {
  // List of professor-related feature titles to be displayed
  const professorFeatures = [
    "Proyecto de grado",
    "Proyecto de maestría",
    "Asistencias graduadas",
    "Monitores",
  ];

  // Map each feature title to its corresponding props for the InformationSection
  const informationPerFeature = new Map<string, InformationSectionProps>();
  professorData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      {/* Render an InformationSection for each professor feature */}
      {professorFeatures.map((feature) => {
        const information = informationPerFeature.get(feature);
        if (!information) return null;
        return (
          <InformationSection
            key={feature}
            title={information.title}
            features={information.features}
            background="bg-core-highlight"
          />
        );
      })}

      {/* Optional child components rendered after the sections */}
      {children}
    </div>
  );
}
