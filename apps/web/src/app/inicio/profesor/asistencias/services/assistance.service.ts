const API_URL = "http://localhost:8000/api/graduated-assistances";
const API_URL_REQUIREMENT = "http://localhost:8000/api/requirements";
const API_URL_CONSULT_PERIOD ="http://localhost:8000/api/periods"

export async function createGraduatedAssistance(
    data: object,
    period: string,
    year:number
) {
    const consultPeriod = await fetch(`${API_URL_CONSULT_PERIOD}/${period}/${year} `, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const idPeriod = await consultPeriod.json();
    data = {...data, periodId: idPeriod.id};
    console.log(data);

    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }); 

    if (!response.ok || !consultPeriod.ok) {
        throw new Error("Failed to create assistance.");
    }

    return response.json();
}
export async function createRequirement(requirement:string) {
    const response = await fetch(`${API_URL_REQUIREMENT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: requirement}),
    });
    if (!response.ok) {
        throw new Error("Failed to create requirement.");
    }
    return response.json();
}