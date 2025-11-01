import { useEffect, useState } from "react";
import { Sparkles, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StatCard } from "./organization/StatCard";
import { ProjectCard } from "./organization/ProjectCard";
import { ChartSection } from "./organization/ChartSection";
import { YearSelector } from "./organization/YearSelector";
import { OrgHeader } from "./organization/OrgHeader";

interface Project {
  id: string;
  title: string;
  description?: string;
  skills: string[];
  lfxUrl: string;
  upstreamIssue: string;
}

interface YearWiseTerm {
  year: number;
  term: number;
  projects: Project[];
}

interface OrgDetails {
  yearWiseTerms: YearWiseTerm[];
  logoUrl?: string;
  name?: string;
  description?: string;
}

const OrganizationDetailsPage = () => {
  const [orgDetails, setOrgDetails] = useState<OrgDetails>({ yearWiseTerms: [] });
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { orgId } = useParams();

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      getOrgDetails(Number.parseInt(orgId))
        .catch((err) => {
          console.error("Error fetching organization details:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [orgId]);

  const getOrgDetails = async (id: number) => {
    const response = await axios.get<OrgDetails>(`http://localhost:3000/api/v1/${id}/details`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch organization details");
    }
    const data = response.data;
    setOrgDetails(data);
    if (data.yearWiseTerms.length > 0) {
      setActiveYear(data.yearWiseTerms[0].year);
    }
  };

  const years = [...new Set(orgDetails.yearWiseTerms.map((item) => item.year))].sort((a, b) => b - a);

  const chartData = years.map((year) => {
    const yearData: Record<string, number | string> = { year: year.toString() };
    [1, 2, 3].forEach((term) => {
      const termData = orgDetails.yearWiseTerms.find((item) => item.year === year && item.term === term);
      yearData[`Term ${term}`] = termData ? termData.projects.length : 0;
    });
    return yearData;
  }).reverse();

  const totalProjects = orgDetails.yearWiseTerms.reduce((sum, item) => sum + item.projects.length, 0);
  const uniqueTerms = new Set(orgDetails.yearWiseTerms.map((item) => item.term)).size;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-[#0094ff]" size={48} />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Loading organization details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header + Chart Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left - Header */}
          <OrgHeader
            logoUrl={orgDetails.logoUrl}
            name={orgDetails.name}
            description={orgDetails.description}
          />

          {/* Right - Chart */}
          <div className="flex-1">
            <ChartSection chartData={chartData} />
          </div>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Sparkles} label="Total Projects" value={totalProjects} description="Across all terms" />
          <StatCard icon={Calendar} label="Active Years" value={years.length} description="Years of mentorship" />
          <StatCard icon={TrendingUp} label="Terms Offered" value={uniqueTerms} description="Unique terms" />
        </section>

        {/* Projects Section */}
        <section>
          <div className="mb-8 px-2">
            <YearSelector years={years} activeYear={activeYear} onYearChange={setActiveYear} />
          </div>

          {/* Projects by Term */}
          <div className="space-y-12">
            {[1, 2, 3].map((term) => {
              const termData = orgDetails.yearWiseTerms.find(
                (item) => item.year === activeYear && item.term === term
              );

              return termData ? (
                <section
                  key={term}
                  className="bg-gradient-to-br from-white via-[#f8fbff] to-[#eaf5ff] border border-[#0094ff]/10 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_6px_24px_rgba(0,148,255,0.15)]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="px-6 py-2.5 bg-[#0094ff] text-white rounded-xl font-bold shadow-[0_0_15px_rgba(0,148,255,0.3)]">
                        Term {term}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0094ff] animate-pulse" />
                        <p className="text-gray-600 font-medium">
                          {`${termData.projects.length} project${termData.projects.length !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  {termData.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {termData.projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-[#f0f7ff] border-2 border-dashed border-[#0094ff]/30 rounded-2xl">
                      <p className="text-gray-500 text-lg font-medium">
                        No projects available for this term
                      </p>
                    </div>
                  )}
                </section>
              ) : null;
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrganizationDetailsPage;
