"use client"

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import React from "react";

export default function DateRangePicker({
  value,
  onChange,
  className,
}: {
  readonly value: { from: Date; to: Date } | undefined;
  readonly onChange: (value: { from: Date; to: Date } | undefined) => void;
  readonly className?: string;
}) {
  const formatValue = (value: {
    from: Date;
    to: Date;
  } | undefined) => {
    if (value?.from) {
      return value.to ? (
        <>
          {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
        </>
      ) : (
        format(value.from, "LLL dd, y")
      )
    }
    return <span>Selecciona un rango de fechas</span>
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatValue(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={value}
            onSelect={(range) => onChange(range ? { from: range.from ?? new Date(), to: range.to ?? new Date() } : undefined)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
