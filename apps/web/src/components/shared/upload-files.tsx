"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Papa from "papaparse"
import * as XLSX from "xlsx";
import { ConfirmationModal, DialogTextProps } from "./confirmation-modal"
import { createBillboard } from "@/app/services/billboard.service"
import { uploadProfessors } from "@/app/services/professor.service"
import { AlertDialogSuccess } from "./alert-dialog-sucess"
import { uploadTeachingAssistantsFile } from "@/app/services/teaching-assistantship.service"

import { sanitizeRow } from "@/lib/utils"


type CsvRow = Record<string, string | number | boolean | null>;

interface UploadFilesProps {
  readonly title: string;
  readonly handleUploadCsv: (data: CsvRow[]) => void;
  readonly dialogText: DialogTextProps;
  readonly typeUpload : string;
  readonly setError :  Dispatch<SetStateAction<boolean>>;
  readonly setErrorMessage : Dispatch<SetStateAction<string>>;
  readonly selectedPeriod?: string;
}

export default function UploadFiles({
  title,
  handleUploadCsv,
  dialogText,
  typeUpload='billboard',
  setError,
  setErrorMessage,
  selectedPeriod=''

}: UploadFilesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loadSucess,setLoadSucess] = useState({'sucess':false,'message':dialogText.successText});

  function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return "Unexpected error"; }
}

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const isNonNull = (row: CsvRow) => {
    return Object.values(row).some(
      (value) => typeof value === "string" && value.trim() !== ""
    )
  }
  function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
 }

  const onConfirmUpload = () => {
    if (!file) return setIsModalOpen(false);

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const filteredData = results.data.filter((row) =>
            isNonNull(row)
          );
          handleUploadCsv(filteredData);
          setIsModalOpen(false);
        },
        error: (error) => {
          console.error("Error al parsear el CSV:", error);
          setIsModalOpen(false);
        },
      });
    } else if (extension === "xlsx" || extension === "xlsm") {
      file.arrayBuffer().then((data) => {
        try {
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets["plantillaSisinfo"];
          if (!sheet) throw new Error("No se encontró la hoja 'plantillaSisinfo'");

          const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | boolean | null>>(sheet);
          handleUploadCsv(jsonData);
          if (typeUpload === "billboard") {
            const billboardData = jsonData.map((row, idx) => {
                const obj = {
                  NRC: String(row["NRC"] ?? ""),
                  code: String(row["code"] ?? ""),
                  name: String(row["name"] ?? ""),
                  departament: String(row["departament"] ?? ""),
                  credits:
                    typeof row["credits"] === "number"
                      ? row["credits"]
                      : Number(row["credits"] ?? 0),
                  section: String(row["section"] ?? ""),
                  period: String(row["period"] ?? ""),
                  professors: formatProfessors(row["professors"]),
                  publicated: formatPublicated(row["publicated"]),
                };

                // check if any field is invalid
                const emptyFields = Object.entries(obj)
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .filter(([_, v]) => v === "" || v === null || v === undefined || (typeof v === "number" && isNaN(v)))
                  .map(([k]) => k);
                
                if (emptyFields.length > 0) {
                  throw new Error(
                    `Fila ${idx + 1} tiene estos campos vacios: ${emptyFields.join(", ")}`
                  );
                }

                return obj;
              });

          console.log(billboardData)
          createBillboard(billboardData);
          setLoadSucess(prev => ({ ...prev, sucess: true }));
          }
        else if (typeUpload === "professors") {
          const professorsData = jsonData.map((row) => (
            {
              user: {
                name: normalizeName(String(row["Personal"] ?? "")),
                email: String(row["Correo"] ?? "").toLowerCase().trim(),
                password : String(row["Correo"])
              }
            }
          ));
          uploadProfessors(professorsData);
          setLoadSucess(prev => ({ ...prev, sucess: true }))
        }
        else if (typeUpload === "monitores") {
          const cleanedRows = jsonData
  .map((r) => sanitizeRow(r))
  // elimina filas completamente vacías (todas las columnas null)
  .filter((r) => Object.values(r).some((v) => v !== null));

          const teachingAssistantsData = cleanedRows.map((row) => (
            {
              studentName: String(row["NOMBRE"] ?? ""),
              studentCode: String(row["CODIGO"] ?? ""),
              courseCode: String(row["MATERIA"] ?? ""),
              sectionNumber: Number(row["SECCION"] ?? 0),
            }
          ));
          uploadTeachingAssistantsFile(teachingAssistantsData, selectedPeriod);
          setLoadSucess(prev => ({ ...prev, sucess: true }));
        }}
         catch (error) {
          setError(true)
          setErrorMessage(toErrorMessage(error)); 
        } finally {
          setIsModalOpen(false);
        }
      });
    } else {
      console.error("Tipo de archivo no soportado");
      setIsModalOpen(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    } else {
      setFile(null)
    }
  }

  return (
    <>
    <AlertDialogSuccess
  open={loadSucess.sucess}
  onOpenChange={(open) =>
    setLoadSucess((prev) => ({ ...prev, sucess: open }))
  }
  message={loadSucess.message}
/>
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-core">{title}</CardTitle>
        <CardDescription>Selecciona un archivo y haz click en subir</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">XLSM, CSV</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".csv, .xlsx, .xlsm" onChange={handleFileChange} />
            </label>
          </div>
          {file && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button type="submit">Subir</Button>
            </div>
          )}
        </form>
      </CardContent>
      {isModalOpen && (
        <ConfirmationModal
          dialogText={dialogText}
          onConfirm={onConfirmUpload}
          open={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
    </Card>
    </>
  )
}

function formatProfessors(professors: unknown): string {
  if (Array.isArray(professors)) {
    return professors.map((p) => String(p)).join(", ");
  } else if (typeof professors === "string" && professors.trim() !== "") {
    return professors;
  }
  return "";
}

function formatPublicated(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  } else if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}
