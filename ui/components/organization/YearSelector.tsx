interface YearSelectorProps {
  years: number[];
  activeYear: number | null;
  onYearChange: (year: number) => void;
}

export const YearSelector = ({ years, activeYear, onYearChange }: YearSelectorProps) => {
  return (
    <div className="flex gap-3 px-8 pt-8 pb-4 overflow-x-auto scrollbar-hide">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap 
            ${
              activeYear === year
                ? "bg-[#003778] text-white shadow-[0_0_15px_rgba(0,55,120,0.5)] scale-[1.05]"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-[#0094ff]/10 hover:text-[#0094ff] hover:border-[#0094ff]/40"
            }`}
        >
          {year}

          {activeYear === year && (
            <span className="absolute inset-0 rounded-xl ring-2 ring-[#003778]/60 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
};