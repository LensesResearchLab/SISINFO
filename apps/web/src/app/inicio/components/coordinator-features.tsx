import InformationSection, {
  InformationSectionProps,
} from "@/app/inicio/components/information-section";
import { coordinatorData } from "@/components/links-per-group";

export default function CoordinatorFeatures({
  children,
}: {
  children?: React.ReactNode;
}) {
  const coordinatorFeatures = [
    "Configuración del semestre",
    "Alertas y reportes",
    "Monitores",
  ];

  const informationPerFeature = new Map<string, InformationSectionProps>();
  coordinatorData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
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
      {children}
    </div>
  );
}
