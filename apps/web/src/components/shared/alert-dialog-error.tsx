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
    readonly open: boolean
    readonly onOpenChange: (open: boolean) => void
    readonly message?: string
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
  