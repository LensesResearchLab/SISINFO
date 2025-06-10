"use client";
import * as React from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssistanceApplications } from "@/app/services/assistance.service";
import { getPeriods } from "@/app/services/period.service";
import { useAuth } from "@/hooks/use-auth";
import SpinnerPage from "@/components/shared/spinner-page";
import { ROUTES } from "@/app/routes";
import { StatusInformation } from "@/app/types/entities/graduated-assistance.type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<StatusInformation>[] = [
  {
    id: "title",
    accessorKey: "graduatedAssistance.title",
    header: "Nombre",
  },
  {
    accessorKey: "graduatedAssistance.category",
    header: "Clasificación",
  },
  {
    accessorKey: "graduatedAssistance.professor.user.name",
    header: "Oferente",
  },
  {
    accessorKey: "graduatedAssistance.startDate",
    header: "Fecha de Inscripción",
    cell: ({ getValue }) => {
      const dateStr = getValue() as string;
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    id: "ver",
    header: "Ver",
    cell: ({ row }) => (
      <Link
        href={`${ROUTES.HOME}/${ROUTES.ASSISTANCE_APPLIED_LIST}/${row.original.id}`}
        className="inline-flex items-center justify-center hover:underline"
      >
        <Search className="w-5 h-5 text-core" />
      </Link>
    ),
  },
];

export default function AssistanceAppliedList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<StatusInformation[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: semesters, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["undergraduate-semesters"],
    queryFn: getPeriods,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const result = await getAssistanceApplications(user.id);
        setData(result);
      } catch (error) {
        console.error("Error fetching assistance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) fetchData();
  }, [isAuthLoading, user]);

  const filteredData = useMemo(() => {
    if (!selectedSemester) return data;

    return data.filter((item) => {
      const date = new Date(item.graduatedAssistance.startDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const semester = month <= 6 ? "10" : "20";
      return `${year}${semester}` === selectedSemester;
    });
  }, [selectedSemester, data]);

  if (isLoading || isLoadingSemesters) {
    return <SpinnerPage />;
  }

  return (
    <div className="min-h-full min-w-full p-20">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <Select
            value={selectedSemester}
            onValueChange={setSelectedSemester}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Elige un semestre" />
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
        </div>

        <DataTable columns={columns} data={filteredData} enableRowSelection={false} />
      </div>
    </div>
  );
}
