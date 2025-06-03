import { API_ROUTES } from "../routes";

const API_URL_DATES = `${API_ROUTES.BASE}/important-dates`;
export async function getPostgraduateThesisDates() {
  const response = await fetch(`${API_URL_DATES}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}
