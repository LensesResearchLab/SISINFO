const API_URL_DATES = "http://localhost:8000/api/important-dates";
export async function getPostgraduateThesisDates() {
  const response = await fetch(`${API_URL_DATES}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}
