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
  )
}