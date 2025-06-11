"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { ColumnDef, Row } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  assignProfessorAsCourseLeader,
  findAllWithMainProfessor,
  findProfessorsForCourseInCurrentPeriod,
} from "@/app/services/courses.service";
import { LeaderPerCourse } from "@/app/types/leader-per-course.type";
import { User } from "@/app/types/entities/user.type";

const columns: ColumnDef<LeaderPerCourse>[] = [
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
    cell: ({ row }: { row: Row<LeaderPerCourse> }) => <PopoverPerCourse row={row} />
  },
];

export default function CourseList() {

  const { data, isFetching, isError } = useQuery({
    queryKey: ["courses-leaders"],
    queryFn: () => findAllWithMainProfessor(),
  });

  if (isFetching) return <SpinnerPage />;
  if (isError) return <ErrorPage />;
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container">
      <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 h-full space-y-4">
        <h2 className="text-xl font-bold text-core">
          Profesores líderes por curso
        </h2>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  );
}

function PopoverPerCourse({ row }: { readonly row: Row<LeaderPerCourse> }) {
  const queryClient = useQueryClient();
  return (
    <ProfessorListPopover
      courseId={row.original.courseId}
      onAssigned={(newProfessor) => {
        queryClient.setQueryData<LeaderPerCourse[]>(
          ["courses-leaders"],
          (oldData) =>
            oldData?.map((course) =>
              course.courseId === row.original.courseId
                ? {
                  ...course,
                  professorId: newProfessor.id,
                  professorName: newProfessor.name,
                  email: newProfessor.email,
                }
                : course
            ) ?? []
        );
      }}
    />
  )
}

function ProfessorListPopover({
  courseId,
  onAssigned,
}: {
  readonly courseId: string;
  readonly onAssigned?: (newProfessor: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["professors-by-course", courseId],
    queryFn: () => findProfessorsForCourseInCurrentPeriod(courseId),
    enabled: open,
  });

  const filtered = data?.filter((prof: User) =>
    prof.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleAssign = async (professor: User) => {
    try {
      await assignProfessorAsCourseLeader(professor.id, courseId);
      setOpen(false);
      onAssigned?.(professor);
    } catch (error) {
      console.error("Error al asignar profesor:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">
          Asignar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <input
          type="text"
          placeholder="Buscar profesor..."
          className="w-full border rounded-md p-2 mb-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="max-h-60 overflow-y-auto space-y-1">
          {filtered?.length === 0 ? (
            <li className="text-sm text-muted-foreground px-2">
              No se encontraron profesores.
            </li>
          ) : (
            filtered.map((prof: User) => (
              <li key={prof.id}>
                <button
                  onClick={() => handleAssign(prof)}
                  className="w-full text-left cursor-pointer hover:bg-core-highlight px-2 py-1 rounded-md text-sm"
                >
                  {prof.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}