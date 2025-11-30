import { useState, useMemo, useEffect } from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { SearchBar } from "./components/SearchBar"
import { OrganizationGrid } from "./components/OrganizationGrid"
import type { Organization } from "./types/index"
import axios from "axios"
import OrganizationDetailsPage from './components/OrganizationDetailsPage';
import Loader from "./components/Loader"
import { SERVICE_API_BASE_URL } from "../env"
import FlashCardPopup from "./components/FlashCardPopup"
import { useUser } from "./context/UserContext"

function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedTerms, setSelectedTerms] = useState<(1 | 2 | 3)[]>([])
  const [todayFlashcard, setTodayFlashcard] = useState<any>(null);
  const {loading} = useUser();

 useEffect(() => {
  const fetchData = async () => {
    try {
      const orgPromise = axios.get(`${SERVICE_API_BASE_URL}/orgs`);
      const flashCardPromise = axios.get(`${SERVICE_API_BASE_URL}/flashcards/today`, { 
        withCredentials: true 
      });

      const orgResponse = await orgPromise;
      setOrganizations(
        orgResponse.data.sort((a: Organization, b: Organization) => 
          a.name.localeCompare(b.name)
        )
      );

      flashCardPromise
        .then((flashRes) => setTodayFlashcard(flashRes.data))
        .catch(() => setTodayFlashcard(null));

    } catch (err: any) {
      console.error("Failed to fetch organizations", err.message);
    }
  };

  fetchData();
}, []);


  const filteredOrganizations = useMemo<Organization[]>(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYear = selectedYears.length === 0 || org.years.some((year) => selectedYears.includes(year))

      const matchesTerm = selectedTerms.length === 0 || selectedTerms.includes(org.term)

      return matchesSearch && matchesYear && matchesTerm
    })
  }, [searchQuery, selectedYears, selectedTerms, organizations])

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

              {loading ? <Loader size={128} variant="spinner" /> : organizations.length > 0 ? (
                <OrganizationGrid organizations={filteredOrganizations} />
              ) : (
                <Loader size={128} variant="spinner" />
              )}
            </div>
          </div>
        </main>
      </div>
      {
        todayFlashcard && <FlashCardPopup flashcard={todayFlashcard} />
      }
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:orgId/details" element={<OrganizationDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
