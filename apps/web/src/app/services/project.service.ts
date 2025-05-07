import { API_ROUTES } from "../routes";
export async function getProjectById(
  id: string
) {
  const response = await fetch(`${API_ROUTES.BASE}+${API_ROUTES.PROJECTS}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to update assistance.");
  }
  return response.json();
}