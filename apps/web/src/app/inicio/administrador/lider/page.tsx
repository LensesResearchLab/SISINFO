"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Professor } from "@/app/types/entities/professor.type";
import { useState } from "react";
import {
  assignProfessorAsCourseLeader,
  findProfessorsForCourseInCurrentPeriod,
} from "@/app/services/professor.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findAllWithMainProfessor } from "@/app/services/courses.service";
import { LeaderPerCourse } from "@/app/types/leader-per-course.type";

export default function CourseList() {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["courses-leaders"],
    queryFn: () => findAllWithMainProfessor(),
  });

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
      cell: ({ row }) => (
        <ProfessorListPopover
          courseId={row.original.courseId}
          onAssigned={() => {
            refetch();
          }}
        />
      ),
    },
  ];

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

function ProfessorListPopover({
  courseId,
  onAssigned,
}: {
  readonly courseId: string;
  readonly onAssigned?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["professors-by-course", courseId],
    queryFn: () => findProfessorsForCourseInCurrentPeriod(courseId),
    enabled: open,
  });

  const [selected, setSelected] = useState<Professor | null>(null);

  const handleAssign = async (professor: Professor) => {
    try {
      await assignProfessorAsCourseLeader(professor.id, courseId);
      setSelected(professor);
      setOpen(false);
      onAssigned?.();
    } catch (error) {
      console.error("Error al asignar profesor:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">
          {selected ? selected.user.name : "Asignar"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar profesor..." />
          <CommandList>
            <CommandEmpty>No se encontraron profesores.</CommandEmpty>
            {data?.map((prof: Professor) => (
              <CommandItem
                key={prof.id}
                onSelect={() => handleAssign(prof)}
              >
                {prof.user.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
