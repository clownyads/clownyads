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
  X,
  Shield,
  ShieldCheck } from
'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

const navItems = [
{ icon: Flame, label: 'Ofertas do Dia', page: 'OfertasDoDia' },
{ icon: User, label: 'Comunidade', page: 'Comunidade' },
{ icon: Shield, label: 'Clowncker PLUS', page: 'ClownckerPlus' },
{ icon: ShieldCheck, label: 'Clownador PRO', page: 'ClownadorPRO' },
{ icon: Settings, label: 'Admin', page: 'Admin', adminOnly: true },
{ icon: User, label: 'Perfil', page: 'Profile' }];

const categoryItems = [
  { label: '🔥 Tendências', page: 'CategoryTendencias' },
  { label: '💸 Low Ticket', page: 'CategoryLowTicket' },
  { label: '📈 Renda Extra', page: 'CategoryRendaExtra' },
  { label: '❤️ Saúde & Bem-estar', page: 'CategorySaudeBemEstar' },
  { label: '🏃 Emagrecimento', page: 'CategoryEmagrecimento' },
  { label: '🏋️ Fitness & Exercícios', page: 'CategoryFitnessExercicios' },
  { label: '💕 Relacionamento', page: 'CategoryRelacionamento' },
  { label: '🌶️ Sexualidade', page: 'CategorySexualidade' },
  { label: '👨‍👩‍👧 Família & Maternidade', page: 'CategoryFamiliaMaternidade' },
  { label: '📚 Educação & Idiomas', page: 'CategoryEducacaoIdiomas' },
  { label: '🧠 Desenvolv. Pessoal', page: 'CategoryDesenvolvPessoal' },
  { label: '🙏 Espiritualidade', page: 'CategoryEspiritualidade' },
  { label: '💄 Moda & Beleza', page: 'CategoryModaBeleza' },
  { label: '💎 Estilo de Vida', page: 'CategoryEstiloVida' },
  { label: '🐾 Pets', page: 'CategoryPets' }
];


export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [ofertasOpen, setOfertasOpen] = React.useState(false);

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
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose} />

      }

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-[#0A0A0C] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-default">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/9f53f90ae_ClownyAds3.png"
                alt="ClownyAds"
                className="h-10 w-auto" />

              <span className="font-black text-lg tracking-tight">
                <span className="text-white font-medium">Clowny</span><span className="text-[#39FF14] font-black">Ads</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-zinc-400 hover:text-white">

              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                // Hide admin-only items for non-admin users
                if (item.adminOnly && user?.email !== 'pedrinhojpkl@gmail.com') {
                  return null;
                }
                return (
                  <li key={item.page}>
                    <Link
                      to={createPageUrl(item.page)}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive(item.page) ?
                        "bg-[#39FF14]/10 text-[#39FF14]" :
                        "text-zinc-400 hover:text-white hover:bg-white/5"
                      )}>

                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  </li>);

              })}

              {/* Ofertas com submenu */}
              <li 
                onMouseEnter={() => setOfertasOpen(true)}
                onMouseLeave={() => setOfertasOpen(false)}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-default">
                  <Package size={20} />
                  Ofertas
                </div>

                {ofertasOpen && (
                  <ul className="mt-1 ml-4 space-y-1 border-l-2 border-white/5 pl-3">
                    {categoryItems.map((item) => (
                      <li key={item.page}>
                        <Link
                          to={createPageUrl(item.page)}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                            isActive(item.page) ?
                            "bg-[#39FF14]/10 text-[#39FF14]" :
                            "text-zinc-400 hover:text-white hover:bg-white/5"
                          )}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/5">
            <button 
              onClick={() => base44.auth.logout(createPageUrl('Home'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>);

}