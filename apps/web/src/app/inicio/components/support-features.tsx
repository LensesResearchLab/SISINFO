import InformationSection, { InformationSectionProps } from "./information-section";
import { supportData } from "@/components/links-per-group";

/**
 * SupportFeatures Component
 *
 * Displays informational sections related to user support using the `InformationSection` component.
 * Currently includes only a single section titled "Ayuda" (Help), populated from the `supportData` source.
 *
 * Features:
 * - Dynamically maps support feature titles to their corresponding data
 * - Renders the section with a consistent background style
 *
 * @returns {JSX.Element} A fragment containing support-related information sections
 */
export default function SupportFeatures() {
  // List of support feature titles to be rendered
  const supportFeatures = ["Ayuda"];

  // Map feature titles to their associated InformationSectionProps
  const informationPerFeature = new Map<string, InformationSectionProps>();
  supportData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <>
      {/* Render InformationSection for each support feature found */}
      {supportFeatures.map((feature) => {
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
    </>
  );
}