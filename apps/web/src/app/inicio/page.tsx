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
import { getPendingTasksForProfessor, getPendingTasksForStudent } from "@/app/services/project-application.service";
import { getUserInfo } from "@/app/auth/auth-service";
import { flows } from "./tareas/flows";

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
      <SupportFeatures />
    </GraduateStudentFeatures>,
  ],
  [
    "profesor",
    <ProfessorFeatures key={"profesor"}>
      <SupportFeatures />
    </ProfessorFeatures>,
  ],
  ["coordinador", <CoordinatorFeatures key={"coordinador"} />],
  ["administrador", <AdministratorFeatures key={"administrador"} />],
]);

export default function Home() {
  const roles = useHomeStore((state) => state.roles);
  const setRoles = useHomeStore((state) => state.setRoles);
  const setTasks = useHomeStore((state) => state.setTasks);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchUserRoles(setRoles, setLoading, fetchedRef);

      getUserInfo().then((data) => {
        const userId = data.user.id;

        Promise.all([
          getPendingTasksForStudent(userId),
          getPendingTasksForProfessor(userId),
        ]).then(([studentTasks, professorTasks]) => {
          const allTasks = [...studentTasks, ...professorTasks];
          const parsedTasks = allTasks.map((task: any) => {
            const stepNumber = typeof task.step === "number" ? task.step : Number(task.step);
            const stepInfo = flows.proyectoPregrado[stepNumber];
            return {
              ...task,
              step: stepNumber,
              title: stepInfo?.title || "Sin título",
              description: stepInfo?.description || "Sin descripción",
              date: task.date ? new Date(task.date) : new Date(),
            } satisfies import("@/app/types/entities/task.type").Task;
          });
          setTasks(parsedTasks);
        });
      });
    }
  }, [setRoles, setTasks]);

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
