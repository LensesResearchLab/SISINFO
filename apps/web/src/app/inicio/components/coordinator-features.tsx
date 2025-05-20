import InformationSection, {
  InformationSectionProps,
} from "@/app/inicio/components/information-section";
import { coordinatorData } from "@/components/links-per-group";

/**
 * CoordinatorFeatures Component
 *
 * Displays a set of feature sections relevant to academic coordinators using the `InformationSection` component.
 * Each section corresponds to a thematic area (e.g., semester configuration, alerts, monitors).
 * The data is dynamically mapped from the imported `coordinatorData` array.
 *
 * Features:
 * - Dynamically maps predefined feature titles to their associated content
 * - Renders an `InformationSection` for each feature with a unified background style
 * - Supports rendering additional content passed as `children` at the bottom
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child elements rendered after the sections
 *
 * @returns {JSX.Element} A full-width container displaying coordinator-specific feature sections
 */
export default function CoordinatorFeatures({
  children,
}: {
  readonly children?: React.ReactNode;
}) {
  // List of coordinator feature titles to be displayed
  const coordinatorFeatures = [
    "Configuración del semestre",
    "Alertas y reportes",
    "Monitores",
  ];

  // Map each feature title to its corresponding props for the InformationSection component
  const informationPerFeature = new Map<string, InformationSectionProps>();
  coordinatorData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {/* Render one InformationSection per feature, if data is found */}
      {coordinatorFeatures.map((feature) => {
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

      {/* Optional custom children content rendered after all sections */}
      {children}
    </div>
  );
}
