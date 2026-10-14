"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { assignRole } from "@/app/services/users.service";
import { toast } from "sonner";

type Student = { id: string; code: string; name: string; email: string; role: string; isActive: boolean };
const roleLabels: Record<string, string> = { estudiante: "Estudiante", estudiante_maestria: "Estudiante de maestría" };
const roleColors: Record<string, string> = { estudiante: "bg-green-100 text-green-800 border border-green-800", estudiante_maestria: "bg-purple-100 text-purple-800 border border-purple-800" };
function getColumns(onRoleChanged: (id: string, role: string) => void): ColumnDef<Student>[] {
  return [
    { accessorKey: "code", header: "Código" },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Rol", cell: ({ row }) => <Badge className={`text-sm font-medium px-3 py-1 rounded-md ${roleColors[row.original.role] ?? "bg-gray-100 text-gray-800"}`}>{roleLabels[row.original.role] ?? row.original.role}</Badge> },
    { accessorKey: "isActive", header: "Estado", cell: ({ row }) => row.original.isActive ? "Activo" : "Inactivo" },
    { id: "actions", header: "Acciones", cell: ({ row }) => <StudentRoleSelector student={row.original} onRoleChanged={onRoleChanged} /> },
  ];
}

function StudentRoleSelector({ student, onRoleChanged }: { readonly student: Student; readonly onRoleChanged: (id: string, role: string) => void }) {
  const [role, setRole] = useState(student.role);
  const [loading, setLoading] = useState(false);
  async function changeRole(nextRole: string) {
    if (nextRole === role) return;
    setLoading(true);
    try {
      await assignRole({ userId: student.id, roleType: nextRole, roleInfo: { id: student.id, isActive: true, isUndergraduate: nextRole === "estudiante", code: student.code } });
      setRole(nextRole);
      onRoleChanged(student.id, nextRole);
      toast.success("Rol actualizado correctamente.");
    } catch { toast.error("No fue posible actualizar el rol."); }
    finally { setLoading(false); }
  }
  return <DropdownMenu><DropdownMenuTrigger asChild><Button size="sm" disabled={loading}>Asignar rol</Button></DropdownMenuTrigger><DropdownMenuContent>{Object.entries(roleLabels).map(([value, label]) => <DropdownMenuCheckboxItem key={value} checked={role === value} onCheckedChange={() => void changeRole(value)}>{label}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>;
}

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");
  const columns = getColumns((id, role) => setStudents((current) => current.map((student) => student.id === id ? { ...student, role } : student)));
  async function loadStudents() {
    const response = await fetch("/api/students/list", { cache: "no-store" });
    if (response.ok) setStudents(await response.json());
  }
  useEffect(() => { void loadStudents(); }, []);
  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const rows = (await file.text()).split(/\r?\n/).filter(Boolean).slice(1).map((line) => {
      const [code, name, email, program] = line.split(",").map((value) => value.trim());
      return { code, name, email, program };
    }).filter((row) => row.code && row.name && row.email);
    const response = await fetch("/api/students/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ students: rows }) });
    const result = await response.json();
    setMessage(response.ok ? `${result.length ?? 0} estudiantes importados correctamente.` : (result.message ?? "No fue posible importar el archivo."));
    if (response.ok) await loadStudents();
  }
  return <div className="min-h-full mx-auto p-4 space-y-8 container">
    <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 space-y-4">
      <h1 className="text-xl font-bold text-core">Administrar estudiantes</h1>
      <p className="text-sm text-muted-foreground">Carga un archivo CSV con las columnas: código, nombre, correo y rol.</p>
      <label className="inline-flex cursor-pointer rounded-md bg-core px-4 py-2 font-medium text-white hover:opacity-90"><span>Seleccionar archivo</span><input className="hidden" type="file" accept=".csv,text/csv" onChange={handleFile} /></label>
      {message && <p>{message}</p>}
    </div>
    <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 space-y-4">
      <h2 className="text-xl font-bold text-core">Listado de estudiantes</h2>
      <DataTable columns={columns} data={students} />
    </div>
  </div>;
}
