import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  year: string | number;
  "Term 1": number;
  "Term 2": number;
  "Term 3": number;
}

interface ChartSectionProps {
  chartData: ChartDataPoint[];
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#003778]/20 rounded-xl p-3 shadow-[0_4px_16px_rgba(0,55,120,0.1)]">
        <p className="font-semibold text-[#003778] mb-1">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartSection = ({ chartData }: ChartSectionProps) => {
  return (
    <section className="bg-gradient-to-br from-white via-[#f9fcff] to-[#eaf5ff] border border-[#003778]/10 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,55,120,0.08)] hover:shadow-[0_8px_30px_rgba(0,55,120,0.15)] transition-all duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#003778]/10 rounded-xl">
          <BarChart3 size={22} className="text-[#003778]" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#003778]">
            Projects Distribution
          </h2>
          <p className="text-gray-600 text-sm mt-0.5">
            Year-wise project allocation across terms
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <defs>
              {/* Brighter colors for better distinction */}
              <linearGradient id="colorTerm1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF7B54" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#FFB26B" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="colorTerm2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C49F" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#82E0AA" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="colorTerm3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0088FE" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#66B2FF" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,55,120,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#7a7a7a"
              tick={{ fill: "#1f2937", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              stroke="#7a7a7a"
              tick={{ fill: "#1f2937", fontSize: 13, fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#0037780d" }} />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-[#003778] font-semibold text-sm">{value}</span>
              )}
            />
            <Bar
              dataKey="Term 1"
              fill="url(#colorTerm1)"
              radius={[10, 10, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="Term 2"
              fill="url(#colorTerm2)"
              radius={[10, 10, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="Term 3"
              fill="url(#colorTerm3)"
              radius={[10, 10, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
