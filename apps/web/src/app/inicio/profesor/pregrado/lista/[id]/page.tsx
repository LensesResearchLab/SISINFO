"use client";
import { getUndergraduateThesisById } from "@/app/services/project.service";
import SpinnerPage from "@/components/shared/spinner-page";
import { ThesisDetailCard, ThesisNotFound } from "@/components/shared/thesis-detail-card";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function ProjectDetail({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: thesis,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-thesis-application", id],
    queryFn: () => getUndergraduateThesisById(id),
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !thesis) return <ThesisNotFound />;

  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <ThesisDetailCard thesis={thesis} />
    </div>
  )
}