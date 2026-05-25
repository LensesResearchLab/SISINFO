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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface DialogTextProps {
  title: string;
  description: string;
  buttonText: string;
  successTitle: string;
  successText: string;
  url?: string;
  isError?: boolean;
  errorTitle?: string;
  errorText?: string;
}

/**
 * ConfirmationModal Component
 *
 * Renders a modal dialog that asks for user confirmation before proceeding with an action.
 * After confirmation, displays a success or error modal based on the isError prop.
 *
 * @param {Object} props
 * @param {DialogTextProps} props.dialogText - Text content for the dialog
 * @param {Function} props.onConfirm - Callback function to execute on confirmation
 * @returns {JSX.Element} A confirmation dialog or success/error modal
 */
export function ConfirmationModal({
  dialogText,
  onConfirm,
  open,
  setIsOpen,
}: {
  readonly dialogText: DialogTextProps;
  readonly onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  readonly open: boolean;
  readonly setIsOpen: (open: boolean) => void;
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  if (isConfirmed) {
    return (
      <ResultModal
        successTitle={hasError ? (dialogText.errorTitle ?? "Error") : dialogText.successTitle}
        successText={hasError ? (errorMessage ?? dialogText.errorText ?? "Ocurrió un error inesperado. Intenta nuevamente.") : dialogText.successText}
        url={hasError ? undefined : dialogText.url}
        setIsConfirmed={(v) => { setIsConfirmed(v); setHasError(false); setErrorMessage(undefined); if (!v) setIsOpen(false); }}
        isError={hasError || dialogText.isError}
      />
    );
  }
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await onConfirm(e);
      setIsConfirmed(true);
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err?.message ?? undefined);
      setIsConfirmed(true);
    }
  };

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
          <AlertDialogAction onClick={handleConfirm}>
            {dialogText.buttonText ?? "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * ResultModal Component
 *
 * Displays a success or error message modal after a confirmed action.
 * Includes a checkmark icon for success or warning icon for error.
 * Redirects to a specified URL when closed.
 *
 * @param {Object} props
 * @param {string} props.successTitle - Title of the message
 * @param {string} props.successText - Description text for the message
 * @param {string} props.url - URL to navigate to when modal is closed
 * @param {boolean} props.isError - Whether to display as an error message
 * @returns {JSX.Element} A success or error message modal
 */
function ResultModal({
  successTitle,
  successText,
  url,
  setIsConfirmed,
  isError = false,
}: {
  readonly successTitle: string;
  readonly successText: string;
  readonly url?: string;
  readonly setIsConfirmed: (confirmed: boolean) => void;
  readonly isError?: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const handleAccept = () => {
    if (url && url.trim() !== "") {
      router.push(url);
    } else {
      setIsConfirmed(false);
      setIsOpen(false);
    }
  };

  const iconBgColor = isError ? "bg-red-100" : "bg-core-soft";
  const iconColor = isError ? "text-red-600" : "text-core";
  const textColor = isError ? "text-red-600" : "text-core";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsConfirmed(false);
        setIsOpen(false);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`text-xl mx-auto ${textColor}`}>
              {successTitle}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className={`rounded-full ${iconBgColor} p-3`}>
            {isError ? (
              <AlertTriangle className={`h-16 w-16 ${iconColor}`} />
            ) : (
              <Check className={`h-16 w-16 ${iconColor}`} />
            )}
          </div>
          <p className={`text-center ${textColor}`}>{successText}</p>
          <Button className="w-32" onClick={handleAccept}>
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
