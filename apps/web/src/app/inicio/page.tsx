"use client";
import { useEffect, useState, useRef } from "react";
import CoordinatorFeatures from "@/app/inicio/components/coordinator-features";
import ProfessorFeatures from "@/app/inicio/components/professor-features";
import StudentFeatures from "@/app/inicio/components/student-features";
import { TabsContent } from "@/components/ui/tabs";
import { useHomeStore } from "./home.store";
import RoleTab from "@/components/shared/role-tab";
import SupportFeatures from "./components/support-features";
import { fetchUserRoles } from "../auth/auth-service";
import SpinnerPage from "@/components/shared/spinner-page";
import GraduateStudentFeatures from "./components/graduate-student-features";
import AdministratorFeatures from "./components/administrator-features";

const roleMap = new Map<string, React.ReactNode>([
  [
    "estudiante",
    <StudentFeatures key={"estudiante"}>
      <SupportFeatures />
    </StudentFeatures>,
  ],
  [
    "estudiante_maestria",
    <GraduateStudentFeatures key={"estudiante_maestria"}>
      <SupportFeatures />,
    </GraduateStudentFeatures>,
  ],
  [
    "profesor",
    <ProfessorFeatures key={"profesor"}>
      <SupportFeatures />,
    </ProfessorFeatures>,
  ],
  ["coordinador", <CoordinatorFeatures key={"coordinador"} />],
  ["administrador", <AdministratorFeatures key={"administrador"} />],
]);

export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  const setRoles = useHomeStore((state) => state.setRoles);

  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  /* Fetch the user role to display the correct view based on his role*/
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchUserRoles(setRoles, setLoading, fetchedRef);
    }
  }, [setRoles]);

  if (loading) return <SpinnerPage />;

  if (roles.length === 0) return null;
  if (roles.length === 1) return roleMap.get(roles[0]);
  return (
    <RoleTab>
      <RoleInformation />
    </RoleTab>
  );
}

function RoleInformation() {
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
