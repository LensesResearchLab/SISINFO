import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog"
import { Button } from 'components/ui/button'
import { Check } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface DialogTextProps {
  title: string
  description: string
  buttonText: string
  successTitle: string
  successText: string
  url: string
}

/**
 * ConfirmationModal Component
 * 
 * Renders a modal dialog that asks for user confirmation before proceeding with an action.
 * After confirmation, displays a success modal.
 * 
 * @param {Object} props
 * @param {DialogTextProps} props.dialogText - Text content for the dialog
 * @param {Function} props.onConfirm - Callback function to execute on confirmation
 * @returns {JSX.Element} A confirmation dialog or success modal
 */
export function ConfirmationModal({ dialogText, onConfirm}: { dialogText: DialogTextProps, onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  if (isConfirmed) {
    return <SuccessModal successTitle={dialogText.successTitle} successText={dialogText.successText} url={dialogText.url} />
  }
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm(e);
    setIsConfirmed(true);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-black hover:bg-black/90 w-40">{dialogText.buttonText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogText.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogText.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * SuccessModal Component
 * 
 * Displays a success message modal after a confirmed action.
 * Includes a checkmark icon and redirects to a specified URL when closed.
 * 
 * @param {Object} props
 * @param {string} props.successTitle - Title of the success message
 * @param {string} props.successText - Description text for the success message
 * @param {string} props.url - URL to navigate to when modal is closed
 * @returns {JSX.Element} A success message modal
 */
function SuccessModal({successTitle, successText, url}: { successTitle: string, successText: string, url: string }) {
  const navigate = useNavigate();
  return (
    <Dialog open={true} onOpenChange={() => {navigate(url);}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sky-800 text-xl mx-auto">{successTitle}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className="rounded-full bg-sky-100 p-3">
            <Check className="h-16 w-16 text-sky-800" />
          </div>
          <p className="text-center text-gray-600">{successText}</p>
          <Button className="bg-black hover:bg-black/90 w-32" onClick={() => {navigate(url);}}>
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}