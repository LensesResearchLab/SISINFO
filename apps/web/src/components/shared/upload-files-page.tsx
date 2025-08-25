import { getPeriods } from "@/app/services/period.service";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { DialogTextProps } from "./confirmation-modal";
import UploadFiles from "./upload-files";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UploadFilePageProps {
  readonly title: string
  readonly period?: boolean ;
  readonly handlePeriodChange: (value: string) => void;
  readonly handleDownload: () => void;
  readonly handleUploadCsv: (data: Record<string, string | number | boolean | null>[]) => void;
  readonly dialogText: DialogTextProps;
  readonly children?: React.ReactNode;
  readonly typeUpload: string;
}

export function UploadFilePage({
    title,
    period=true,
    handlePeriodChange,
    handleDownload,
    handleUploadCsv,
    dialogText,
    children,
    typeUpload
  }: UploadFilePageProps) {
    return (
      <div className="grid grid-rows-3 w-full h-full gap-4 p-4">
         <div  className="grid grid-cols-2 row-span-1 gap-4 h-4">
          {period &&<TermCard handlePeriodChange={handlePeriodChange} footer={""} />}
          <TemplateCard handleDownload={handleDownload} title="Plantillas" description="Descargar plantilla" footer="" />
        </div>
  
        <div className="row-span-3">
          <UploadFiles title={title} handleUploadCsv={handleUploadCsv} dialogText={dialogText} typeUpload={typeUpload} />
        </div>
  
        <div className="row-span-3">
          {children}
        </div>
      </div>
    )
  }

function TermCard({handlePeriodChange, footer}: {readonly handlePeriodChange: (period: string) => void, readonly footer: string}) {
  const [periods, setPeriods] = useState<string[]>([]);
  useEffect(() => {
    getPeriods()
      .then((data) => setPeriods(data))
      .catch((error) => console.error("Error fetching periods:", error));
  }, []);
  return (
    <Card className="border-none">
    <CardHeader>
      <CardTitle className="text-core">Periodo académico</CardTitle>
    </CardHeader>
    <CardContent>
      <Select onValueChange={handlePeriodChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una periodo" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period, idx) => (
            <SelectItem key={`${period}-${idx}`} value={period}>
              {period}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardContent>
    <CardFooter>{footer}</CardFooter>
  </Card>
  )
}

interface TemplateCardProps {
  readonly handleDownload : () => void, 
  readonly title: string, 
  readonly description: string, 
  readonly footer: string
}

function TemplateCard({handleDownload, title, description, footer} : TemplateCardProps) {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-core">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleDownload}>
          <Download />
          {description}
        </Button>
      </CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  )
}
