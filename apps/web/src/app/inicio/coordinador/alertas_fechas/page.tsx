"use client"
import ImportantDatesManager from "@/components/importat-date-manager";
import { TermCard } from "@/components/shared/period-card";


export default function Alertas(){
    return (
       <div className="grid w-full p-4 gap-4">
  <div className="grid grid-cols-2 gap-4">
    <TermCard handlePeriodChange={(v) => console.log(v)} footer="" />
  </div>
  <ImportantDatesManager />
</div>
    )
}