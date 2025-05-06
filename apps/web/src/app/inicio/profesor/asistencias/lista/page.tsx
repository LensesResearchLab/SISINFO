"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "@/app/auth/auth-service";
import { AssistanceList } from "@/components/shared/assistance-list";

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
