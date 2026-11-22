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
  readonly templateTitle?: string;
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
    typeUpload,
    templateTitle = "Plantillas"
  }: UploadFilePageProps) {
    const [error,setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    return (
      <div className="flex flex-col w-full gap-4 p-4">
        <AlertDialogError open={error} onOpenChange={setError} message={errorMessage}></AlertDialogError>
        <div className={`grid grid-cols-1 ${period ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-4 items-stretch`}>
          {period && <TermCard handlePeriodChange={handlePeriodChange} footer="" />}
          <TemplateCard handleDownload={handleDownload} title={templateTitle} description="Descargar plantilla" footer="" />
          <UploadFiles title={title} handleUploadCsv={handleUploadCsv} dialogText={dialogText} setError={setError} setErrorMessage={setErrorMessage} typeUpload={typeUpload} selectedPeriod={selectedPeriod} />
        </div>

        {children && <div>{children}</div>}
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
    
    <Card className="border-none h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-core">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Button className="w-64 max-w-64 min-w-0" onClick={handleDownload}>
          <Download />
          {description}
        </Button>
      </CardContent>
      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </Card>
  )
}
