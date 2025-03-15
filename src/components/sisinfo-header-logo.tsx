import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

/**
 * SisinfoHeaderLogo Component
 * 
 * This component renders the header logo for the SISINFO sidebar.
 * It includes a link to the homepage, displaying the Uniandes logo and the text "SISINFO".
 * 
 * @returns {JSX.Element} The SISINFO header logo component
 */
export default function SisinfoHeaderLogo() {
  return (
    <SidebarMenu className="bg-accent-highlight py-4">
      <SidebarMenuItem>
        <Link href="/home"> 
          <div className="flex items-center justify-center mx-auto">
            <Image src={"/uniandes_logo.svg"} alt="Uniandes Logo" width={29} height={29} className="mx-3"/>
            <span className="truncate font-semibold text-lg"> | SISINFO </span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}