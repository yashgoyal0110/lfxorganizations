import { motion } from "framer-motion"
import { Search, XCircle } from "lucide-react"
import type { JSX } from "react"
import type { SearchBarProps } from "../types/index"

export function SearchBar({
  value,
  onChange,
  placeholder = "Search organizations...",
}: SearchBarProps): JSX.Element {
  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
    >
      {/* Outer Glow / Glass Effect */}
      <div
        className="
          relative flex items-center
          backdrop-blur-md bg-white/10 dark:bg-slate-900/40
          border border-white/20 dark:border-slate-700
          rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)]
          hover:shadow-[0_0_35px_rgba(0,0,0,0.25)]
          transition-all duration-300 ease-out
        "
      >
        {/* Search Icon */}
        <Search className="absolute left-4 h-5 w-5 text-primary/70 pointer-events-none" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full h-12 pl-12 pr-10
            bg-transparent text-foreground
            placeholder:text-muted-foreground/70
            focus:outline-none focus:ring-2 focus:ring-primary/50
            rounded-2xl transition-all duration-300
          "
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 text-muted-foreground/70 hover:text-primary transition"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
