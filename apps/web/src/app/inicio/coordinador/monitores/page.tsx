"use client";
import { ROUTES } from '@/app/routes';
import { handleDownload } from './utils';
import { UploadFilePage } from '@/components/shared/upload-files-page';
import { CreateTeachingAssistance } from '../../../types/createTeachingAssistance.type';
import { useState } from 'react';
import { getTeachingAssistants, uploadTeachingAssistantsFile } from '@/app/services/teaching-assistantship.service';
import { TeachingAssistantship } from '@/app/types/teachingAssistantship.type';
import { DataTable } from '@/components/data-table';
import { mapCswRowTooCreateTeachingAssistance, mapTeachingAssistantshipsToCoordinatorTable } from '@/app/mappers/teaching-assistantships-mapper';
import { columns } from './TableColumns';
import { CsvTASRow } from '@/app/types/Csv-TAS-row';

export default function UploadTeachingAssistants() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('202520');
  const [teachingAssistantships, setTeachingAssistantships] = useState<TeachingAssistantship[]>([]);
    
   const dialogText = {
     title: "Cargar monitores",
     description: "¿Estás seguro de que deseas cargar este archivo de monitores?",
     buttonText: "Cargar monitores",
     successTitle: "Carga exitosa",
     successText: "El archivo de monitores ha sido publicada exitosamente",
     url: `${ROUTES.HOME}/${ROUTES.UPLOAD_TAS}`,
   };
 

   const handleUploadCsv = (data: CreateTeachingAssistance[])  => {
     uploadTeachingAssistantsFile(data, selectedPeriod);
   };
 
   const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
      getTeachingAssistants(value).then((data) => {
        setTeachingAssistantships(data);
     });
   };
  
    return (
  <UploadFilePage
    title="Cargar monitores"
    handlePeriodChange={handlePeriodChange}
    handleDownload={handleDownload}
    handleUploadCsv={(data) => {
      const teachingAssistantsData = mapCswRowTooCreateTeachingAssistance(data  as unknown as CsvTASRow[]);
      handleUploadCsv(teachingAssistantsData);
    }}
    dialogText={dialogText}
  >
    <TeachingAssistantsTable teachingAssistantships={teachingAssistantships}/>
  </UploadFilePage>
  )
}



function TeachingAssistantsTable({teachingAssistantships}: {teachingAssistantships: TeachingAssistantship[]}) {


  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Monitores para el periodo</h2>
        <DataTable columns={columns} data={mapTeachingAssistantshipsToCoordinatorTable(teachingAssistantships)} />
      </div>
    </div>
  )
}

