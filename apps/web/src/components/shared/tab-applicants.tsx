"use client";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreVertical, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";
import { ROUTES } from "@/app/routes";
import { GraduatedAssistanceApplication } from "@/app/types/entities/graduated-assistance-application.type";
import { updateAssistanceApplication } from "@/app/services/assistance.service";

interface Section {
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}


interface TabStatusProps {
  readonly general: {
    readonly title: string;
    readonly sections: Section[];
  };
  readonly status: {
    readonly title: string;
    readonly applicants: GraduatedAssistanceApplication[];
  };
  readonly children?: React.ReactNode;
  readonly handleDetails?: (id: string) => void;
}

const path = `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST}`;
const dialogTextAccepted = {
  title: "Confirmar Accion",
  description: "¿Estás seguro de que quieres proceder?",
  buttonText: "Aceptar",
  successTitle: "Exitoso.",
  successText: "Accion realizada correctamente.",
  url: path,
};

export default function TabStatus({
  general,
  status,
  children,
  handleDetails,
}: TabStatusProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2 rounded-t-xl h-16 bg-core color-card">
          {["general", "status"].map((tab, index) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none data-[state=active]:bg-core-highlight data-[state=active]:rounded-t-xl data-[state=active]:text-card text-lg h-12 text-card flex items-center justify-center cursor-pointer"
            >
              {index === 0 ? "Información general" : "Aplicantes"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Card className="max-w-4xl border border-ring shadow-md rounded-b-xl bg-card">
            <CardHeader>
              <h1 className="text-2xl font-medium text-core-highlight">
                {general.title}
              </h1>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {general.sections.map((section) => (
                  <div key={section.title} className="flex gap-3">
                    {section.icon}
                    <div className="w-full">
                      <h1 className="font-medium text-core-highlight">
                        {section.title}
                      </h1>
                      <p className="text-primary break-words">
                        {section.description}
                      </p>
                      <hr className="bg-ring h-[1px] w-full my-2 border-0" />
                    </div>
                  </div>
                ))}
                {children}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <ApplicantsTable applicants={status.applicants} handleDetails={handleDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicantsTable({ applicants, handleDetails }: { readonly applicants: GraduatedAssistanceApplication[], readonly handleDetails?: (id:string) => void }) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "email" | "status" | null;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base" }),
    []
  );

  const resolveValue = (
    applicant: GraduatedAssistanceApplication,
    key: "name" | "email" | "status"
  ) => {
    switch (key) {
      case "email":
        return applicant.student.user.email;
      case "status":
        return applicant.status;
      default:
        return applicant.student.user.name;
    }
  };

  const filteredApplicants = useMemo(
    () =>
      applicants.filter((applicant) =>
        applicant.student.user.name.toLowerCase().includes(searchQuery.toLowerCase())
          ? true
          : applicant.student.user.email
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
      ),
    [applicants, searchQuery]
  );

  const sortedApplicants = useMemo(() => {
    if (!sortConfig.key) {
      return [...filteredApplicants];
    }

    const key = sortConfig.key;
    return [...filteredApplicants].sort((a, b) => {
      const aValue = resolveValue(a, key);
      const bValue = resolveValue(b, key);
      const comparison = collator.compare(aValue, bValue);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [collator, filteredApplicants, sortConfig]);

  const handleConfirmAccepted = async () => {
    if (!selectedApplicantIds) return;
    try {
      // Update multiple applicants status or just one
      await Promise.all(
        selectedApplicantIds.map((id) =>
          updateAssistanceApplication(id, { status: newStatus })
        )
      );
      setIsModalOpen(false);
      }
     catch (error) {
      console.error(error);
    };
  }

  const handleOpenModal = (ids: string[], status: string) => {
    setSelectedApplicantIds(ids);
    setNewStatus(status);
    setIsModalOpen(true);
  };


  const handleSelectAll = (checked: boolean) => {
    setSelectedApplicants(checked ? filteredApplicants.map((a) => a.id) : []);
  };

  const handleSelectApplicant = (id: string, checked: boolean) => {
    setSelectedApplicants(
      checked
        ? [...selectedApplicants, id]
        : selectedApplicants.filter((a) => a !== id)
    );
  };

  const handleSort = (key: "name" | "email" | "status") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const toggleNameSortFromButton = () => {
    setSortConfig((prev) => {
      if (prev.key === "name") {
        return {
          key: "name",
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: "name", direction: "asc" };
    });
  };

  const getAriaSort = (key: "name" | "email" | "status") => {
    if (sortConfig.key !== key) return "none" as const;
    return sortConfig.direction === "asc" ? "ascending" : "descending";
  };

  const renderSortIcon = (key: "name" | "email" | "status") => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <Card className="border-none max-w-4xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar un estudiante"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 bg-core text-card hover:bg-core-highlight"
              onClick={toggleNameSortFromButton}
            >
              <span className="mr-1 text-foreground">A - Z</span>
              <ChevronDown
                className={`h-4 w-4 transform ${
                  sortConfig.key === "name" && sortConfig.direction === "desc"
                    ? "rotate-180"
                    : ""
                }`}
              />
            </Button>
            <Button
              variant="default"
              className="bg-core hover:bg-core-highlight"
              disabled={selectedApplicants.length === 0}
              onClick={() => handleOpenModal(selectedApplicants, "Aceptado")}
            >
              Aceptar seleccionados
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-core">
                <TableRow>
                  <TableHead className="w-12 text-card">
                    <Checkbox
                      onCheckedChange={(checked: boolean) =>
                        handleSelectAll(checked)
                      }
                      className="border-card data-[state=checked]:bg-card data-[state=checked]:text-core"
                    />
                  </TableHead>
                  <TableHead
                    className="text-card cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                    aria-sort={getAriaSort("name")}
                  >
                    <span className="flex items-center gap-2">
                      Nombre
                      {renderSortIcon("name")}
                    </span>
                  </TableHead>
                  <TableHead
                    className="text-card cursor-pointer select-none"
                    onClick={() => handleSort("email")}
                    aria-sort={getAriaSort("email")}
                  >
                    <span className="flex items-center gap-2">
                      Correo
                      {renderSortIcon("email")}
                    </span>
                  </TableHead>
                  <TableHead
                    className="text-card cursor-pointer select-none"
                    onClick={() => handleSort("status")}
                    aria-sort={getAriaSort("status")}
                  >
                    <span className="flex items-center gap-2">
                      Estado
                      {renderSortIcon("status")}
                    </span>
                  </TableHead>
                  <TableHead className="text-card w-12 px-5">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplicants.length > 0 ? (
                  sortedApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedApplicants.includes(applicant.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSelectApplicant(applicant.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{applicant.student.user.name}</TableCell>
                      <TableCell>{applicant.student.user.email}</TableCell>
                      <TableCell>{applicant.status}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDetails?.(applicant?.id)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal([applicant.id], "Aceptado")}>
                              Aceptar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal([applicant.id], "Rechazado")}>
                              Rechazar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <ConfirmationModal
                          dialogText={dialogTextAccepted}
                          onConfirm={handleConfirmAccepted}
                          open={isModalOpen}
                          setIsOpen={setIsModalOpen}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay aplicantes que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
