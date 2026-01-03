import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, LogOut, Menu, X, Sun, Moon, ChevronDown, User } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

// TODO: Customize navigation items for your application
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  // Add more navigation items here
  // { name: 'Example', href: '/example', icon: ExampleIcon },
];

/**
 * Application Header Component
 * Features: Glass morphism, dark mode toggle, responsive mobile menu
 */
const Header: React.FC = () => {
  const { user, signOut } = useAuthContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="glass-header fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/logo-horizontal.png" alt="City of Austin" className="h-8 w-auto" />
            <div className="hidden sm:flex flex-col">
              {/* TODO: Update app name */}
              <span className="text-sm font-semibold text-brand-blue leading-tight">COA AI App</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Powered by Azure OpenAI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue/10'
                      : 'text-gray-600 hover:text-brand-dark-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center" ref={userDropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-dark-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-colors duration-150"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="max-w-[150px] truncate">{user?.email?.split('@')[0]}</span>
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                  <button
                    onClick={() => { setIsUserDropdownOpen(false); handleSignOut(); }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-md text-gray-600 hover:text-brand-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all duration-150"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-brand-dark-blue/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center min-h-[44px] px-3 py-2 text-base font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue/10'
                      : 'text-gray-600 hover:text-brand-dark-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            <Link
              to="/settings"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-dark-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-all duration-150"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>

            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-4">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center min-h-[44px] px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-all duration-150"
              >
                {isDarkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div className="px-3 py-2 min-h-[44px] flex items-center text-sm text-gray-600 dark:text-gray-300">
                <User className="w-5 h-5 mr-3" />
                <span className="font-medium truncate">{user?.email}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center min-h-[44px] px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-md transition-all duration-150"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
