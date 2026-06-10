import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Products', path: '/dashboard' },
    { name: 'Add New Product', path: '/dashboard/add-product' },
    { name: 'Manage Categories', path: '/dashboard/categories' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen w-screen bg-white font-sans text-black overflow-hidden relative">
      
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-30">
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-black">Bloowatch Engine</h2>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 border border-black text-xs font-bold uppercase tracking-wider rounded-none focus:outline-none"
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div 
          onClick={toggleMobileMenu}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white p-6 z-50 border-r border-gray-100 flex flex-col justify-between select-none
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-black">Bloowatch</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Admin Panel</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`block px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-200 text-gray-400 hover:text-black hover:border-black py-2 text-xs font-bold uppercase tracking-widest transition-colors"
        >
           Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white pt-24 lg:pt-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}