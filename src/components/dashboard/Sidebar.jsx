import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Package, 
  Flame, 
  AlertTriangle, 
  Heart, 
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'Dashboard' },
  { icon: Package, label: 'Ofertas', page: 'Offers' },
  { icon: Flame, label: 'Em Alta', page: 'HotOffers' },
  { icon: AlertTriangle, label: 'Alertas', page: 'Alerts' },
  { icon: Heart, label: 'Favoritos', page: 'Favorites' },
  { icon: Settings, label: 'Admin', page: 'Admin', adminOnly: true },
  { icon: User, label: 'Perfil', page: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    loadUser();
  }, []);
  
  const isActive = (page) => {
    const pageUrl = createPageUrl(page);
    return location.pathname === pageUrl || location.pathname === pageUrl + '/';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-[#0A0A0C] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/9f53f90ae_ClownyAds3.png"
                alt="ClownyAds" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-white text-lg tracking-tight">
                Clowny<span className="text-[#39FF14]">Ads</span>
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                // Hide admin-only items for non-admin users
                if (item.adminOnly && user?.role !== 'admin') {
                  return null;
                }
                return (
                  <li key={item.page}>
                    <Link
                      to={createPageUrl(item.page)}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive(item.page)
                          ? "bg-[#39FF14]/10 text-[#39FF14]"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/5">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full">
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}