"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Papa, { ParseResult } from "papaparse"
import { ConfirmationModal, DialogTextProps } from "./confirmation-modal"

interface UploadFilesProps {
  readonly title: string;
  readonly handleUploadCsv: (data: Record<string, string | number | boolean | null>[]) => void;
  readonly dialogText: DialogTextProps;
}

export default function UploadFiles({
  title,
  handleUploadCsv,
  dialogText,
}: UploadFilesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const onConfirmUpload = () => {
    if (file) {
      Papa.parse<Record<string, string | number | boolean | null>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<Record<string, string | number | boolean | null>>) => {
          console.log("Parsed CSV data:", results.data)
          const filteredData = results.data.filter((row) =>
            Object.values(row).some(
              (value) => typeof value === "string" && value.trim() !== ""
            )
          )
          handleUploadCsv(filteredData)
          window.location.reload()
        },
        error: (error) => {
          console.error("Error al parsear el CSV:", error)
        },
      })
    } else {
      setIsModalOpen(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    } else {
      setFile(null)
    }
  }

  return (
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
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
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
  )
}
