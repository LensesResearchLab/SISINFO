"use client";

import { useEffect, useState } from "react";
import AssistanceList from "@/app/inicio/estudiante/asistencia/lista/page";
import { getUserInfo } from "@/app/auth/auth-service";

export default function ProfessorAssistanceList() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "profesor",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userInfo = await getUserInfo();
        //console.log(userInfo.user.name);
        if (userInfo.success && userInfo.user) {
          setCurrentUser({
            name: userInfo.user.name,
            role: "profesor",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return <AssistanceList role="profesor" professorName={currentUser.name} />;
}
