import { useState, useMemo, useCallback, useEffect } from "react"
import { BrowserRouter, Routes, Route, useParams, Link } from "react-router-dom"
import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { SearchBar } from "../components/search-bar"
import { OrganizationGrid } from "../components/organization-grid"
import { OrganizationModal } from "../components/organization-modal"
import type { Organization } from "../types/index"
import axios from "axios"
import OrganizationDetailsPage from '../components/OrganizationDetailsPage';
import Loader from "../components/loader"

function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedTerms, setSelectedTerms] = useState<(1 | 2 | 3)[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  async function fetchOrganizations() {
    try {
      console.log("Fetching organizations...")
      const response = await axios.get("http://localhost:3000/api/v1/orgs")
      setOrganizations(
        response.data.sort((a: Organization, b: Organization) => a.name.localeCompare(b.name))
      )
    } catch (err) {
      console.error("Failed to fetch organizations", err)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const filteredOrganizations = useMemo<Organization[]>(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYear = selectedYears.length === 0 || org.years.some((year) => selectedYears.includes(year))

      const matchesTerm = selectedTerms.length === 0 || selectedTerms.includes(org.term)

      return matchesSearch && matchesYear && matchesTerm
    })
  }, [searchQuery, selectedYears, selectedTerms, organizations])

  const handleSelectOrg = useCallback((org: Organization): void => {
    setSelectedOrg(org)
  }, [])

  const handleCloseModal = useCallback((): void => {
    setSelectedOrg(null)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="LFX Organizations" />
      <div className="flex">
        <Sidebar
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
          selectedTerms={selectedTerms}
          setSelectedTerms={setSelectedTerms}
        />
        <main className="flex-1">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">LFX Organizations</h1>
              <p className="text-muted-foreground text-lg">
                Discover and explore organizations participating in LFX programs
              </p>
            </div>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <div className="mt-8">
              <div className="text-sm text-muted-foreground mb-4">
                {filteredOrganizations.length} organization
                {filteredOrganizations.length !== 1 ? "s" : ""} found
              </div>

              {organizations.length > 0 ? (
                <OrganizationGrid organizations={filteredOrganizations} onSelectOrg={handleSelectOrg} />
              ) : (
                <Loader size={128} variant="spinner" />
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedOrg && <OrganizationModal organization={selectedOrg} onClose={handleCloseModal} />}
    </div>
  )
}

/**
 * Organization details route component (the "X" you requested).
 * Loads organization by id and renders simple details.
 */
// function OrganizationDetails() {
//   const { orgId } = useParams<{ orgId: string }>()
//   const [org, setOrg] = useState<Organization | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!orgId) return
//     let cancelled = false

//     async function fetchOrg() {
//       setLoading(true)
//       setError(null)
//       try {
//         const response = await axios.get(`http://localhost:3000/${orgId}/details`)
//         if (!cancelled) {
//           setOrg(response.data)
//         }
//       } catch (err) {
//         console.error(err)
//         if (!cancelled) {
//           setError("Failed to load organization")
//         }
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchOrg()
//     return () => {
//       cancelled = true
//     }
//   }, [orgId])

//   if (loading) {
//     return (
//       <div className="p-6">
//         <Header title="Organization Details" />
//         <div className="p-6">Loading...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <Header title="Organization Details" />
//         <div className="p-6 text-red-500">{error}</div>
//         <div className="p-6">
//           <Link to="/" className="text-blue-500 underline">
//             Back to list
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   if (!org) {
//     return (
//       <div className="p-6">
//         <Header title="Organization Details" />
//         <div className="p-6">Organization not found.</div>
//         <div className="p-6">
//           <Link to="/" className="text-blue-500 underline">
//             Back to list
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Header title={org.name} />
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-2">{org.name}</h2>
//         <p className="text-muted-foreground mb-4">{org.description}</p>

//         <div className="mb-4">
//           <strong>Term:</strong> {org.term}
//         </div>

//         <div className="mb-4">
//           {/* <strong>Years:</strong> {org.years.join(", ")} */}
//         </div>

//         {/* If you want to reuse the OrganizationModal UI, you could render it here instead */}
//         <div className="mt-6">
//           <Link to="/" className="text-blue-500 underline">
//             Back to list
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:orgId/details" element={<OrganizationDetailsPage />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
