import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OfferCard from '@/components/dashboard/OfferCard';
import { Skeleton } from '@/components/ui/skeleton';
import PlanUpgradePrompt from '@/components/dashboard/PlanUpgradePrompt';

export default function OfertasDoDia() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      
      try {
        const currentUser = await base44.auth.me();
        
        // Verificar se o plano expirou
        if (currentUser.plan_expires_at) {
          const expiresAt = new Date(currentUser.plan_expires_at);
          const now = new Date();
          
          if (expiresAt < now && currentUser.plan !== 'FREE') {
            // Plano expirado - definir como FREE localmente para exibir o prompt
            currentUser.plan = 'FREE';
          }
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Buscar ofertas sempre que o usuário estiver carregado
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: () => base44.entities.Offer.list('-created_date'),
    enabled: !loading && !!user
  });

  // Filtrar ofertas dos últimos 2 dias (48 horas)
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  const recentOffers = offers.filter(offer => {
    const offerDate = new Date(offer.created_date);
    return offerDate >= twoDaysAgo;
  });

  const filteredOffers = recentOffers.filter(offer =>
    offer.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Ofertas do Dia</h1>
              <p className="text-zinc-500 text-sm">Ofertas adicionadas nas últimas 48 horas</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-zinc-400">Carregando...</p>
            </div>
          ) : (!user || !user.plan || user.plan === 'FREE') ? (
            <PlanUpgradePrompt />
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] bg-white/5" />
              ))}
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Nenhuma oferta recente encontrada
              </h3>
              <p className="text-zinc-500">
                Não há ofertas adicionadas nas últimas 48 horas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}