import { getPeriods } from "@/app/services/period.service";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TermCard({handlePeriodChange, footer}: {readonly handlePeriodChange: (period: string) => void, readonly footer: string}) {
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  useEffect(() => {
    getPeriods()
      .then((data) => {
        setPeriods(data);
        // Seleccionar automáticamente el último período disponible (el más reciente)
        if (data && data.length > 0) {
          const lastPeriod = data[data.length - 1];
          setSelectedPeriod(lastPeriod);
          handlePeriodChange(lastPeriod);
        }
      })
      .catch((error) => console.error("Error fetching periods:", error));
  }, [handlePeriodChange]);

  const handleChange = (period: string) => {
    setSelectedPeriod(period);
    handlePeriodChange(period);
  };

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
  )
}