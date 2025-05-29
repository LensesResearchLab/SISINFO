import { mapProjectsToStudentTable } from "../mappers/project.mapper";
import { API_ROUTES } from "../routes";
import { CreateProjectApplication, ProjectApplication } from "../types/entities/project-application.type";
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



export async function getUndergraduateProjectById(id: string){
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
  application:CreateProjectApplication
) {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECT_APPLICATIONS}`;
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

export async function getThesisStatusInformation(id:string) {
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
export async function getProjectsByProfessor(userId:string): Promise<Project[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.PROJECTS}/professor/${userId}`;
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