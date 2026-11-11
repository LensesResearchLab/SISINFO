"use client";

import { useEffect, useState } from "react";
import {
  getBillboard,
} from "@/app/services/billboard.service";
import { ROUTES } from "@/app/routes";
import { UploadFilePage } from "@/components/shared/upload-files-page";
import { AlertDialogError } from "@/components/shared/alert-dialog-error";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { Professor } from "@/app/types/entities/professor.type";
import { getProfessors } from "@/app/services/professor.service";
import { assignRole, deleteUser } from "@/app/services/users.service";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function UploadProfessors() {
  const [profesorsData, setProfesorsData] = useState<Professor[]>([]);
  const [loadError, setLoadError] = useState(false);

  const dialogText = {
    title: "Cargar profesores",
    description: "¿Estás seguro de que deseas cargar estos profesores?",
    buttonText: "Cargar",
    successTitle: "Profesores Cargados",
    successText: "Tus profesores han sido cargados con exito",
    url: `${ROUTES.HOME}/${ROUTES.BULLETIN_BOARD}`,
  };

  // Cargar profesores ya registrados al montar la página
  useEffect(() => {
    getProfessors()
      .then((list) => {
        setProfesorsData(list ?? []);
        setLoadError(false);
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      getProfessors().then((list) => setProfesorsData(list ?? [])).catch(() => undefined);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);


  const handleDownload = () => {
    // Generate an XLSX file dynamically with current professors from the DB.
    // Fallback to the static template if generation fails.
    (async () => {
      try {
        const list = await getProfessors();

        // Build rows: header + data rows
        const rows: Array<Array<string>> = [];
        rows.push(["Nombre", "Correo"]);

        (list ?? []).forEach((prof) => {
          const name = prof?.user?.name ?? "";
          const email = prof?.user?.email ?? "";
          rows.push([name, email]);
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Profesores");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "plantilla_profesores.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        // Fallback to existing static file if anything goes wrong
        const link = document.createElement("a");
        link.href = "/plantillap.xlsm";
        link.download = "plantilla.xlsm";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })();
  };

  const handleUploadXlsm = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = "plantillaSisinfo";
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      setLoadError(true);
    }
  };
  const handlePeriodChange = (value: string) => {
    getBillboard(value)
      .then((data) => {
        setProfesorsData(data.professors);
        setLoadError(false);
      })
      .catch(() => {
        setProfesorsData([]);
        setLoadError(true);
      });
  };

  return (
    <>
      <UploadFilePage
        title="Cargar profesores"
        period={false}
        handlePeriodChange={handlePeriodChange}
        handleDownload={handleDownload}
        handleUploadCsv={(file) => {
          if (file instanceof File) {
            handleUploadXlsm(file);
          }
        }}
        dialogText={dialogText}
        typeUpload="professors"
      >
        <UploadedProfessors profesorsData={profesorsData} loadError={loadError} onDeleted={(id) => setProfesorsData((current) => current.filter((prof) => prof.id !== id))} />
      </UploadFilePage >

      <AlertDialogError open={loadError} onOpenChange={setLoadError} />
    </>
  );
}

const roleOptions = ["profesor", "coordinador", "administrador"];

function getColumns(onDeleted: (id: string) => void): ColumnDef<Professor>[] { return [
  {
    id: "name",
    accessorFn: (row) => row.user?.name ?? "",
    header: "Nombre",
  },
  {
    id: "email",
    accessorFn: (row) => row.user?.email ?? "",
    header: "Correo",
  },
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) => <ProfessorRoleSelector professor={row.original} />,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <DeleteProfessorButton professor={row.original} onDeleted={onDeleted} />,
  },
]; }

function UploadedProfessors({
  profesorsData,
  loadError,
  onDeleted,
}: {
  readonly profesorsData: Professor[];
  readonly loadError: boolean;
  readonly onDeleted: (id: string) => void;
}) {
  if (loadError) return <BillboardNotFound />;
  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-core text-center">
          Cargar profesores
        </h2>
        <DataTable
          columns={getColumns(onDeleted)}
          data={profesorsData}
        />
      </div>
    </div>
  );
}

function ProfessorRoleSelector({ professor }: { readonly professor: Professor }) {
  const [roles, setRoles] = useState<string[]>(["profesor"]);
  const [loading, setLoading] = useState(false);
  async function toggle(role: string) {
    const adding = !roles.includes(role);
    setLoading(true);
    try {
      await assignRole({ userId: professor.id, roleType: role, roleInfo: { id: professor.id, isActive: adding } });
      setRoles((current) => adding ? [...current, role] : current.filter((item) => item !== role));
      toast.success("Roles actualizados correctamente.");
    } catch { toast.error("No fue posible actualizar los roles."); }
    finally { setLoading(false); }
  }
  return <DropdownMenu><DropdownMenuTrigger asChild><Button size="sm" disabled={loading}>Asignar roles</Button></DropdownMenuTrigger><DropdownMenuContent>{roleOptions.map((role) => <DropdownMenuCheckboxItem key={role} checked={roles.includes(role)} onCheckedChange={() => void toggle(role)}>{role.charAt(0).toUpperCase() + role.slice(1)}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>;
}

function DeleteProfessorButton({ professor, onDeleted }: { readonly professor: Professor; readonly onDeleted: (id: string) => void }) {
  async function handleDelete() {
    const email = professor.user?.email ?? "";
    const typed = window.prompt(`Para eliminar este usuario, escribe exactamente su correo:\n${email}`);
    if (typed?.trim().toLowerCase() !== email.toLowerCase()) {
      if (typed !== null) toast.error("El correo no coincide. No se eliminó el usuario.");
      return;
    }
    if (!window.confirm("¿Confirmas la eliminación de este usuario?")) return;
    try {
      await deleteUser(professor.id);
      toast.success("Usuario eliminado correctamente.");
      onDeleted(professor.id);
    } catch (error) { toast.error(error instanceof Error ? error.message : "No fue posible eliminar el usuario."); }
  }
  return <Button size="sm" variant="destructive" onClick={() => void handleDelete()}>Eliminar</Button>;
}

function BillboardNotFound() {
  return (
    <div className="min-h-full min-w-full">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-core text-center">
          Error al cargar los profesores
        </h2>
        <p className="text-core text-center">
          No se pudo cargar la información. Por favor, intenta nuevamente.
        </p>
      </div>
    </div>
  );
}
