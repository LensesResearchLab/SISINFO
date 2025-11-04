"use client"
import ImportantDatesManager from "@/components/importat-date-manager";
import { TermCard } from "@/components/shared/period-card";
import { useCallback, useState } from "react";


export default function Alertas(){
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const onPeriodChange = useCallback((v: string) => {
    setSelectedPeriod(v);
  }, []);

  return (
       <div className="w-full p-4">
  <div className="mx-auto max-w-3xl space-y-4">
    <TermCard handlePeriodChange={onPeriodChange} footer="" />
    <ImportantDatesManager selectedPeriod={selectedPeriod} />
  </div>
</div> 
    )
}