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
  const [, setIsDragging] = useState(false);
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

  const onConfirmUpload = async () => {
    if (!file) {
      setIsModalOpen(false);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      // Wrap Papa.parse in a Promise so we can await it
      try {
        const parsed = await new Promise<CsvRow[]>((resolve, reject) => {
          Papa.parse<CsvRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data.filter(isNonNull)),
            error: (err) => reject(err),
          });
        });
        await handleUploadCsv(parsed);
      } catch (err) {
        setError(true);
        setErrorMessage(toErrorMessage(err));
      } finally {
        setIsModalOpen(false);
      }
      return;
    }

    if (extension === "xlsx" || extension === "xlsm") {
      let data: ArrayBuffer;
      try {
        data = await file.arrayBuffer();
      } catch (err) {
        setError(true);
        setErrorMessage(
          "No se pudo leer el archivo seleccionado. Vuelve a seleccionar el archivo e inténtalo de nuevo."
        );
        setIsModalOpen(false);
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const preferredSheetNames = typeUpload === "monitores"
          ? ["plantillaMonitores", "plantillaSisinfo"]
          : ["plantillaSisinfo"];

        let sheet: XLSX.Sheet | undefined;
        for (const name of preferredSheetNames) {
          if (workbook.Sheets[name]) {
            sheet = workbook.Sheets[name];
            break;
          }
        }

        if (!sheet && workbook.SheetNames.length > 0) {
          sheet = workbook.Sheets[workbook.SheetNames[0]];
        }

        if (!sheet) throw new Error(`No se encontró una hoja válida en el libro. Buscadas: ${preferredSheetNames.join(", ")}`);

        const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | boolean | null>>(sheet as XLSX.Sheet);

        // Normalize keys (trim + uppercase) and sanitize cell values
        const normalized = (jsonData as Record<string, any>[])
          .map((row) => {
            const out: Record<string, any> = {};
            for (const k of Object.keys(row)) {
              const key = k.toString().trim().toUpperCase();
              // reuse sanitizeCell from utils for trimming/empty -> null
              // inline simple sanitize to avoid circular imports at runtime
              const raw = row[k];
              let value: any = null;
              if (raw === undefined || raw === null) value = null;
              else if (typeof raw === 'string') {
                const t = raw.trim();
                value = t === '' ? null : t;
              } else value = raw;
              out[key] = value;
            }
            return out as Record<string, string | number | boolean | null>;
          })
          .filter(isNonNull);

        await handleUploadCsv(normalized);

        if (typeUpload === "billboard") {
          const billboardData = jsonData
            .filter(row =>
              ["NRC", "code", "name", "departament", "section", "period", "professors"].some(
                k => row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== ""
              )
            )
            .map((row, idx) => {
            const obj = {
              NRC: String(row["NRC"] ?? ""),
              code: String(row["code"] ?? ""),
              name: String(row["name"] ?? ""),
              departament: String(row["departament"] ?? ""),
              credits: typeof row["credits"] === "number" ? row["credits"] : Number(row["credits"] ?? 0),
              section: String(row["section"] ?? ""),
              period: String(row["period"] ?? ""),
              professors: formatProfessors(row["professors"]),
              publicated: formatPublicated(row["publicated"]),
            };

            const emptyFields = Object.entries(obj).filter(([_, v]) => v === "" || v === null || v === undefined || (typeof v === "number" && isNaN(v))).map(([k]) => k);
            if (emptyFields.length > 0) {
              throw new Error(`Fila ${idx + 1} tiene estos campos vacios: ${emptyFields.join(", ")}`);
            }
            return obj;
          });

          createBillboard(billboardData);
          setLoadSucess(prev => ({ ...prev, sucess: true }));
        } else if (typeUpload === "professors") {
          const professorsData = jsonData.map((row) => ({
            user: {
              name: normalizeName(String(row["Personal"] ?? "")),
              email: String(row["Correo"] ?? "").toLowerCase().trim(),
              password: String(row["Correo"] ?? ""),
            },
          }));
          uploadProfessors(professorsData);
          setLoadSucess(prev => ({ ...prev, sucess: true }));
        }
      } catch (error) {
        setError(true);
        setErrorMessage(toErrorMessage(error));
      } finally {
        setIsModalOpen(false);
      }

      return;
    }

    console.error("Tipo de archivo no soportado");
    setIsModalOpen(false);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    } else {
      setFile(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
  e.preventDefault(); // evita que el navegador abra el archivo
  setIsDragging(true);
};

const handleDragLeave = () => {
  setIsDragging(false);
};

const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
  e.preventDefault();
  setIsDragging(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    setFile(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  }
};

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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
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
