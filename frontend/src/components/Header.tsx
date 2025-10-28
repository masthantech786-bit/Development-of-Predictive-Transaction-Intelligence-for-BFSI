import React from "react";
import { Shield, Users } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left section: Logo + Title */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                FraudGuard Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                BFSI Transaction Monitoring System
              </p>
            </div>
          </div>

          {/* Right section: Nav + Team info + Theme toggle */}
          <div className="flex items-center space-x-6">
            {/* Nav Links */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              {[
                { name: "Dashboard", href: "#dashboard" },
                { name: "Reports", href: "#reports" },
                { name: "FAQ", href: "#faq" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="relative text-gray-700 dark:text-gray-300 
                             hover:text-blue-600 dark:hover:text-blue-400 
                             transition-colors duration-300"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Team info */}
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 
                            hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">
              <Users className="h-4 w-4" />
              <span>Team B</span>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
