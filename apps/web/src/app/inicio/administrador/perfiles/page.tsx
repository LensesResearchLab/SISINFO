"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getProfessors } from "@/app/services/professor.service";
import { createProfile } from "@/app/services/profile.service";
import { toast } from "sonner";

export default function AdminProfilesPage() {
  const [name, setName] = useState("");
  const [professors, setProfessors] = useState<Array<{ id: string | number; user?: { name?: string } }>>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | undefined>(undefined);
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
  }, []);

  const handleCreate = async () => {
    if (!name) return toast.error("Ingresa el nombre del perfil");
    if (!selectedProfessor) return toast.error("Selecciona el profesor a cargo");
    setLoading(true);
    try {
      await createProfile({ name, coordinatorId: selectedProfessor });
      toast.success("Perfil creado correctamente");
      setName("");
      setSelectedProfessor(undefined);
    } catch (e: any) {
      toast.error(e?.message || "Error al crear perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Administrar perfiles</h1>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Nombre del perfil</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ingeniería de Software" />
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
          <Button onClick={handleCreate} loading={loading}>
            Crear perfil
          </Button>
          <Button variant="outline" onClick={() => { setName(""); setSelectedProfessor(undefined); }}>
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
