import InformationSection, {
  InformationSectionProps,
} from "@/app/inicio/components/information-section";
import { administratorData } from "@/components/links-per-group";

/**
 * AdministratorFeatures Component
 *
 * Displays feature sections related to the administrator role using the InformationSection component.
 * The content is generated dynamically based on the `administratorData` imported from a centralized source.
 *
 * Features:
 * - Maps administrator feature titles to their corresponding data (title and feature list)
 * - Renders each section using the `InformationSection` component with consistent background styling
 * - Supports rendering of optional children components at the bottom
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child components to be rendered after the feature sections
 *
 * @returns {JSX.Element} A container with all the information sections and optional children
 */
export default function AdministratorFeatures({
  children,
}: {
  readonly children?: React.ReactNode;
}) {
  // List of administrator feature titles to be displayed
  const administratorFeatures = [
    "Administracion",
  ];

  // Map to associate feature titles with their respective InformationSection props
  const informationPerFeature = new Map<string, InformationSectionProps>();
  administratorData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {/* Render each information section based on administrator features */}
      {administratorFeatures.map((feature) => {
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

      {/* Optional children content rendered after all sections */}
      {children}
    </div>
  );
}
