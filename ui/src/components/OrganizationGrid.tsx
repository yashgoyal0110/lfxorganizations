import type { JSX } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { OrganizationCard } from "./OrganizationCard"
import type { OrganizationGridProps } from "../types/index"

export function OrganizationGrid({
  organizations,
  isLoading = false,
}: OrganizationGridProps): JSX.Element {
  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="
              relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm
              p-6 shadow-md
            "
          >
            <div className="h-12 w-12 rounded-lg bg-muted mb-4" />
            <div className="h-5 bg-muted/70 rounded mb-2 w-2/3" />
            <div className="h-4 bg-muted/50 rounded mb-3 w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted/60 rounded-full" />
              <div className="h-6 w-20 bg-muted/60 rounded-full" />
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </div>
    )
  }

  // 🧭 Empty State
  if (organizations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 shadow-inner"
      >
        <p className="text-muted-foreground text-lg font-medium">
          No organizations found matching your filters.
        </p>
        <p className="text-muted-foreground/80 text-sm mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </motion.div>
    )
  }

  //  Organization Grid
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {organizations.map((org, index) => (
          <motion.div
            key={org.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 150 }}
          >
            <Link
              to={`/${org.id}/details`}
              className="block group"
              target="_blank"
            >
              <div
                className="
                  transform transition-all duration-300 ease-out rounded-3xl
                  group-hover:-translate-y-1 group-hover:shadow-[0_12px_25px_-10px_rgba(0,0,0,0.25)]
                  group-hover:scale-[1.02]
                "
              >
                 <OrganizationCard organization={org} onClick={()=>null}/>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
