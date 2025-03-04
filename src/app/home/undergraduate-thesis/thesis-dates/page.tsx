"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUndergraduateThesisDates } from "@/app/home/undergraduate-thesis/services/thesis.service";
import { useEffect, useState } from "react";
import SpinnerPage from "@/components/shared/spinner-page";

interface ThesisDatesInterface {
  title: string;
  date: string;
}
/**
 * ThesisDates Component
 * 
 * This component displays important dates related to undergraduate thesis.
 * It fetches data from thesisService and presents it in organized tables.
 * 
 * Interfaces:
 * ThesisDatesInterface {
 *   title: string - Title or description of the date/event
 *   date: string - Date of the event as string
 * }
 * 
 * Components:
 * - DateTable: Renders an individual table with dates for a specific category
 * - DateTableSkeleton: Displays a loading skeleton while data is being fetched
 * 
 * States:
 * - dates: Object storing arrays of ThesisDates grouped by category
 * - isLoading: Boolean controlling loading state
 */
export default function ThesisDates() {
  const [dates, setDates] = useState<{[dateName: string]: ThesisDatesInterface[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { 
    getUndergraduateThesisDates().then(setDates).finally(() => setIsLoading(false));
  }, []);
  if (isLoading) return <SpinnerPage />;
  return (
    <div className="min-h-full mx-auto p-4 space-y-8 container max-w-[900px]">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        {
          Object.keys(dates).map((dateName) => <DateTable key={dateName} title={dateName} dates={dates[dateName]} />)
        }
      </div>
    </div>
  )
}

/**
 * DateTable Component
 * 
 * This component renders a table displaying thesis-related dates for a specific category.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title/category of the dates being displayed
 * @param {ThesisDates[]} props.dates - Array of dates to display in the table
 * 
 * @returns {JSX.Element} A table with a header showing the category title and rows of dates
 */
function DateTable({title, dates}: {title:string, dates: ThesisDatesInterface[]}) {
  return (
    <div >
      <h2 className="text-xl font-semibold text-sky-800">{title}</h2>
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="bg-sky-900 text-white text-center">Descripción</TableHead>
              <TableHead className="bg-sky-900 text-white text-center">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              dates.map((date) => (
                <TableRow key={date.title}>
                  <TableCell>{date.title}</TableCell>
                  <TableCell>{date.date}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
    </div>
  )
}