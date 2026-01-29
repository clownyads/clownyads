import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OfferCard from '@/components/dashboard/OfferCard';
import PlanUpgradePrompt from '@/components/dashboard/PlanUpgradePrompt';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react';

export default function HotOffers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
      } else {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      }
    };
    checkAuth();
  }, []);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: () => base44.entities.Offer.list('-created_date'),
  });

  const hotOffers = offers.filter(offer => {
    const matchesSearch = !searchQuery || offer.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return offer.is_hot && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center">
              <Flame size={24} className="text-[#FF6B6B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Em Alta</h1>
              <p className="text-zinc-500 text-sm">Ofertas que estão bombando agora</p>
            </div>
          </div>

          {/* Plan Upgrade Prompt for FREE users */}
          {user && (!user.plan || user.plan === 'FREE') && (
            <PlanUpgradePrompt />
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#0A0A0C] border border-white/5 rounded-xl p-5">
                  <Skeleton className="w-12 h-12 rounded-xl bg-white/5 mb-4" />
                  <Skeleton className="h-5 w-32 bg-white/5 mb-2" />
                  <Skeleton className="h-4 w-20 bg-white/5" />
                </div>
              ))}
            </div>
          ) : hotOffers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Flame size={32} className="text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma oferta em alta</h3>
              <p className="text-zinc-500 text-sm">Volte mais tarde para ver novidades</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {hotOffers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}