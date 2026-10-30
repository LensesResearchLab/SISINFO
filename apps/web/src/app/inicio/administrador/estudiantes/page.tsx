"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UploadFilePage } from "@/components/shared/upload-files-page";
import { assignRole, deleteUser } from "@/app/services/users.service";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { ROUTES } from "@/app/routes";

type Student = { id: string; code: string; name: string; email: string; role: string; isActive: boolean };
type UploadRow = Record<string, string | number | boolean | null>;
const roleLabels: Record<string, string> = { estudiante: "Estudiante", estudiante_maestria: "Estudiante de maestría" };
const roleColors: Record<string, string> = { estudiante: "bg-green-100 text-green-800 border border-green-800", estudiante_maestria: "bg-purple-100 text-purple-800 border border-purple-800" };

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");
  async function loadStudents() { const response = await fetch("/api/students/list", { cache: "no-store" }); if (response.ok) setStudents(await response.json()); }
  useEffect(() => { void loadStudents(); }, []);
  async function handleUpload(rows: UploadRow[]) {
    const normalized = rows.map((row) => ({ code: String(row.CODIGO ?? row["CÓDIGO"] ?? row.CODE ?? "").trim(), name: String(row.NOMBRE ?? row.NAME ?? "").trim(), email: String(row.CORREO ?? row.EMAIL ?? row["E-MAIL"] ?? "").trim(), role: String(row.ROL ?? row.ROLE ?? row.PROGRAMA ?? "").trim() })).filter((row) => row.code && row.name && row.email);
    const response = await fetch("/api/students/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ students: normalized }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message ?? "No fue posible importar el archivo.");
    setMessage(`${result.length ?? 0} estudiantes importados correctamente.`); await loadStudents();
  }
  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([["Código", "Nombre", "Correo", "Rol"], ["202222259", "Juan Manuel Gordillo Sastoque", "j.gordillos@uniandes.edu.co", "estudiante"]]);
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "plantilla_estudiantes.xlsx"; link.click(); URL.revokeObjectURL(url);
  }
  return <div className="min-h-full mx-auto p-4 space-y-8 container">
    <UploadFilePage title="Administrar estudiantes" period={false} handlePeriodChange={() => undefined} handleDownload={downloadTemplate} handleUploadCsv={handleUpload} typeUpload="students" dialogText={{ title: "Importar estudiantes", description: "¿Estás seguro de que deseas importar estos estudiantes?", buttonText: "Importar", successTitle: "Estudiantes importados", successText: "La información se cargó correctamente.", url: `${ROUTES.HOME}/${ROUTES.ADMINISTRATOR_STUDENTS}` }} />
    {message && <p className="px-5 text-sm text-muted-foreground">{message}</p>}
    <div className="w-full bg-card text-foreground shadow-lg rounded-xl p-5 space-y-4"><h2 className="text-xl font-bold text-core">Listado de estudiantes</h2><DataTable columns={getColumns((id, role) => setStudents((current) => current.map((student) => student.id === id ? { ...student, role } : student)), (id) => setStudents((current) => current.filter((student) => student.id !== id)))} data={students} /></div>
  </div>;
}

function getColumns(onRoleChanged: (id: string, role: string) => void, onDeleted: (id: string) => void): ColumnDef<Student>[] { return [
  { accessorKey: "code", header: "Código" }, { accessorKey: "name", header: "Nombre" }, { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Rol", cell: ({ row }) => <Badge className={`text-sm font-medium px-3 py-1 rounded-md ${roleColors[row.original.role] ?? "bg-gray-100 text-gray-800"}`}>{roleLabels[row.original.role] ?? row.original.role}</Badge> },
  { accessorKey: "isActive", header: "Estado", cell: ({ row }) => row.original.isActive ? "Activo" : "Inactivo" },
  { id: "actions", header: "Acciones", cell: ({ row }) => <div className="flex gap-2"><StudentRoleSelector student={row.original} onRoleChanged={onRoleChanged} /><DeleteStudentButton student={row.original} onDeleted={onDeleted} /></div> },
]; }

function StudentRoleSelector({ student, onRoleChanged }: { readonly student: Student; readonly onRoleChanged: (id: string, role: string) => void }) { const [role, setRole] = useState(student.role); const [loading, setLoading] = useState(false); async function changeRole(nextRole: string) { if (nextRole === role) return; setLoading(true); try { await assignRole({ userId: student.id, roleType: nextRole, roleInfo: { id: student.id, isActive: true, isUndergraduate: nextRole === "estudiante", code: student.code } }); setRole(nextRole); onRoleChanged(student.id, nextRole); toast.success("Rol actualizado correctamente."); } catch { toast.error("No fue posible actualizar el rol."); } finally { setLoading(false); } } return <DropdownMenu><DropdownMenuTrigger asChild><Button size="sm" disabled={loading}>Asignar rol</Button></DropdownMenuTrigger><DropdownMenuContent>{Object.entries(roleLabels).map(([value, label]) => <DropdownMenuCheckboxItem key={value} checked={role === value} onCheckedChange={() => void changeRole(value)}>{label}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>; }

function DeleteStudentButton({ student, onDeleted }: { readonly student: Student; readonly onDeleted: (id: string) => void }) { async function handleDelete() { const typed = window.prompt(`Para eliminar este usuario, escribe exactamente su correo:\n${student.email}`); if (typed?.trim().toLowerCase() !== student.email.toLowerCase()) { if (typed !== null) toast.error("El correo no coincide. No se eliminó el usuario."); return; } if (!window.confirm("¿Confirmas la eliminación de este usuario?")) return; try { await deleteUser(student.id); toast.success("Usuario eliminado correctamente."); onDeleted(student.id); } catch { toast.error("No fue posible eliminar el usuario."); } } return <Button size="sm" variant="destructive" onClick={() => void handleDelete()}>Eliminar</Button>; }
