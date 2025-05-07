const API_URL = "http://localhost:8000/api/project-applications"

export async function getProjectApplicationsReport() {
    const response = await fetch(`${API_URL}/projects-report`);
    if (!response.ok) {
      throw new Error("Failed to fetch undergraduate projects data for report.");
    }
    return response.json();
  }

export async function updateProjectApplication(
  id: string,
  updateData: object
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error("Failed to update assistance.");
  }
  return response.json();
}