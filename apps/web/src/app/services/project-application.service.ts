const API_URL = "http://localhost:8000/api/project-applications/projects-report"

export async function getProjectApplicationsReport() {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Failed to fetch undergraduate projects data for report.");
    }
    return response.json();
  }