// src/App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { TransactionProvider } from "./context/TransactionContext";
import EDAReportsPage from "./pages/EDAReportsPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";
import AlertsPage from "./pages/AlertsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage"; // Add this import
import ThemeToggle from "./components/ThemeToggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");

  const navLinks = [
    { to: "/", label: "Home", private: true },
    { to: "/transaction", label: "New Transaction", private: true },
    { to: "/alerts", label: "Alerts Dashboard", private: true },
    { to: "/admin-analytics", label: "AI Assistant", private: true }, // Add this line
    { to: "/eda", label: "EDA Reports", private: true },
    { to: "/faq", label: "FAQs", private: true },
    { to: "/about", label: "About", private: true },
    { to: "/contact", label: "Contact", private: true },
    { to: "/team", label: "Team", private: true },
    ...(token
      ? [{ to: "/logout", label: "Logout" }]
      : [
          { to: "/login", label: "Login" },
          { to: "/signup", label: "Signup" },
        ]),
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <TransactionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          {/* Navbar */}
          <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  FraudGuard
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6">
                  {navLinks.map((link) =>
                    link.to === "/logout" ? (
                      <button
                        key={link.to}
                        onClick={handleLogout}
                        className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `relative font-medium transition-colors duration-300 
                           ${isActive
                             ? "text-blue-600 dark:text-blue-400"
                             : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"}`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )
                  )}
                </div>

                {/* Right - Theme + Mobile Toggle */}
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
              <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
                {navLinks.map((link) =>
                  link.to === "/logout" ? (
                    <button
                      key={link.to}
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="block w-full text-left py-2 px-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded-lg font-medium transition-colors duration-300
                         ${isActive
                           ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                           : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </div>
            )}
          </nav>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Private routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction"
                element={
                  <PrivateRoute>
                    <TransactionPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <PrivateRoute>
                    <AlertsPage />
                  </PrivateRoute>
                }
              />
              {/* Add Admin Analytics route */}
              <Route
                path="/admin-analytics"
                element={
                  <PrivateRoute>
                    <AdminAnalyticsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/eda"
                element={
                  <PrivateRoute>
                    <EDAReportsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <PrivateRoute>
                    <FAQPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PrivateRoute>
                    <AboutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PrivateRoute>
                    <ContactPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <PrivateRoute>
                    <TeamPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </TransactionProvider>
  );
}

export default App;