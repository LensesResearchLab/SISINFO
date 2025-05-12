import { API_ROUTES } from "../routes";

export async function getStudentbyId(id:string) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.STUDENTS}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (!response.ok) {
    throw new Error("Failed to get student.");
  }

  return response.json();
}