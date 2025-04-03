"use client";
import { useEffect, useState, useRef } from "react";
import CoordinatorFeatures from "@/app/inicio/components/coordinator-features";
import ProfessorFeatures from "@/app/inicio/components/professor-features";
import StudentFeatures from "@/app/inicio/components/student-features";
import { TabsContent } from "@/components/ui/tabs";
import { useHomeStore } from "./home.store";
import RoleTab from "@/components/shared/role-tab";
import SupportFeatures from "./components/support-features";
import { getUserInfo } from "../auth/auth-service";

const roleMap = new Map<string, React.ReactNode>([
  [
    "estudiante",
    <StudentFeatures key={"estudiante"}>
      <SupportFeatures />
    </StudentFeatures>,
  ],
  ["profesor", <ProfessorFeatures key={"profesor"} />],
  ["coordinador", <CoordinatorFeatures key={"coordinador"} />],
]);

export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  const setRoles = useHomeStore((state) => state.setRoles);

  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  /* Fetch the user role to display the correct view based on his role*/
  useEffect(() => {
    if (!fetchedRef.current) {
      async function fetchUserRoles() {
        try {
          const userInfo = await getUserInfo();
          if (userInfo.success && userInfo.user?.roles) {
            setRoles(userInfo.user.roles);
          } else {
            console.log("ERROR: User info fetched but no roles found");
            //console.log(userInfo);
          }
        } catch (error) {
          console.error("Failed to fetch user roles:", error);
        } finally {
          setLoading(false);
          fetchedRef.current = true;
        }
      }

      fetchUserRoles();
    }
  }, [setRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);
  return (
    <RoleTab>
      <RoleInformation />
    </RoleTab>
  );
}

function RoleInformation() {
  /* Apply fetched roles of before to the content displayer */
  const roles = useHomeStore((state) => state.roles);
  return (
    <>
      {roles.map((role) => (
        <TabsContent key={role} value={role}>
          {roleMap.get(role)}
        </TabsContent>
      ))}
    </>
  );
}
