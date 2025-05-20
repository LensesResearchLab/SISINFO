import { graduateData } from "@/components/links-per-group";
import InformationSection, { InformationSectionProps } from "@/app/inicio/components/information-section";

/**
 * GraduateStudentFeatures Component
 *
 * Renders a set of informational sections specifically for graduate students using the `InformationSection` component.
 * It focuses on displaying content related to postgraduate thesis work and graduate assistance, based on predefined data.
 *
 * Features:
 * - Dynamically maps selected graduate-related topics to their respective data
 * - Displays each topic using a reusable `InformationSection` component
 * - Allows for optional children to be rendered after the sections
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child components rendered after the feature sections
 *
 * @returns {JSX.Element} A structured container with graduate-related information sections
 */
export default function GraduateStudentFeatures({
  children,
}: {
  readonly children?: React.ReactNode;
}) {
  // Titles of graduate student features to be displayed
  const gradStudentFeatures = ["Tesis de posgrado", "Asistencia graduada"];

  // Map each feature title to its corresponding props for the InformationSection
  const informationPerFeature = new Map<string, InformationSectionProps>();
  graduateData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {/* Render InformationSection for each graduate student feature */}
      {gradStudentFeatures.map((feature) => {
        const information = informationPerFeature.get(feature);
        if (!information) return null;
        return (
          <InformationSection
            key={feature}
            title={information.title}
            features={information.features}
          />
        );
      })}

      {/* Optional child components rendered after the feature sections */}
      {children}
    </div>
  );
}
