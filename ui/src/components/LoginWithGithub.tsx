import { useState } from "react";
import { Github, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

const LoginWithGithub = () => {
  const { user, logout, } = useUser();
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const [open, setOpen] = useState(false);

  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user user:email`;
  };

  const formatLastLogin = (isoDate?: string) => {
    if (!isoDate) return "Unknown";
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <button
        onClick={handleGithubLogin}
        className="flex items-center gap-2 rounded-md bg-[#24292e] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2f363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292e]
        cursor-pointer"
      >
        <Github className="w-4 h-4" />
        <span>Login</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
      >
        <img
          src={user.avatar_url}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-200"
        />
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-xs font-medium text-gray-800">
            {user.name || user.login}
          </span>
          <span className="text-[10px] text-gray-500">@{user.login}</span>
        </div>
        <ChevronDown
          className={`w-3 h-3 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-60 rounded-md border border-gray-200 bg-white shadow-lg z-20 text-sm"
          >
            <div className="p-3 border-b border-gray-100">
              <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
                Signed in as
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-gray-200"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user.name || user.login}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || "No email provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-gray-500">
                <span className="font-medium text-gray-600">Last login:</span>{" "}
                {formatLastLogin(user.lastLoggedAt)}
              </p>
            </div>

            <div className="px-3 pb-3 pt-1">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginWithGithub;
