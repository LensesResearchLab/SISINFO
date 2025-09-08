"use client"
import { TermCard } from "@/components/shared/period-card";


export default function Alertas(){
    return (
        <div className="grid grid-rows-3 w-full h-full  p-4">
            <div  className="grid grid-cols-2 row-span-1 gap-4 h-4">
            <TermCard handlePeriodChange={(value) => console.log(value)} footer={""} />
              </div>
        </div>
    )
}