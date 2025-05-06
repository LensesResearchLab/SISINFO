import InformationSection, { InformationSectionProps } from "@/app/inicio/components/information-section";
import { professorData } from "@/components/links-per-group";


export default function ProfessorFeatures({children}: {readonly children?: React.ReactNode}) {
  const professorFeatures = ["Proyecto de pregrado", "Asistencia graduada", "Asistencias graduadas", "Monitores"];

  const informationPerFeature = new Map<string, InformationSectionProps>()
  professorData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });

  return (
    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
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
      {children}
    </div>
  )
}