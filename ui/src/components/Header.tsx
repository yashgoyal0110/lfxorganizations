import type { JSX } from "react"
import type { HeaderProps } from "../types/index"
import LoginWithGithub from "./LoginWithGithub"

export function Header({ title = "LFX Organizations" }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-linear-to-r from-background via-background to-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-cyan-500/5 to-purple-500/5 animate-pulse opacity-50" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-4">
        {/* Flex container for left and right sections */}
        <div className="flex items-center justify-between gap-4">
          {/* Left section - Logo and Title */}
          <div className="flex items-center gap-3 sm:gap-4 group">
            {/* Animated logo */}
            <div className="relative">
              <img
                src="platform-logo.png"
                alt="LFX Logo"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg shadow-blue-500/25 "
              />
            </div>

            {/* Title with gradient */}
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Open Source Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right section - Login with GitHub */}
          <LoginWithGithub />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
    </header>
  )
}
