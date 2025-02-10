import { Table, TableBody, TableCell, TableHeader, TableRow } from "components/ui/table";
import { useEffect, useState } from "react";
import { getUndergraduateThesisDates } from "../services/thesisService";
import { Skeleton } from "components/ui/skeleton";

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

  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8 ">
      <div className="w-full bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
        { !isLoading 
          ? (Object.keys(dates).map((dateName) => <DateTable key={dateName} title={dateName} dates={dates[dateName]} />)) 
          : (Array.from({ length: 4 }).map((_, index) => <DateTableSkeleton key={index} />)
          )
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
          <TableHeader className="bg-sky-800 text-white font-semibold">
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
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

/**
 * DateTableSkeleton Component
 * 
 * This component renders a loading skeleton for the DateTable component.
 * It displays a placeholder layout while the actual date data is being fetched.
 * 
 * The skeleton includes:
 * - A title placeholder using Skeleton component
 * - A table with header cells for "Description" and "Date"
 * - 3 rows of skeleton cells to mimic loading data
 * 
 * @returns {JSX.Element} A skeleton loading state UI for the date table
 */
function DateTableSkeleton() {
  return (
    <div className="my-2">
      <Skeleton className="h-5 w-64 mb-2" />
      <Table>
        <TableHeader className="bg-sky-800 text-white font-semibold">
          <TableRow>
            <TableCell>Descripción</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
