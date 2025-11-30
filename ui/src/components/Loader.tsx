import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Theme = "auto" | "light" | "dark";
type Variant = "spinner" | "globe" | "progress";

export interface LoaderProps {
  size?: number; 
  theme?: Theme;
  variant?: Variant;
  message?: string;
  className?: string;
  showText?: boolean;
  compact?: boolean;
}

const defaultProps: Partial<LoaderProps> = {
  size: 96,
  theme: "auto",
  variant: "globe",
  message: "Loading organizations and search index...",
  showText: true,
  compact: false,
};

function useResolvedTheme(theme: Theme) {
  if (theme === "auto") return undefined; // let CSS prefer-color-scheme decide
  return theme === "dark" ? "dark" : "light";
}

// Helper: ring+dot spinner
function Spinner({ size}: { size: number; compact?: boolean }) {
  const reduce = useReducedMotion();
  const ring = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%">
          <stop offset="0%" stopColor="rgb(34 211 238)" />
          <stop offset="100%" stopColor="rgb(99 102 241)" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="url(#g1)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="80 226"
        transform="rotate(-90 50 50)"
      />
      <circle cx="50" cy="14" r="6" fill="white" opacity="0.9" />
    </svg>
  );

  if (reduce) return <div className="inline-block">{ring}</div>;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
      className="inline-block"
      style={{ display: "inline-block" }}
    >
      {ring}
    </motion.div>
  );
}

// Globe variant: subtle world with rotating orbit lines + dot markers
function Globe({ size }: { size: number }) {
  const reduce = useReducedMotion();
  const spin = reduce
    ? undefined
    : { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 14, ease: "linear" } };

  return (
    <motion.div
      {...(spin as any)}
      style={{ width: size, height: size }}
      className="relative"
      aria-hidden
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <radialGradient id="glow" cx="50%" cy="40%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.9)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.05)" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="36" fill="url(#glow)" />

        <g stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" fill="none">
          <ellipse cx="60" cy="60" rx="46" ry="20" transform="rotate(20 60 60)" />
          <ellipse cx="60" cy="60" rx="46" ry="20" transform="rotate(-30 60 60)" />
          <ellipse cx="60" cy="60" rx="36" ry="12" transform="rotate(0 60 60)" />
        </g>

        {/* marker dots representing orgs */}
        <g fill="white">
          <circle cx="60" cy="24" r="2.2" opacity="0.95" />
          <circle cx="92" cy="58" r="2" opacity="0.9" />
          <circle cx="36" cy="82" r="1.9" opacity="0.9" />
        </g>
      </svg>
    </motion.div>
  );
}

// Progress bar variant for heavy-loading tasks
function Progress({ size }: { size: number }) {
  const reduce = useReducedMotion();

  if (reduce)
    return (
      <div className="w-full" style={{ maxWidth: size * 3 }}>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    );

  return (
    <div className="w-full" style={{ maxWidth: size * 3 }}>
      <div className="h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden">
        <motion.div
          className="h-3 rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(34,211,238,1) 0%, rgba(99,102,241,1) 100%)" }}
          initial={{ x: "-30%" }}
          animate={{ x: ["-30%", "30%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

const Loader: React.FC<LoaderProps> = (p) => {
  const props = { ...defaultProps, ...p } as Required<LoaderProps>;
  const resolvedTheme = useResolvedTheme(props.theme);
  const size = Math.max(40, props.size);

  // root classes adjust for theme and density
  const rootClasses = [
    "flex items-center justify-center gap-4",
    props.compact ? "text-sm" : "text-base",
    props.className || "",
  ].join(" ");

  // color-friendly container that adapts in dark mode
  return (
    <div
      className={rootClasses}
      data-theme={resolvedTheme}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center justify-center p-3 rounded-2xl shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm" style={{ minWidth: size }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {props.variant === "spinner" && <Spinner size={size} compact={props.compact} />}
            {props.variant === "globe" && <Globe size={size} />}
            {props.variant === "progress" && <Progress size={size} />}
          </div>

          {props.showText && (
            <div className="flex flex-col">
              <div className="font-medium text-slate-900 dark:text-slate-100">{props.message}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Searching CNCF projects, indexing org metadata and pulling metrics...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loader;
