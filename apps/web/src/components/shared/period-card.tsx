import { getPeriods } from "@/app/services/period.service";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TermCard({handlePeriodChange, footer, selectedPeriod: parentSelectedPeriod, compact}: {readonly handlePeriodChange: (period: string) => void, readonly footer: string, readonly selectedPeriod?: string, readonly compact?: boolean}) {
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(parentSelectedPeriod ?? "");

  useEffect(() => {
    getPeriods()
      .then((data) => {
        setPeriods(data);
        // Seleccionar automáticamente el último período disponible (el más reciente)
        if (data && data.length > 0) {
          const lastPeriod = data[data.length - 1];
          // If parent already provided a selected period, prefer it; otherwise use stored current period or lastPeriod
          if (!parentSelectedPeriod) {
            const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
            if (stored && data.includes(stored)) {
              setSelectedPeriod(stored);
              handlePeriodChange(stored);
            } else {
              setSelectedPeriod(lastPeriod);
              handlePeriodChange(lastPeriod);
            }
          }
        }
      })
      .catch((error) => console.error("Error fetching periods:", error));
  }, []);

  // Keep internal selectedPeriod synced when parent prop changes
  useEffect(() => {
    if (parentSelectedPeriod && parentSelectedPeriod !== selectedPeriod) {
      setSelectedPeriod(parentSelectedPeriod);
    }
  }, [parentSelectedPeriod]);

  const handleChange = (period: string) => {
    setSelectedPeriod(period);
    handlePeriodChange(period);
  };
  if (compact) {
    return (
      <div className="inline-block">
        <Select onValueChange={handleChange} value={selectedPeriod}>
          <SelectTrigger className="h-8 px-2 py-1 text-sm w-full">
            <SelectValue placeholder="Selecciona periodo" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period, idx) => (
              <SelectItem key={`${period}-${idx}`} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-core">Periodo académico</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleChange} value={selectedPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una periodo" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period, idx) => (
              <SelectItem key={`${period}-${idx}`} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
}