const API_URL = "http://localhost:8000/api/graduated-assistances";
const API_URL_REQUIREMENT = "http://localhost:8000/api/requirements";
const API_URL_APPLICATION = "http://localhost:8000/api/assistance-applications";

export async function createGraduatedAssistance(data: object) {
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
export async function updateAssistanceApplication(
  id: string,
  updateData: object
) {
  const response = await fetch(`${API_URL_APPLICATION}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
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

export async function createRequirimentForGraduatedAssistance(
  graduatedAssistanceId: string,
  requirementData: string
) {
  const response_post_req = await fetch(`${API_URL_REQUIREMENT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: requirementData }),
  });

  const newRequirement = await response_post_req.json();
  console.log(newRequirement);
  const response_link_req = await fetch(
    `${API_URL_REQUIREMENT}/${newRequirement.id}/assistance/${graduatedAssistanceId}`, // api/requirements/reqID/assistance/assistanceID
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response_post_req.ok || !response_link_req.ok) {
    throw new Error(`Failed to update requirements.`);
  }
  return response_link_req.json();
}

/* Delete grad assistance with id (also deletes reqs and applications linked) */
export async function deleteGraduatedAssistance(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete Graduated Assistance with ID ${id}.`);
  }
  return {
    message: `Graduated Assistance with ID ${id} deleted successfully.`,
  };
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
