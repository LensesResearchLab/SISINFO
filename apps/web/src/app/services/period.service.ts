import { mapPeriodsToStringList } from "../mappers/period.mapper"
import { Period } from "../types/entities/period.type"
import { API_ROUTES } from "../routes"

export async function getPeriods() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.PERIODS}`)
  if (!response.ok) throw new Error("Failed to fetch periods")
  const payload = await response.json()
  const periods: Period[] = Array.isArray(payload) ? payload : (payload.value ?? [])
  return mapPeriodsToStringList(periods)
}

export async function getPeriodsWMap() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.PERIODS}`)
  if (!response.ok) throw new Error("Failed to fetch periods")
  const payload = await response.json()
  const periods: Period[] = Array.isArray(payload) ? payload : (payload.value ?? [])
  return periods
}

export async function createPeriod(createDto: {
  period: string;
  year: number;
  semester: number;
}) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.PERIODS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(createDto),
  });
  if (!response.ok) {
    let message = "Error creating period";
    try {
      const json = await response.json();
      if (json && (json.message || json.error)) {
        message = json.message || json.error;
      } else {
        message = JSON.stringify(json);
      }
    } catch (e) {
      const text = await response.text();
      message = text || message;
    }
    throw new Error(message);
  }
  return await response.json();
}
