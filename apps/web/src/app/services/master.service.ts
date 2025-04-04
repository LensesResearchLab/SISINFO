const API_URL="http://localhost:8000/api/student"

export async function getStudentbyId(id:string) {
  const response = await fetch(`${API_URL}/${id}`, {
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