"use client";
import { useState } from "react";

export default function Tesis2Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSending(true); setMessage("");
    try {
      const response = await fetch("/api/thesis-applications", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ currentStage: "tesis2", stageTitle: title, stageDescription: description }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "No fue posible enviar la solicitud.");
      setMessage("Solicitud enviada al asesor."); setTitle(""); setDescription("");
    } catch (error: any) { setMessage(error.message); } finally { setSending(false); }
  }
  return <div className="min-h-full mx-auto p-4 container max-w-[900px]"><div className="bg-card rounded-xl shadow-lg p-6 space-y-4"><h1 className="text-xl font-bold text-core-highlight">Solicitud de inscripción a Tesis 2</h1><p className="text-sm text-muted-foreground">La solicitud requiere que Tesis 1 haya sido aprobada.</p>{message && <p className="text-sm">{message}</p>}<form onSubmit={submit} className="space-y-4"><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título o avance de Tesis 2" className="w-full rounded-md border px-3 py-2" /><textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del avance" className="w-full rounded-md border px-3 py-2 min-h-32" /><button disabled={sending} className="rounded bg-core px-4 py-2 text-white">{sending ? "Enviando..." : "Enviar solicitud"}</button></form></div></div>;
}
