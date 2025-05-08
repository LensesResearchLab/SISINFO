import { mapProjectsToStudentTable } from "../mappers/project.mapper";
import { API_ROUTES } from "../routes";
import { Project } from "../types/entities/project.type";

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



export async function getUndergraduateThesisById(id: string){
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECTS}/${id}`;
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

export async function createProjectApplication(
  motivation: string,
  contacted: boolean,
  projectId: string,
  studentId: string
) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECT_APPLICATIONS}`;
  const application = {
    motivation,
    contacted,
    projectId,
    studentId,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });
  if (!response.ok) {
    throw new Error("Failed to create project application.");
  }
  return await response.json();
}


// TODO
export async function getUndergraduateThesisStatusInformation(studentId: string){
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECT_APPLICATIONS}/student/${studentId}`;
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
export async function getThesisByProfessor(): Promise<Project[]> {
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