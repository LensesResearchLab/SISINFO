import type { Period } from '@/app/types/period.type';

export function mapPeriodsToStringList(
  periods: Period[],
): string[] {
  return periods.map(mapPeriodToString)
}

export function mapPeriodToString(period: Period): string {
  return period.period;
}

