"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
  import { Button } from '@/components/ui/button'
  import { Check } from "lucide-react"
  import React, { useState } from "react"
  import { useRouter } from 'next/navigation'
  
  export interface DialogTextProps {
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
  export function ConfirmationModal({ dialogText, onConfirm, open, setIsOpen}: { 
    readonly dialogText: DialogTextProps, 
    readonly onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void , 
    readonly open: boolean,
    readonly setIsOpen: (open: boolean) => void
  }) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    if (isConfirmed) {
      return <SuccessModal successTitle={dialogText.successTitle} successText={dialogText.successText} url={dialogText.url} />
    }
    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
      onConfirm(e);
      setIsConfirmed(true);
    }

    
    
    return (
      <AlertDialog open={open} onOpenChange={setIsOpen}>
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
  function SuccessModal({successTitle, successText, url}: { readonly successTitle: string, readonly successText: string, readonly url: string }) {
    const router = useRouter();
    return (
      <Dialog open={true} onOpenChange={() => {router.push(url);}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-core text-xl mx-auto">{successTitle}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div className="rounded-full bg-core-soft p-3">
              <Check className="h-16 w-16 text-core" />
            </div>
            <p className="text-center text-core">{successText}</p>
            <Button className="w-32" onClick={() => {router.push(url);}}>
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }