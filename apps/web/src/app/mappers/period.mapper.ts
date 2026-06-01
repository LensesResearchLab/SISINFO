import type { Period } from "@/app/types/entities/period.type";

export function mapPeriodsToStringList(periods: Period[]): string[] {
  return periods.map(mapPeriodToString);
}

export function mapPeriodToString(period: Period): string {
  const periodValue = `${period.period}`.padStart(2, "0");
  return `${period.year}${periodValue}`;
}

export function mapStringtoPeriod(date: string): Period {
  const period: Period = {
    period: date.split("-")[0],
    year: Number(date.split("-")[1]),
    semester: 1,
  };

  period.semester = period.period[0] === "1" ? 1 : 2;

  return period;
}
