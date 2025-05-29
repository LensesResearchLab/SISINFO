import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
/**
 * select Component
 * 
 * This component renders the list passed as prop as options in select section of the application.
 * 
 * @returns {JSX.Element} The select component
 */

interface SelectListProps {
    list: string[];
    placeholder: string;
}

const SelectList: React.FC<SelectListProps> = ({ list, placeholder }) => {
    return (
        <Select>
            <SelectTrigger className="w-full text-lg p-3">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {list.map((item) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectList