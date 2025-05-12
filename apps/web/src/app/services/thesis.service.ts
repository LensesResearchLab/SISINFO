import { API_ROUTES } from "../routes";
import { Thesis } from "../types/entities/thesis.type";

export async function getPostgraduateThesis() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisById(id: string) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisStatus(id?: string) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS_APPLICATIONS}/${id}`);
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
    const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS_APPLICATIONS}/${studentId}`, {
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

    // TODO: Return response for modal

  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar la aplicación");
  }
}

/* POSTGRAUATE THESIS FOR PROFESSOR */
/* Postgraduate Theses for professor create */
export async function postNewThesis(userId:string, thesisData: any, periodId:string): Promise<Thesis[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.THESIS}?professorId=${userId}&period=${periodId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thesisData),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch thesis data.");
  }
  return await response.json();
}

/* Postgraduate Theses for professor view */
export async function getThesesByProfessor(userId:string): Promise<Thesis[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.THESIS}/professor/${userId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch thesis data.");
  }
  return await response.json();
}

export async function getApplicationsByThesisId(thesisId:string): Promise<Thesis[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.THESIS_APPLICATIONS}/applicants/${thesisId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch thesis data.");
  }
  return await response.json();
}




/* Posgraduate Report */
/* API GET for coordinators report of thesis */
export async function getThesisApplicationsReport() {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.THESIS}`);
  if (!response.ok) {
    throw new Error("Failed to fetch undergraduate projects data for report.");
  }
  return response.json();
}