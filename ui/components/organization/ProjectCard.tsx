import { ExternalLink, Github, Award } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    skills: string[];
    lfxUrl: string;
    upstreamIssue: string;
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-[#f9fcff] to-[#eaf5ff] p-6 transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,55,120,0.25)] hover:border-[#003778]/60 hover:scale-[1.02]">
    {/* Subtle hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-[#003778]/10 via-[#003778]/5 to-transparent blur-2xl -z-10" />

    {/* Header */}
    <div className="flex items-start justify-between mb-5">
      <h3 className="text-xl font-bold text-[#003778] leading-snug group-hover:text-[#0094ff] transition-colors flex-1 pr-3 line-clamp-2">
        {project.title}
      </h3>
      <Award
        className="text-[#0094ff] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        size={20}
      />
    </div>

    {/* Skills */}
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {project.skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 text-[#0094ff] bg-[#e6f3ff] rounded-lg text-xs font-medium border border-[#0094ff]/30 hover:bg-[#0094ff]/10 hover:border-[#0094ff]/50 transition-all duration-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 pt-5 border-t border-gray-200">
      <a
        href={project.lfxUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#003778] text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,55,120,0.5)] hover:scale-[1.02]"
      >
        <ExternalLink size={16} />
        <span>View Project</span>
      </a>

      <a
        href={project.upstreamIssue}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-[#0094ff]/10 hover:text-[#0094ff] hover:border-[#0094ff]/40 transition-all duration-300"
        aria-label="View on GitHub"
      >
        <Github size={18} />
      </a>
    </div>

    {/* Subtle bottom glow */}
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#003778] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </article>
);