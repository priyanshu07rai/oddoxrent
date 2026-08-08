import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bell, Menu, X, User, Sun, Moon, Compass, Package, Home } from 'lucide-react';
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
          ? 'h-16 glass shadow-sm' 
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-50 group">
          <div className="w-9 h-9 rounded-2xl bg-accent flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
            R
          </div>
          <span className="font-black text-xl tracking-tight text-text">RentOS</span>
        </Link>

        {/* Desktop Nav Pills (Dead Centered) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-bg-elevated/90 border border-border p-1.5 rounded-2xl shadow-xs absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
          <Link 
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all ${
              location.pathname === '/' 
                ? 'bg-accent text-white shadow-sm' 
                : 'text-text-secondary hover:text-text hover:bg-bg-subtle'
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link 
            to="/explore"
            className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all ${
              location.pathname === '/explore' 
                ? 'bg-accent text-white shadow-sm' 
                : 'text-text-secondary hover:text-text hover:bg-bg-subtle'
            }`}
          >
            <Compass className="w-4 h-4" /> Explore
          </Link>
          
          <Link 
            to="/my-rentals"
            className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all ${
              location.pathname.startsWith('/my-rentals') 
                ? 'bg-accent text-white shadow-sm' 
                : 'text-text-secondary hover:text-text hover:bg-bg-subtle'
            }`}
          >
            <Package className="w-4 h-4" /> My Rentals
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl text-text-secondary hover:text-text hover:bg-bg-subtle border border-border transition-all"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="relative p-2.5 rounded-2xl text-text-secondary hover:text-text hover:bg-bg-subtle border border-border transition-all"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-bg-elevated shadow-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Auth Info */}
          {isAuthenticated ? (
            <>
              <Link 
                to="/account" 
                className="relative p-2.5 rounded-2xl text-text-secondary hover:text-text hover:bg-bg-subtle border border-border transition-all"
                title="Account Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full" />
                )}
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Link to="/account" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-subtle transition-all">
                  <div className="w-8 h-8 rounded-xl bg-accent-subtle text-accent font-bold text-xs flex items-center justify-center border border-accent/20">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-text max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'Account'}</span>
                </Link>

                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="text-xs font-bold text-accent bg-accent-subtle px-2.5 py-1 rounded-lg hover:bg-accent/20 transition-all">
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="text-xs font-semibold text-text-muted hover:text-danger px-2 py-1 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-extrabold text-text-secondary hover:text-text transition-colors px-4 py-2 rounded-xl">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm px-5 py-2.5 rounded-2xl font-bold shadow-md">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3 z-50">
          <button onClick={toggleTheme} className="p-2 rounded-xl text-text-secondary">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <Link to="/cart" className="relative p-2 text-text">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-text p-2">
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
            className="absolute top-full left-0 right-0 bg-bg-elevated border-b border-border shadow-2xl p-4 flex flex-col gap-3 md:hidden z-40"
          >
            <Link to="/" className="text-base font-bold p-3 hover:bg-bg-subtle rounded-xl text-text flex items-center gap-2">
              <Home className="w-5 h-5 text-accent" /> Home Page
            </Link>
            <Link to="/explore" className="text-base font-bold p-3 hover:bg-bg-subtle rounded-xl text-text flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent" /> Explore Products
            </Link>
            <Link to="/my-rentals" className="text-base font-bold p-3 hover:bg-bg-subtle rounded-xl text-text flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" /> My Rentals
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/account" className="text-base font-bold p-3 hover:bg-bg-subtle rounded-xl text-text flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" /> Account Settings
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-base font-bold p-3 hover:bg-bg-subtle rounded-xl text-accent flex items-center gap-2">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="text-base font-bold p-3 text-danger hover:bg-danger-subtle rounded-xl text-left transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to="/login" className="w-full text-center py-3 font-bold text-text bg-bg-subtle rounded-xl">
                  Log in
                </Link>
                <Link to="/register" className="w-full text-center py-3 font-bold text-white bg-accent rounded-xl shadow-md">
                  Sign up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
