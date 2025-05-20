/**
 * @module ProjectDetail
 * @description
 * Displays detailed information for a specific undergraduate project selected by the student.
 *
 * @returns {JSX.Element} The rendered detail view of the undergraduate project.
 *
 * @remarks
 * This component fetches project data using the project ID passed via route params.
 * It shows a spinner while loading and a fallback card if the project is not found or an error occurs.
 *
 * @see {@link getUndergraduateProjectById} for the API call to fetch project data
 * @see {@link ProjectDetailCard} for UI presentation
 * @see {@link ProjectNotFound} for fallback UI
 */

"use client";

import { getUndergraduateProjectById } from "@/app/services/project.service";
import SpinnerPage from "@/components/shared/spinner-page";
import { ProjectDetailCard, ProjectNotFound } from "@/components/shared/project-detail-card";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function ProjectDetail({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: project,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-project-application", id],
    queryFn: () => getUndergraduateProjectById(id),
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !project) return <ProjectNotFound />;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <ProjectDetailCard project={project} />
    </div>
  );
}
