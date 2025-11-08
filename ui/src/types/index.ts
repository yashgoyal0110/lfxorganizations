export interface Organization {
  id: number
  name: string
  years: number[]
  logoUrl: string
  totalProjects: number
  description: string
  term: 1 | 2 | 3
}

export interface FilterState {
  years: number[]
  terms: (1 | 2 | 3)[]
  searchQuery: string
}

export interface OrganizationCardProps {
  organization: Organization
  onClick: () => void
}

export interface OrganizationGridProps {
  organizations: Organization[]
  isLoading?: boolean
}

export interface OrganizationModalProps {
  organization: Organization
  onClose: () => void
}

export interface SidebarProps {
  selectedYears: number[]
  setSelectedYears: (years: number[]) => void
  selectedTerms: (1 | 2 | 3)[]
  setSelectedTerms: (terms: (1 | 2 | 3)[]) => void
}

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface HeaderProps {
  title?: string
}

export type Theme = "light" | "dark" | "system"
