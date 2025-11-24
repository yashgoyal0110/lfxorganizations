import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  userName: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-load session on refresh
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVICE_API_BASE_URL}/me`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(res.data.user.payload);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const logout = () => {
    axios.post(`${import.meta.env.VITE_SERVICE_API_BASE_URL}/logout`, null, {
      withCredentials: true,
    });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!;