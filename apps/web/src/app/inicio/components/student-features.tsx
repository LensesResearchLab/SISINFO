import InformationSection, { InformationSectionProps } from "@/app/inicio/components/information-section";
import { undergraduateData } from "@/components/links-per-group";

/**
 * StudentFeatures Component
 *
 * Renders a set of informational sections specific to undergraduate students using the `InformationSection` component.
 * The component includes sections such as "Proyecto de grado" (Graduation Project) and "Asistencia graduada" (Graduate Assistance).
 *
 * Features:
 * - Dynamically maps feature titles to their corresponding data from `undergraduateData`
 * - Renders each feature section with consistent styling
 * - Supports optional children content rendered after the main sections
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child elements rendered after the feature sections
 *
 * @returns {JSX.Element} A full-width container displaying student-related informational sections
 */
export default function StudentFeatures({
  children,
}: {
  readonly children?: React.ReactNode;
}) {
  // Titles of student-related features to be displayed
  const studentFeatures = ["Proyecto de grado", "Asistencia graduada"];

  // Map each feature title to its corresponding props for the InformationSection component
  const informationPerFeature = new Map<string, InformationSectionProps>();
  undergraduateData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
      {/* Render an InformationSection for each student feature */}
      {studentFeatures.map((feature) => {
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

      {/* Optional child components rendered after the feature sections */}
      {children}
    </div>
  );
}
