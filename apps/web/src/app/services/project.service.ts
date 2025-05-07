import { mapProjectsToStudentTable } from "../mappers/project.mapper";
import { API_ROUTES } from "../routes";

export async function getUndergraduateThesis({
  category,
  period,
}: {
  category: string,
  period: string
}) {
  const queryParams = new URLSearchParams({
    period
  });
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECTS}?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch undergraduate thesis data.");
  }
  return mapProjectsToStudentTable(await response.json(), category);
}


// TODO
export async function getUndergraduateThesisById(id: string){
  const url = `${API_ROUTES.BASE}/${id}`;
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
export async function getUndergraduateThesisStatusInformation(id: string){
  const url = `${API_ROUTES.BASE}/${id}`;
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
  const url = `${API_ROUTES.BASE}/`;
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
  const url = `${API_ROUTES.BASE}/`;
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