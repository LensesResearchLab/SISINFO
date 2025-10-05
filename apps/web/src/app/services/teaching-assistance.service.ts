import { API_ROUTES } from "../routes";

/**
 * Fetches the monitors report for a specific period
 * @param period - Period identifier (e.g., "2025-1")
 * @returns Promise with the monitors report data
 */
export async function getMonitorsReport(period: string) {
  const response = await fetch(
    `${API_ROUTES.BASE}/${API_ROUTES.TEACHING_ASSISTANTS}/monitors-report?period=${period}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch monitors report.");
  }
  
  return response.json();
}
