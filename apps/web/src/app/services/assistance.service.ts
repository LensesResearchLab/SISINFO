const API_URL = "http://localhost:8000/api/graduated-assistances";
const API_URL_REQUIREMENT = "http://localhost:8000/api/requirements";
const API_URL_CONSULT_PERIOD = "http://localhost:8000/api/periods";
const API_URL_APPLICATION = "http://localhost:8000/api/assistance-applications"

export async function createGraduatedAssistance(
  data: object,
  period: string,
  year: number
) {
  const date={period:period, year:year}
  data = { ...data, date};


  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create assistance.");
  }

  return response.json();
}

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

/* Updata Assistance application status using the assistance application id */
// object is valid here for updateData?
export async function updateAssistanceApplication(id: string, updateData: object){
  const response = await fetch(`${API_URL_APPLICATION}/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error("Failed to update assistance.");
  }
  return response.json();
}


/* Update a requirement with its ID */
export async function updateRequirement(
  id: string,
  requirementData: { description: string }
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


/* 
    CHECK IF ALL THIS BELOW WORKS SOMEWHERE:
*/


// TODO: This works? /status returns nothing
export async function getAssistanceStatus() {
  const response = await fetch(`${API_URL}/status`);
  if (!response.ok) {
    throw new Error("Failed to fetch assistance status.");
  }
  return response.json();
}

// TODO: This works? /status returns nothing
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


