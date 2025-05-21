"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from '@/components/data-table';
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Button } from "@/components/ui/button";
import { LeaderPerCourse } from "@/app/types/leader-per-course.type";
import { findAllWithMainProfessor } from "@/app/services/courses.service";


export const columns: ColumnDef<LeaderPerCourse>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "courseName",
    header: "Nombre curso",
  },
  {
    accessorKey: "professorName",
    header: "Nombre profesor",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "assign",
    header: "Asignar",
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <Button
          onClick={() => {
            console.log("Acción con:", row.original);
          }}
        >
          Asignar
        </Button>
      );
    },
  },
];


export default function CourseList() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['courses-leaders'],
    queryFn: () => findAllWithMainProfessor(),
  });

  if (isFetching) return <SpinnerPage />;
  if (isError) return <ErrorPage />;


  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container">
      <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-core">
          Profesores lideres por curso
        </h2>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}
