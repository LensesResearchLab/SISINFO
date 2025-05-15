import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full px-4 text-center">
      <AlertTriangle className="text-red-500 w-16 h-16" />
      <h1 className="text-2xl font-bold mt-4 text-red-600">¡Algo salió mal!</h1>
      <p className="text-lg mt-2 text-muted-foreground">
        No pudimos cargar la información. Intenta de nuevo más tarde.
      </p>
    </div>
  );
}
