import InformationSection, { InformationSectionProps } from "./information-section";
import { supportData } from "@/components/links-per-group";

export default function SupportFeatures() {
    const supportFeatures = ["Ayuda"];
    const informationPerFeature = new Map<string, InformationSectionProps>()
  
    supportData.forEach((feature) => {
      informationPerFeature.set(feature.title, {
        title: feature.title,
        features: feature.items,
      });
    });
    return (
<>
{
        supportFeatures.map((feature) => {
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
        })
        }

</>
    )

  }