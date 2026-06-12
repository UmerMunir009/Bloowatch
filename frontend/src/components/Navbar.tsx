import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import logo from '../assets/images/logo.png';
import { ToastType } from '../utils/constants';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logoutState } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutState();
    showToast('Logged out successfully', ToastType.Success);
    setIsOpen(false);
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 md:px-12 py-4 relative z-50 font-sans select-none">
      <div className="max-w-8xl mx-auto flex items-center justify-between">

        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-dark">
          <Link to="/" className="hover:text-brand-blue transition-colors">Shop</Link>
          <Link to="/cart" className="hover:text-brand-blue transition-colors">Cart</Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-xs">
                  {getUserInitials()}
                </div>
                <span className="text-black font-semibold text-xs">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer uppercase tracking-wider border-0 bg-transparent"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/register" className="hover:text-brand-blue transition-colors">Register</Link>
              <Link to="/login" className="hover:text-brand-blue transition-colors">Login</Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-text-dark hover:text-brand-blue transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-200 ease-in-out md:hidden 
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-sm font-medium text-text-dark">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-brand-blue transition-colors py-1">Shop</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)} className="hover:text-brand-blue transition-colors py-1">Cart</Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 flex flex-row gap-3">
              <div className="flex items-center gap-2 py-1">
                <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-xs">
                  {getUserInitials()}
                </div>
                <span className="text-black font-semibold text-sm">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-left font-bold text-rose-600 hover:text-rose-800 transition-colors py-1 cursor-pointer border-0 bg-transparent text-xs tracking-wider uppercase"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/register" onClick={() => setIsOpen(false)} className="hover:text-brand-blue transition-colors py-1">Register</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-brand-blue transition-colors py-1">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}