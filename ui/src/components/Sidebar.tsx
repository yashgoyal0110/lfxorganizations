import type { JSX } from "react"
import { motion } from "framer-motion"
import type { SidebarProps } from "../types/index"
import { CheckCircle2, Circle, Star } from "lucide-react"
import { GITHUB_LINK, YEARS } from "../utils/constants"

export function Sidebar({
  selectedYears,
  setSelectedYears,
}: SidebarProps): JSX.Element {
  const toggleYear = (year: number): void => {
    setSelectedYears(
      selectedYears.includes(year)
        ? selectedYears.filter((y) => y !== year)
        : [...selectedYears, year]
    )
  }
  return (
    <aside
      className="
        w-72 hidden md:flex flex-col
        sticky top-16 h-[calc(100vh-4rem)]
        backdrop-blur-lg bg-white/10 dark:bg-slate-900/40
        border-r border-white/10 dark:border-slate-800
        shadow-[0_0_25px_rgba(0,0,0,0.15)]
        hover:shadow-[0_0_35px_rgba(0,0,0,0.25)]
        transition-all duration-300
      "
    >
      <div className="p-6 space-y-10 overflow-y-auto flex-1">
        {/* YEARS FILTER */}
        <section>
          <h3 className="text-sm font-semibold tracking-wide text-primary mb-3 uppercase">
            Years
          </h3>
          <div className="flex flex-col gap-2">
            {YEARS.map((year) => {
              const active = selectedYears.includes(year)
              return (
                <motion.button
                  key={year}
                  onClick={() => toggleYear(year)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                    transition-all duration-300
                    ${
                      active
                        ? "bg-primary/20 text-primary font-medium border border-primary/30"
                        : "hover:bg-primary/10 text-muted-foreground border border-transparent"
                    }
                  `}
                >
                  {active ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 opacity-60" />
                  )}
                  <span>{year}</span>
                </motion.button>
              )
            })}
          </div>
        </section>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <motion.a
          href={GITHUB_LINK}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="
            flex items-center justify-center gap-3 px-4 py-3 rounded-xl
            bg-linear-to-r from-primary/20 to-primary/10
            border border-primary/30
            hover:from-primary/30 hover:to-primary/20
            hover:border-primary/50
            transition-all duration-300
            shadow-[0_0_15px_rgba(0,0,0,0.1)]
            hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]
            group
          "
        >
          <Star className="h-5 w-5 text-primary group-hover:fill-primary transition-all duration-300" />
          <span className="text-sm font-semibold text-primary">
            Give us a Star
          </span>
        </motion.a>
      </div>
    </aside>
  )
}
