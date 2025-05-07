import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export default function AlphabeticSortButton({ onclick, sortDirection }: { readonly onclick: () => void, readonly sortDirection: number }) {
  return (
    <Button  className="w-full sm:w-auto" onClick={onclick}>
      <ArrowUpDown className="w-4 h-4 mr-2" />
      {sortDirection === 1 ? "A-Z" : "Z-A"}
    </Button>
  )
}