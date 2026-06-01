"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getProfessors } from "@/app/services/professor.service";
import { createProfile, updateProfile } from "@/app/services/profile.service";
import { API_ROUTES } from "@/app/routes";
import { toast } from "sonner";

export default function AdminProfilesPage() {
  const [name, setName] = useState("");
  const [professors, setProfessors] = useState<Array<{ id: string | number; user?: { name?: string } }>>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | undefined>(undefined);
  const [subareas, setSubareas] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStaticSubarea, setSelectedStaticSubarea] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profs = await getProfessors();
        setProfessors(profs || []);
      } catch (e: any) {
        toast.error(e?.message || "Error cargando profesores");
      }
    })();
    // load existing subareas for client-side duplicate check / mapping
    (async () => {
      try {
        const res = await fetch(`${API_ROUTES.BASE}/subareas`);
        const data = await res.json();
        setSubareas(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore: server-side validation still enforced
      }
    })();
  }, []);

  // debug: log when selection changes
  useEffect(() => {
    console.debug("state-change - selectedStaticSubarea:", selectedStaticSubarea, "selectedProfessor:", selectedProfessor);
  }, [selectedStaticSubarea, selectedProfessor]);

  // Static subareas list (only these are allowed)
  const STATIC_SUBAREAS = [
    "CSW",
    "FLAG",
    "COMIT",
    "IMAGINE",
  ];

  const handleAssign = async () => {
    // debug: log current selections
    console.debug("handleAssign - selectedStaticSubarea:", selectedStaticSubarea, "selectedProfessor:", selectedProfessor);
    if (selectedStaticSubarea === undefined || String(selectedStaticSubarea).trim() === "") return toast.error("Selecciona la subárea");
    if (selectedProfessor === undefined || String(selectedProfessor).trim() === "") return toast.error("Selecciona el profesor a cargo");
    setLoading(true);
    try {
      // Re-fetch latest subareas to ensure we act on current data
      try {
        const res = await fetch(`${API_ROUTES.BASE}/subareas`);
        const data = await res.json();
        setSubareas(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore fetch error, continue with local state
      }

      // Find existing profile by name (case-insensitive)
      const found = (subareas || []).find((s) => String(s.name).toLowerCase() === String(selectedStaticSubarea).toLowerCase());
      if (found) {
        // update coordinator
        const updated = await updateProfile(found.id, { coordinatorId: selectedProfessor });
        toast.success("Profesor asignado correctamente");
        setSubareas((s) => s.map((x) => (String(x.id) === String(updated.id) ? updated : x)));
      } else {
        // create the subarea with coordinator
        const created = await createProfile({ name: selectedStaticSubarea, coordinatorId: selectedProfessor });
        toast.success("Subárea creada y profesor asignado correctamente");
        setSubareas((s) => [...s, created]);
      }
      // keep current selections so the admin can see what was assigned
    } catch (e: any) {
      toast.error(e?.message || "Error al asignar profesor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Administrar subáreas de investigación</h1>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Selecciona subárea (estáticas)</label>
          <Select value={selectedStaticSubarea} onValueChange={(v) => setSelectedStaticSubarea(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATIC_SUBAREAS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Profesor a cargo</label>
          <Select value={selectedProfessor} onValueChange={(v) => setSelectedProfessor(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {professors.length > 0 ? (
                professors.map((p) => (
                  <SelectItem key={String(p.id)} value={String(p.id)}>
                    {p.user?.name ?? `Profesor ${p.id}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-professors" disabled>No hay profesores</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => { console.log('button-click assign'); handleAssign(); }} loading={loading}>
            Asignar profesor
          </Button>
          <Button variant="outline" onClick={() => { setSelectedStaticSubarea(undefined); setSelectedProfessor(undefined); }}>
            Limpiar
          </Button>
        </div>
      </div>
      {/* Existing subareas table */}
      <div className="mt-6 bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Subáreas existentes</h2>
        {subareas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay subáreas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-3">Subárea</th>
                  <th className="py-2 px-3">Profesor asignado</th>
                </tr>
              </thead>
              <tbody>
                {subareas.map((s: any) => {
                  const coordinatorId = s.coordinatorId ?? s.coordinator?.id ?? s.coordinatorId;
                  const prof = professors.find((p) => String(p.id) === String(coordinatorId));
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="py-2 px-3">{s.name}</td>
                      <td className="py-2 px-3">{prof ? prof.user?.name : (s.coordinator?.name ?? "-")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
