import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  description: string;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#003778]/10 bg-gradient-to-br from-white via-[#f9fcff] to-[#eaf5ff] backdrop-blur-sm p-6 shadow-sm transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,55,120,0.15)] hover:scale-[1.015]">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-[#0094ff]/10 via-[#003778]/5 to-transparent blur-2xl" />

      {/* Top Section */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#003778]/10 group-hover:bg-[#003778]/20 transition-all duration-300">
            <Icon size={24} className="text-[#003778]" />
          </div>
          <p className="text-sm font-semibold text-[#003778] uppercase tracking-wide">
            {label}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline mb-2">
        <p className="text-4xl md:text-5xl font-bold text-[#003778] tracking-tight group-hover:text-[#0094ff] transition-colors">
          {value}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
        {description}
      </p>

      {/* Accent Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#003778]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};
