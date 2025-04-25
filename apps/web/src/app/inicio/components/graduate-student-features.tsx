import InformationSection from "@/app/inicio/components/information-section";
import { graduateData } from "@/components/links-per-group";
import { InformationSectionProps } from "@/app/inicio/components/information-section";

export default function GraduateStudentFeatures({
  children,
}: {
  children?: React.ReactNode;
}) {
  const gradStudentFeatures = ["Tesis de posgrado", "Asistencia graduada"];

  const informationPerFeature = new Map<string, InformationSectionProps>();
  graduateData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });
  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {gradStudentFeatures.map((feature) => {
        const information = informationPerFeature.get(feature);
        if (!information) return null;
        return (
          <InformationSection
            key={feature}
            title={information.title}
            features={information.features}
            background="bg-destructive"
          />
        );
      })}
      {children}
    </div>
  );
}
