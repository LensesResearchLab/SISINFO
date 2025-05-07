const API_URL = "http://localhost:8000/api/theses";
const API_URL_APPLICATIONS = "http://localhost:8000/api/thesis-applications";

export async function getPostgraduateThesis() {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisById(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisStatus(id?: string) {
  const response = await fetch(`${API_URL_APPLICATIONS}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function postThesisApplication(
  thesisId: string,
  studentId: string
) {
  try {
    const response = await fetch(`${API_URL_APPLICATIONS}/${studentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thesisId,
        status: "Postulado",
        grade: "Pendiente",
      }),
    });



    if (response.ok) {
      alert("Aplicación enviada con éxito");
    } else {
      alert("Error al enviar la aplicación");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar la aplicación");
  }
}

/* Posgraduate Report */
/* API GET for coordinators report of thesis */
const API_URL_REPORT =
  "http://localhost:8000/api/thesis-applications/thesis-report";
export async function getThesisApplicationsReport() {
  const response = await fetch(`${API_URL_REPORT}`);
  if (!response.ok) {
    throw new Error("Failed to fetch undergraduate projects data for report.");
  }
  return response.json();
}
