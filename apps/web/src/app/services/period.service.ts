import { mapPeriodsToStringList } from "../mappers/period.mapper"
import { Period } from "../types/period.type"
import { API_ROUTES } from "../routes"

export async function getPeriods() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.PERIODS}`)
  const periods: Period[] = await response.json()
  return mapPeriodsToStringList(periods)
}

export async function getPeriodsWMap() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.PERIODS}`)
  const periods: Period[] = await response.json()
  return periods
}