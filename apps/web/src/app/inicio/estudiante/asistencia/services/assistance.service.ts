const API_URL = "http://localhost:8000/api/graduated-assistances";
const API_URL_REQUIREMENT = "http://localhost:8000/api/requirements";

export async function getGraduatedAssistance() {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated assistance data.");
  }
  return response.json();
}

export async function getGraduatedAssistanceById(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Assistance not found.");
  }
  return response.json();
}

export async function getAssistanceStatus() {
  const response = await fetch(`${API_URL}/status`);
  if (!response.ok) {
    throw new Error("Failed to fetch assistance status.");
  }
  return response.json();
}

export async function getAssistanceStatusById(id: string) {
  const response = await fetch(`${API_URL}/status/${id}`);
  if (!response.ok) {
    throw new Error("Assistance status not found.");
  }
  return response.json();
}

export async function updateGraduatedAssistance(
  id: string,
  updateData: object
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update assistance.");
  }

  return response.json();
}

export async function updateRequirement(
  id: string,
  requirementData: { name: string }
) {
  const response = await fetch(`${API_URL_REQUIREMENT}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requirementData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update requirement with ID ${id}.`);
  }

  return response.json();
}
