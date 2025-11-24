import { useState } from "react";
import { Github, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

const LoginWithGithub = () => {
  const { user, logout } = useUser(); // assuming you have a logout function in context
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

  const [open, setOpen] = useState(false);

  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user user:email`;
  };

  if (!user) {
    return (
      <button
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#2ea44f] px-4 py-2 text-white font-medium hover:bg-[#2c974b] active:bg-[#298e46] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ea44f]"
      >
        <Github className="w-5 h-5" />
        <span>Login</span>
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Button showing avatar + name */}
      <button className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-sm">
        <img
          src={user.avatar_url}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <span className="font-medium text-gray-800">{user.name}</span>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 p-3 z-20"
          >
            <div className="flex items-center gap-3 border-b pb-3 mb-2">
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-semibold text-gray-800">{user.login}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginWithGithub;
