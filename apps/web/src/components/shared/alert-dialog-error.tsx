import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
  } from "@/components/ui/alert-dialog"
  
  interface AlertDialogErrorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    message?: string
  }
  
  export function AlertDialogError({ open, onOpenChange, message }: AlertDialogErrorProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al cargar cartelera</AlertDialogTitle>
            <AlertDialogDescription>
              {message ?? "No hay cartelera cargada para ese periodo."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  