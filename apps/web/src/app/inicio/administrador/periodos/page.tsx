"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createPeriod } from "@/app/services/period.service";
import { toast } from "sonner";

export default function AdminPeriodsPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      // Map semester to period code (10 for sem1, 20 for sem2)
      const periodCode = `${semester}0`;
      await createPeriod({ period: periodCode, year, semester });
      toast.success("Periodo agregado");
    } catch (e: any) {
      toast.error(e?.message ?? "Error al crear periodo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Administrar períodos</h1>

      <div className="bg-card rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Año</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Semestre</label>
            <Select value={String(semester)} onValueChange={(v) => setSemester(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button onClick={handleCreate} loading={isLoading} className="w-full">
              Agregar período
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
