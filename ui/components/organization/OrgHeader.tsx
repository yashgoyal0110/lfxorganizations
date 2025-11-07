interface OrgHeaderProps {
  logoUrl?: string;
  name?: string;
  description?: string;
}

export const OrgHeader = ({ logoUrl, name, description }: OrgHeaderProps) => {
  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center md:items-start p-8 bg-gradient-to-br from-white via-[#f9fcff] to-[#eaf5ff] border border-[#003778]/10 rounded-2xl shadow-sm hover:shadow-[0_8px_24px_rgba(0,55,120,0.1)] transition-all duration-500">
      {/* Logo */}
      <div className="relative w-28 h-28 mb-6 rounded-2xl bg-white border-2 border-[#0094ff]/30 shadow-[0_0_15px_rgba(0,148,255,0.15)] flex items-center justify-center overflow-hidden group">
        <img
          src={logoUrl || '/placeholder.svg'}
          alt={name}
          className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#0094ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Name */}
      <h1 className="text-3xl font-extrabold text-[#003778] text-center md:text-left leading-tight group-hover:text-[#0094ff] transition-colors duration-300">
        {name}
      </h1>

      {/* Description */}
      <p className="mt-4 text-gray-600 leading-relaxed text-center md:text-left">
        {description}
      </p>

      {/* Decorative bottom line */}
      <div className="mt-6 w-full h-[2px] bg-gradient-to-r from-transparent via-[#003778]/40 to-transparent rounded-full" />
    </aside>
  );
};
