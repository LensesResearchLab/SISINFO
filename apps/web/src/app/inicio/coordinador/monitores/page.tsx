"use client";


import { UploadFilePage } from '@/components/shared/upload-files-page';
import { CreateTeachingAssistance } from '../../../types/createTeachingAssistance.type';
import { useState } from 'react';
import {
  getTeachingAssistants,
  uploadTeachingAssistantsFile,
} from '@/app/services/teaching-assistantship.service';
import { getBillboardWithUploadedProgram } from '@/app/services/billboard.service';
import { TeachingAssistantship } from '@/app/types/entities/teachingAssistantship.type';
import { DataTable } from '@/components/data-table';
import {
  mapCswRowTwoCreateTeachingAssistance,
  mapTeachingAssistantshipsToCoordinatorTable,
} from '@/app/mappers/teaching-assistantships-mapper';
import { columns } from './TableColumns';
import { CsvTASRow } from '@/app/types/Csv-TAS-row';

/**
 * UploadTeachingAssistants Component
 *
 * Provides functionality to upload and display teaching assistantship assignments for a selected academic period.
 * Supports CSV file upload, parsing, preview, and data persistence to the backend.
 *
 * Features:
 * - Select academic period
 * - Upload CSV with monitor data
 * - Download template
 * - View existing monitors via a paginated and sortable DataTable
 *
 * @returns {JSX.Element} UI for managing monitor assignments
 */
export default function UploadTeachingAssistants() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('202520');
  const [teachingAssistantships, setTeachingAssistantships] = useState<TeachingAssistantship[]>([]);

  // Dialog configuration for confirmation and feedback after uploading
  const dialogText = {
    title: "Cargar monitores",
    description: "¿Estás seguro de que deseas cargar este archivo de monitores?",
    buttonText: "Cargar monitores",
    successTitle: "Carga exitosa",
    successText: "El archivo de monitores ha sido publicada exitosamente",
    url: '',
  };

  /**
   * Handles submission of CSV data to the backend
   *
   * @param {CreateTeachingAssistance[]} data - List of teaching assistants to upload
   */
  const uploadAndRefresh = async (data: CreateTeachingAssistance[]) => {
    await uploadTeachingAssistantsFile(data, selectedPeriod);
    const refreshed = await getTeachingAssistants(selectedPeriod);
    setTeachingAssistantships(refreshed);
  };

  /**
   * Handles period change and fetches corresponding teaching assistants
   *
   * @param {string} value - Selected academic period
   */
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    getTeachingAssistants(value).then((data) => {
      setTeachingAssistantships(data);
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/monitores.xlsx";
    link.download = "plantilla.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <UploadFilePage
      title="Cargar monitores"
      handlePeriodChange={handlePeriodChange}
      handleDownload={handleDownload}
      handleUploadCsv={async (data) => {
        const rawRows = data as unknown as CsvTASRow[];

        // Fetch program courses for the selected period to map names -> codes
        let program: any = { courses: [] };
        try {
          program = await getBillboardWithUploadedProgram(selectedPeriod);
        } catch (e) {
          // If we can't fetch program, proceed but warn — backend will validate
          console.warn('No se pudo obtener el programa del periodo para mapeo automático', e);
        }

        const courses: any[] = program?.courses ?? [];
        const codeSet = new Set(courses.map((c) => (c.code || c.id || '').toString().toUpperCase()));
        const nameMap = new Map<string, string>();
        courses.forEach((c) => {
          const name = (c.name || c.title || c.class || '').toString().trim().toUpperCase();
          if (name) nameMap.set(name, (c.code || c.id).toString());
        });

        const normalized = rawRows.map((r) => {
          const materiaRaw = (r['MATERIA'] || '').toString().trim();
          const seccionRaw = r['SECCION'];
          let courseCode = materiaRaw;

          // If materia doesn't look like a code, try to map by name
          const materiaUpper = materiaRaw.toUpperCase();
          if (!codeSet.has(materiaUpper)) {
            const mapped = nameMap.get(materiaUpper);
            if (mapped) courseCode = mapped;
          }

          return {
            studentCode: r['CODIGO'],
            studentName: r['NOMBRE'],
            courseCode: courseCode,
            sectionNumber: Number(seccionRaw),
          } as CreateTeachingAssistance;
        });

        // Pre-validate: check that mapped course codes exist and sections are plausible
        const missing = normalized.find((row) => !row.courseCode || Number.isNaN(row.sectionNumber));
        if (missing) {
          throw new Error(`Fila inválida en plantilla: materia='${(missing as any).courseCode}', sección='${(missing as any).sectionNumber}'`);
        }

        await uploadAndRefresh(normalized);
      }}
      dialogText={dialogText}
      typeUpload='monitores'
    >
      <TeachingAssistantsTable teachingAssistantships={teachingAssistantships} />
    </UploadFilePage>
  );
}

/**
 * TeachingAssistantsTable Component
 *
 * Renders the teaching assistantships in a DataTable format for coordinator preview.
 * Uses a data mapper to adapt raw entities into a flat tabular structure for rendering.
 *
 * @param {TeachingAssistantship[]} teachingAssistantships - Raw assistantship data from the backend
 * @returns {JSX.Element} Rendered table of assistants
 */
function TeachingAssistantsTable({
  teachingAssistantships,
}: {
  readonly teachingAssistantships: TeachingAssistantship[];
}) {
  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-core text-center">
          Monitores para el periodo
        </h2>
        <DataTable
          columns={columns}
          data={mapTeachingAssistantshipsToCoordinatorTable(teachingAssistantships)}
        />
      </div>
    </div>
  );
}
