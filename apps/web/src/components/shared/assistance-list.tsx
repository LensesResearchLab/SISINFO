"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getGraduatedAssistance } from "@/app/services/assistance.service";
import { GraduatedAssistance } from "@/app/types/entities/graduated-assistance.type";
import { getPeriods } from "@/app/services/period.service";
import { ROUTES } from "@/app/routes";
import SpinnerPage from "@/components/shared/spinner-page";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { Search } from "lucide-react";

interface AssistanceListProps {
  readonly professorName?: string;
  readonly role: "estudiante" | "profesor";
}

interface FilterBarProps {
  readonly selectedSemester: string;
  readonly setSelectedSemester: (value: string) => void;
  readonly nameFilter: string;
  readonly setNameFilter: (value: string) => void;
  readonly showOnlyMyAssistance: boolean;
  readonly setShowOnlyMyAssistance: (value: boolean) => void;
  readonly role: "estudiante" | "profesor";
}

const formatDate = (date: Date) => (date ? date.toLocaleDateString() : "-");

function FilterBar({
  selectedSemester,
  setSelectedSemester,
  showOnlyMyAssistance,
  setShowOnlyMyAssistance,
  role,
}: FilterBarProps) {
  const { data: semesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[250px] text-primary">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(semesters) &&
              semesters.map((semester: string) => (
                <SelectItem value={semester} key={semester}>
                  {semester}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {role === "profesor" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!showOnlyMyAssistance}
              onChange={(e) => setShowOnlyMyAssistance(!e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Mostrar todas</span>
          </label>
        )}
      </div>
    </div>
  );
}

export function AssistanceList({
  professorName,
  role = "estudiante",
}: AssistanceListProps) {
  const [data, setData] = useState<GraduatedAssistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [showOnlyMyAssistance, setShowOnlyMyAssistance] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const router = useRouter();

  const handleClick = React.useCallback(
    (id: string) => {
      const path =
        role === "profesor"
          ? `${ROUTES.HOME}/${ROUTES.PROFESSOR_ASSISTANCE_LIST_EDIT}/${id}`
          : `${ROUTES.HOME}/${ROUTES.ASSISTANCE_LIST}/${id}`;
      router.push(path);
    },
    [role, router]
  );

  const columns = useMemo<ColumnDef<GraduatedAssistance>[]>(() => [
    {
      accessorKey: "title",
      header: "Nombre",
    },
    {
      accessorKey: "category",
      header: "Clasificación",
    },
    {
      accessorKey: "professor.user.name",
      header: "Oferente",
      cell: ({ row }) => row.original.professor?.user.name ?? "-",
    },
    {
      accessorKey: "startDate",
      header: "Fecha publicación",
      cell: ({ getValue }) => formatDate(new Date(getValue() as string)),
    },
    {
      accessorKey: "endDate",
      header: "Fecha fin",
      cell: ({ getValue }) => formatDate(new Date(getValue() as string)),
    },
    {
      id: "ver",
      header: "Ver",
      cell: ({ row }) => {
        const isOwn =
          role === "estudiante" ||
          (professorName && row.original.professor?.user.name === professorName);

        return isOwn ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick(row.original.id)}
            className="cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
  ], [handleClick, professorName, role]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getGraduatedAssistance();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedSemester !== "all") {
      result = result.filter((item) => {
        const date = new Date(item.startDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const semester = month <= 6 ? "10" : "20";
        return `${year}${semester}` === selectedSemester;
      });
    }

    if (nameFilter) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (role === "profesor" && showOnlyMyAssistance && professorName) {
      result = result.filter((item) => item.professor?.user.name === professorName);
    }

    return result;
  }, [data, nameFilter, professorName, role, selectedSemester, showOnlyMyAssistance]);

  if (isLoading) return <SpinnerPage />;

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <FilterBar
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          showOnlyMyAssistance={showOnlyMyAssistance}
          setShowOnlyMyAssistance={setShowOnlyMyAssistance}
          role={role}
        />
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
