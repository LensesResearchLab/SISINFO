import { X } from "lucide-react";
import { Badge } from "../ui/badge";

export function CategoryTag({
  tag,
  onClic,
}: {
  tag: string;
  onClic: () => void;
}) {
  return (
    <Badge
      key={tag}
      variant="secondary"
      className="bg-core-soft text-core hover:text-white hover:bg-core px-3 py-1 rounded-full transition-colors"
    >
      {tag}
      <button
        type="button"
        onClick={onClic}
        className="ml-1 hover:text-core-highlight"
      >
        <X size={14} className="inline-block" />
      </button>
    </Badge>
  );
}

export function CategoryTagStatic({ tag }: { tag: string }) {
  return (
    <Badge
      key={tag}
      variant="secondary"
      className="bg-core-soft text-core hover:text-white hover:bg-core px-3 py-1 rounded-full transition-colors"
    >
      {tag}
    </Badge>
  );
}
