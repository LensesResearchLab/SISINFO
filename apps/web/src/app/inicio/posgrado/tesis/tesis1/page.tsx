"use client";
import { useState } from "react";

export default function Tesis1Page() {
  return <MasterStageForm stage="tesis1" title="Solicitud de inscripción a Tesis 1" />;
}

function MasterStageForm({ stage, title }: { stage: "tesis1" | "tesis2"; title: string }) {
  const [stageTitle, setStageTitle] = useState("");
  const [stageDescription, setStageDescription] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSending(true); setMessage("");
    try {
      const response = await fetch("/api/thesis-applications", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ currentStage: stage, stageTitle, stageDescription }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "No fue posible enviar la solicitud.");
      setMessage("Solicitud enviada al asesor."); setStageTitle(""); setStageDescription("");
    } catch (error: any) { setMessage(error.message); } finally { setSending(false); }
  }

  return <div className="min-h-full mx-auto p-4 container max-w-[900px]">
    <div className="bg-card rounded-xl shadow-lg p-6 space-y-4">
      <h1 className="text-xl font-bold text-core-highlight">{title}</h1>
      <p className="text-sm text-muted-foreground">La solicitud solo está disponible después de aprobar la inscripción a la subárea.</p>
      {message && <p className="text-sm">{message}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input required value={stageTitle} onChange={(e) => setStageTitle(e.target.value)} placeholder="Título de la propuesta" className="w-full rounded-md border px-3 py-2" />
        <textarea required value={stageDescription} onChange={(e) => setStageDescription(e.target.value)} placeholder="Descripción de la propuesta" className="w-full rounded-md border px-3 py-2 min-h-32" />
        <button disabled={sending} className="rounded bg-core px-4 py-2 text-white">{sending ? "Enviando..." : "Enviar solicitud"}</button>
      </form>
    </div>
  </div>;
}
