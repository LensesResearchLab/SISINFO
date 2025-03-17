"use client";

import AssistanceList from "../../graduated-assistance/assistance-list/page";

// TODO: fetch this from auth
const CURRENT_USER = {
  name: "Camilo Escobar",
  role: "professor",
};

export default function ProfessorAssistanceList() {
  return <AssistanceList role="professor" professorName={CURRENT_USER.name} />;
}
