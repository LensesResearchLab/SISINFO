"use client";

import { handleDownload } from './utils';
import { UploadFilePage } from '@/components/shared/upload-files-page';
import { CreateTeachingAssistance } from '../../../types/createTeachingAssistance.type';
import { useState } from 'react';
import {
  getTeachingAssistants,
  uploadTeachingAssistantsFile,
} from '@/app/services/teaching-assistantship.service';
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
  const handleUploadCsv = (data: CreateTeachingAssistance[]) => {
    uploadTeachingAssistantsFile(data, selectedPeriod);
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

  return (
    <UploadFilePage
      title="Cargar monitores"
      handlePeriodChange={handlePeriodChange}
      handleDownload={handleDownload}
      handleUploadCsv={(data) => {
        const teachingAssistantsData = mapCswRowTwoCreateTeachingAssistance(data as unknown as CsvTASRow[]);
        handleUploadCsv(teachingAssistantsData);
      }}
      dialogText={dialogText}
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

        {/* Render assistantships using DataTable with transformed rows */}
        <DataTable
          columns={columns}
          data={mapTeachingAssistantshipsToCoordinatorTable(teachingAssistantships)}
        />
      </div>
    </div>
  );
}
