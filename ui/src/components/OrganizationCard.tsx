import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { OrganizationCardProps } from "../types/index"
import type { JSX } from "react"
export function OrganizationCard({
  organization,
  onClick,
}: OrganizationCardProps): JSX.Element {

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col h-full w-full rounded-3xl border-2 border-border/60 bg-white dark:bg-slate-900 text-left shadow-lg shadow-black/5 transition-all duration-300 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 overflow-hidden"
      aria-label={`View details for ${organization.name}`}
    >
      {/* Gradient Background Accent */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-primary/8 via-primary/3 to-transparent opacity-0 transition-opacity duration-500"
        layoutId={`bg-${organization.id}`}
      />
      
      {/* Decorative Corner Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full opacity-50 blur-2xl" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Logo Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="relative">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-border/40 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-md group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
              <img
                src={
                  organization.logoUrl ||
                  "/placeholder.svg?height=80&width=80&query=organization"
                }
                alt={`${organization.name} logo`}
                className="object-contain w-full h-full p-2"
                loading="lazy"
              />
            </div>
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>

          <motion.div
            whileHover={{ rotate: -45, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ExternalLink className="h-5 w-5 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all duration-300" />
          </motion.div>
        </div>

        {/* Title Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 mb-2">
            {organization.name}
          </h3>
          
          {/* Category Badge */}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground/90 line-clamp-2 mb-5 leading-relaxed">
          {organization.description || "No description available."}
        </p>

        {/* Divider with gradient */}
        <div className="my-auto mb-5 h-px bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Year Tags Section */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {organization.years.slice(0, 5).map((year) => (
              <motion.span
                key={year}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {year}
              </motion.span>
            ))}
            {organization.years.length > 5 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-border/50">
                +{organization.years.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-primary">
                {organization.totalProjects ?? 0}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                project{organization.totalProjects !== 1 ? "s" : ""}
              </span>
            </div>
            
            <motion.div
              className="flex items-center gap-1 text-xs font-medium text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <span>View details</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl border border-primary/50 blur-sm" />
      </div>
    </motion.button>
  )
}