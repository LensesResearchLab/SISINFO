import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/app/routes";

export default function RingBell({tasks}: { readonly tasks: number }) {
  return (
    <div className="relative">
      <Link href={`${ROUTES.HOME}/${ROUTES.TASK_LIST}`}>

      {tasks > 0 ? (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{
            rotate: [0, 15, -15, 10, -10, 5, -5, 0],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2,
          }}
          className="relative">
            <Bell size={25} className="text-core" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            >
              {tasks}
            </motion.div>
        </motion.div>
        ) : (
        <div className="relative">
          <Bell size={25} className="text-core" />
        </div>
      )}
      </Link>
    </div>
  );
}