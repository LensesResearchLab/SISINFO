import InformationSection, { InformationSectionProps } from "@/app/inicio/components/information-section";
import { undergraduateData } from "@/components/links-per-group";


export default function StudentFeatures({children}: {readonly children?: React.ReactNode}) {
  const studentFeatures = ["Proyecto de grado", "Asistencia graduada" ];

  const informationPerFeature = new Map<string, InformationSectionProps>()
  undergraduateData.forEach((feature) => {
    informationPerFeature.set(feature.title, {
      title: feature.title,
      features: feature.items,
    });
  });
  return (

    <div className='min-h-full min-w-full mx-auto p-4 space-y-8'>
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
      {children}
    </div>
  )
}