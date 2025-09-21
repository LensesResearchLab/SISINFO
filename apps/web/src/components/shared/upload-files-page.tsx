import { Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { DialogTextProps } from "./confirmation-modal";
import UploadFiles from "./upload-files";
import { Button } from "../ui/button";

import { AlertDialogError } from "./alert-dialog-error";
import { TermCard } from "./period-card";
import { useState } from "react";

interface UploadFilePageProps {
  readonly title: string
  readonly period?: boolean ;
  readonly selectedPeriod?: string;
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
    selectedPeriod,
    handlePeriodChange,
    handleDownload,
    handleUploadCsv,
    dialogText,
    children,
    typeUpload
  }: UploadFilePageProps) {
    const [error,setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    return (
      <div className="grid grid-rows-3 w-full h-full gap-4 p-4">
        <AlertDialogError open={error} onOpenChange={setError} message={errorMessage}></AlertDialogError>
         <div  className="grid grid-cols-2 row-span-1 gap-4 h-4">
          {period &&<TermCard handlePeriodChange={handlePeriodChange} footer={""} />}
          <TemplateCard handleDownload={handleDownload} title="Plantillas" description="Descargar plantilla" footer="" />
        </div>
  
        <div className="row-span-3">
          <UploadFiles title={title} handleUploadCsv={handleUploadCsv} dialogText={dialogText} setError={setError} setErrorMessage={setErrorMessage} typeUpload={typeUpload} selectedPeriod={selectedPeriod} />
        </div>
  
        <div className="row-span-3">
          {children}
        </div>
      </div>
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
