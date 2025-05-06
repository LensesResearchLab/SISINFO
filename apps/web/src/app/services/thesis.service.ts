import { Thesis } from "../types/thesis.type";

const API_URL = "http://localhost:8000/api/theses";
const API_URL_APPLICATIONS = "http://localhost:8000/api/thesis-applications";

export async function getPostgraduateThesis() {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}
// TODO
export async function getUndergraduateThesisById(id: string){
    const url = `${API_URL}/${id}`;
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


// TODO
export async function getThesisStatusInformation(id: string){
  const url = `${API_URL}/${id}`;
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

// TODO
export async function getUndergraduateThesisDates() {
  const url = `${API_URL}`;
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


// TODO
export async function getUndergraduateThesis({
  category,
  semester,
}: {
  category: string,
  semester: string
}) {
  console.log(category, semester)
  const url = `${API_URL}/`;
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

// TODO
export async function getThesisByProfessor(): Promise<Thesis[]> {
  const url = `${API_URL}/`;
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
