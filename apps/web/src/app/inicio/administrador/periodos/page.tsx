"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createPeriod, getPeriods } from "@/app/services/period.service";
import { toast } from "sonner";

export default function AdminPeriodsPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      // Map semester to period code (10 for sem1, 20 for sem2)
      const periodCode = `${semester}0`;
      await createPeriod({ period: periodCode, year, semester });
      toast.success("Periodo agregado");
      await fetchPeriods();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al crear periodo");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeriods = async () => {
    setLoadingPeriods(true);
    try {
      const list = await getPeriods();
      setPeriods(list ?? []);
      // sync current period from localStorage if exists
      const stored = localStorage.getItem("current_period");
      if (stored) setCurrentPeriod(stored);
    } catch (e) {
      setPeriods([]);
    } finally {
      setLoadingPeriods(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleSetCurrent = (period: string) => {
    try {
      localStorage.setItem("current_period", period);
      setCurrentPeriod(period);
      toast.success("Periodo actual actualizado");
    } catch (e) {
      toast.error("No se pudo establecer el periodo actual");
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
      {/* Tabla de periodos creados */}
      <div className="mt-6 bg-card rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Períodos creados</h2>
        <div className="mb-4">
          <label className="text-sm text-muted-foreground block mb-1">Período actual</label>
          {periods && periods.length > 0 ? (
            <Select value={currentPeriod ?? ""} onValueChange={(v) => handleSetCurrent(v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Selecciona periodo actual" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground">No hay períodos disponibles</div>
          )}
        </div>
        {loadingPeriods ? (
          <div className="text-sm text-muted-foreground">Cargando períodos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">Código</th>
                  <th className="py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {periods && periods.length > 0 ? (
                  periods.map((p) => (
                    <tr key={p} className="border-t">
                      <td className="py-2">{p}</td>
                      <td className="py-2">
                        {currentPeriod === p ? (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Actual</span>
                        ) : (
                          <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => handleSetCurrent(p)}
                          >
                            Establecer como actual
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 text-sm text-muted-foreground">No hay períodos creados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
