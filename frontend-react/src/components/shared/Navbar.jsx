import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bell, Menu, X, User, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useNotifications from '../../hooks/useNotifications';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'h-14 glass shadow-sm' 
          : 'h-16 bg-transparent'
      }`}
    >
      <div className="container-app h-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 z-50 group">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            R
          </div>
          <span className="font-extrabold text-lg tracking-tight text-text">RentOS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/explore"
            className={`text-sm font-semibold transition-colors ${location.pathname === '/explore' ? 'text-accent' : 'text-text-secondary hover:text-text'}`}
          >
            Explore
          </Link>
          {isAuthenticated && (
            <Link 
              to="/my-rentals"
              className={`text-sm font-semibold transition-colors ${location.pathname.startsWith('/my-rentals') ? 'text-accent' : 'text-text-secondary hover:text-text'}`}
            >
              My Rentals
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-bg-subtle transition-all"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <button className="relative p-2 rounded-xl text-text-secondary hover:text-text hover:bg-bg-subtle transition-all">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                )}
              </button>
              
              <Link to="/cart" className="relative p-2 rounded-xl text-text-secondary hover:text-text hover:bg-bg-subtle transition-all">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-accent/30 transition-all ml-1">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user?.first_name?.charAt(0) || user?.email?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                </button>

                {/* Refined High-Contrast Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-bg-elevated border border-border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="px-4 py-2.5 border-b border-border-subtle mb-1">
                    <p className="text-sm font-bold truncate text-text">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-accent font-bold hover:bg-bg-subtle transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/account" className="block px-4 py-2 text-sm font-semibold text-text hover:text-accent hover:bg-bg-subtle transition-colors">
                    Account Settings
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-text transition-colors px-3 py-2 rounded-lg">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 rounded-xl font-bold shadow-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3 z-50">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          {isAuthenticated && (
            <Link to="/cart" className="relative text-text p-1">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text p-1 -mr-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-elevated border-b border-border shadow-xl p-4 flex flex-col gap-3 md:hidden z-40"
          >
            <Link to="/explore" className="text-base font-semibold p-2 hover:bg-bg-subtle rounded-lg text-text">Explore</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-rentals" className="text-base font-semibold p-2 hover:bg-bg-subtle rounded-lg text-text">My Rentals</Link>
                {isAdmin && <Link to="/admin" className="text-base font-semibold text-accent p-2 hover:bg-bg-subtle rounded-lg">Admin Dashboard</Link>}
                <Link to="/account" className="text-base font-semibold p-2 hover:bg-bg-subtle rounded-lg text-text">Account Settings</Link>
                <button onClick={logout} className="text-base font-semibold text-danger text-left p-2 hover:bg-danger/10 rounded-lg">Sign Out</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-border-subtle">
                <Link to="/login" className="btn-secondary py-2.5 text-center rounded-lg font-semibold">Log in</Link>
                <Link to="/register" className="btn-primary py-2.5 text-center rounded-lg font-semibold">Sign up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
