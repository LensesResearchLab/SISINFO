"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { ColumnDef } from "@tanstack/react-table";
import { getProfessors } from "@/app/services/professor.service";
import { assignProfessorToUndergraduateCourse } from "@/app/services/courses.service";
import { API_ROUTES } from "@/app/routes";
import { toast } from "sonner";

type Course = { id: string; code: string; name?: string; mainProfessor?: { user?: { name?: string } } };

function isUndergraduate(code: string) {
  const value = code.toUpperCase().replace(/\s/g, "");
  return value.startsWith("ISIS") && !value.startsWith("ISIS-4") && !value.startsWith("ISIS4");
}

export default function UndergraduateProfessorAssignments() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const coursesQuery = useQuery({ queryKey: ["undergraduate-courses"], queryFn: async () => { const response = await fetch(`${API_ROUTES.BASE}/courses`, { credentials: "include" }); if (!response.ok) throw new Error("No fue posible cargar las materias"); return response.json() as Promise<Course[]>; } });
  const professorsQuery = useQuery({ queryKey: ["all-professors"], queryFn: getProfessors });
  const rows = useMemo(() => (coursesQuery.data ?? []).filter((course) => isUndergraduate(course.code) && `${course.code} ${course.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [coursesQuery.data, search]);
  if (coursesQuery.isLoading || professorsQuery.isLoading) return <SpinnerPage />;
  if (coursesQuery.isError || professorsQuery.isError) return <ErrorPage />;
  const columns: ColumnDef<Course>[] = [
    { accessorKey: "code", header: "Código" },
    { accessorKey: "name", header: "Materia" },
    { id: "professor", header: "Profesor encargado", cell: ({ row }) => row.original.mainProfessor?.user?.name ?? "Sin asignar" },
    { id: "actions", header: "Asignar", cell: ({ row }) => <select className="rounded-md border px-3 py-2" defaultValue="" onChange={async (event) => { if (!event.target.value) return; try { await assignProfessorToUndergraduateCourse(event.target.value, row.original.id); toast.success("Profesor asignado correctamente."); await queryClient.invalidateQueries({ queryKey: ["undergraduate-courses"] }); } catch (error) { toast.error(error instanceof Error ? error.message : "No fue posible asignar el profesor."); } event.target.value = ""; }}><option value="">Seleccionar profesor</option>{(professorsQuery.data ?? []).map((professor) => <option key={professor.id} value={professor.id}>{professor.user?.name}</option>)}</select> },
  ];
  return <div className="min-h-full mx-auto p-4 space-y-8 container"><div className="w-full bg-card shadow-lg rounded-xl p-5 space-y-4"><h2 className="text-2xl font-bold text-core">Asignar profesores por materia de pregrado</h2><input className="w-full rounded-md border px-4 py-3" placeholder="Buscar materia..." value={search} onChange={(event) => setSearch(event.target.value)} /><DataTable columns={columns} data={rows} /></div></div>;
}
