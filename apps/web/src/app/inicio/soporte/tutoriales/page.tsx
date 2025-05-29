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
/**
 * @module Tutorials
 * @description
 * Renders a dynamic view of tutorial videos based on the authenticated user's roles.
 * If the user has only one role, it renders tutorials for that role directly.
 * If the user has multiple roles, it displays a tabbed interface for switching between them.
 *
 * @returns {JSX.Element | null} The appropriate tutorials section based on user roles or null if no roles.
 *
 * @remarks
 * Uses Zustand (`useTutorialStore`) to manage role state.
 * Role-specific videos are imported and rendered via the `TutorialsGrid` component.
 *
 * @see {@link fetchUserRoles} Function that retrieves user roles from auth service.
 */

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
/**
 * @function CoordinatorTutorials
 * @description Wrapper to display tutorials for coordinators.
 * @returns {JSX.Element}
 */
function CoordinatorTutorials() {
  return <TutorialsGrid tutorials={coordinatorVideos} />;
}
/**
 * @function ProfessorTutorials
 * @description Wrapper to display tutorials for professors.
 * @returns {JSX.Element}
 */
function ProfessorTutorials() {
  return <TutorialsGrid tutorials={professorVideos} />;
}
/**
 * @function PostgraduateTutorials
 * @description Wrapper to display tutorials for postgraduate students.
 * @returns {JSX.Element}
 */
function PostgraduateTutorials() {
  return <TutorialsGrid tutorials={postgraduateVideos} />;
}
/**
 * @function UndergraduateTutorials
 * @description Wrapper to display tutorials for undergraduate students.
 * @returns {JSX.Element}
 */

function UndergraduateTutorials() {
  return <TutorialsGrid tutorials={undergraduateVideos} />;
}

/**
 * @function TutorialsGrid
 * @description
 * Displays a responsive grid of tutorial cards based on the provided list.
 *
 * @param {Object} props
 * @param {Tutorial[]} props.tutorials - Array of tutorials to be displayed.
 *
 * @returns {JSX.Element} A grid layout of tutorial video cards.
 */


function TutorialsGrid({ tutorials }: { readonly tutorials: Tutorial[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {tutorials.map((tutorial) => (
        <InformationCard
          key={tutorial.id}
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