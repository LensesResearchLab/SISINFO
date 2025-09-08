import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { CheckCircle } from "lucide-react"

interface AlertDialogSuccessProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly message?: string
}

export function AlertDialogSuccess({ open, onOpenChange, message }: AlertDialogSuccessProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDialogTitle className="text-green-800">Operación exitosa</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message ?? "La operación se completó correctamente."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Aceptar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
