import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import api from "@/api/axios";
import { toast } from "sonner";
import { Sun, Moon, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clear } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      clear();
      toast.success("Logged out");
      navigate("/auth");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight shrink-0"
        >
          snip.
        </Link>

        {/* Nav links */}
        {user && (
          <nav className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                isActive("/dashboard")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          </nav>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          {/* User email */}
          {user && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
              {user.email}
            </span>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Auth actions */}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-xs font-medium px-3 h-7 flex items-center border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}