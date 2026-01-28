import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Alerts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
      }
    };
    checkAuth();
  }, []);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: () => base44.entities.Offer.list('-created_date'),
  });

  const offersWithAlerts = offers.filter(offer => offer.alerts?.length > 0);

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
            <div className="w-12 h-12 rounded-xl bg-[#FFB800]/10 flex items-center justify-center">
              <AlertTriangle size={24} className="text-[#FFB800]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Alertas</h1>
              <p className="text-zinc-500 text-sm">Avisos importantes sobre as ofertas</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#0A0A0C] border border-white/5 rounded-xl p-5">
                  <Skeleton className="h-5 w-48 bg-white/5 mb-3" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                </div>
              ))}
            </div>
          ) : offersWithAlerts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nenhum alerta ativo</h3>
              <p className="text-zinc-500 text-sm">Tudo certo por aqui!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offersWithAlerts.map(offer => (
                <div key={offer.id} className="bg-[#0A0A0C] border border-white/5 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <Link 
                      to={createPageUrl('OfferDetail') + `?id=${offer.id}`}
                      className="font-bold text-white hover:text-[#39FF14] transition-colors"
                    >
                      {offer.name}
                    </Link>
                    <Badge className="bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20">
                      {offer.alerts.length} {offer.alerts.length === 1 ? 'alerta' : 'alertas'}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {offer.alerts.map((alert, i) => (
                      <div 
                        key={i}
                        className="flex items-start gap-3 p-3 bg-[#FFB800]/5 border border-[#FFB800]/10 rounded-lg"
                      >
                        <AlertTriangle size={16} className="text-[#FFB800] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-zinc-300">{alert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}