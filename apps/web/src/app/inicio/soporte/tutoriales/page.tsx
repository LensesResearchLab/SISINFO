"use client";

import { useEffect, useState, useRef } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { FileVideo } from "lucide-react";
import RoleTab from "@/components/shared/role-tab";
import { fetchUserRoles } from "@/app/auth/auth-service";
import { useTutorialStore } from "./tutorial.store";
import { Tutorial } from "@/app/types/tutorial.types";
import { coordinatorVideos } from "./coordinator";
import { postgraduateVideos } from "./postgraduate";
import { undergraduateVideos } from "./undergraduate";
import { professorVideos } from "./professor";
import { InformationCard } from "../../components/information-section";
import SpinnerPage from "@/components/shared/spinner-page";

const roleMap: Record<string, React.ReactNode> = {
  estudiante: <UndergraduateTutorials key="estudiante" />,
  estudiante_maestria: <PostgraduateTutorials key="estudiante_maestria" />,
  profesor: <ProfessorTutorials key="profesor" />,
  coordinador: <CoordinatorTutorials key="coordinador" />,
};

export default function Tutorials() {
  const roles = useTutorialStore((state) => state.roles);
  const setRoles = useTutorialStore((state) => state.setRoles);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchUserRoles(setRoles, setLoading, fetchedRef);
    }
  }, [setRoles]);
  if (loading) return <SpinnerPage />;
  if (roles.length === 0) return null;
  if (roles.length === 1) return <>{roleMap[roles[0]]}</>;

  return (
    <RoleTab>
      {roles.map((role) => (
        <TabsContent key={role} value={role}>
          {roleMap[role]}
        </TabsContent>
      ))}
    </RoleTab>
  );
}

function CoordinatorTutorials() {
  return <TutorialsGrid tutorials={coordinatorVideos} />;
}

function ProfessorTutorials() {
  return <TutorialsGrid tutorials={professorVideos} />;
}

function PostgraduateTutorials() {
  return <TutorialsGrid tutorials={postgraduateVideos} />;
}

function UndergraduateTutorials() {
  return <TutorialsGrid tutorials={undergraduateVideos} />;
}

function TutorialsGrid({ tutorials }: { tutorials: Tutorial[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {tutorials.map((tutorial, index) => (
        <InformationCard
          key={index}
          Icon={FileVideo}
          title={tutorial.title}
          description={tutorial.description}
          url={tutorial.link}
          opensWindow={true}
        />
      ))}
    </div>
  );
}