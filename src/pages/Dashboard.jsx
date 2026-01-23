import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OfferFilters from '@/components/dashboard/OfferFilters';
import OfferCard from '@/components/dashboard/OfferCard';
import StatsOverview from '@/components/dashboard/StatsOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    niche: '',
    status: '',
    aggressiveness: '',
    requires_cloaker: '',
    monetization_type: ''
  });

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: () => base44.entities.Offer.list('-created_date'),
  });

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    // Search
    if (searchQuery && !offer.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filters
    if (filters.niche && offer.niche !== filters.niche) return false;
    if (filters.status && offer.status !== filters.status) return false;
    if (filters.aggressiveness && offer.aggressiveness !== filters.aggressiveness) return false;
    if (filters.requires_cloaker !== '' && offer.requires_cloaker !== filters.requires_cloaker) return false;
    if (filters.monetization_type && offer.monetization_type !== filters.monetization_type) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      niche: '',
      status: '',
      aggressiveness: '',
      requires_cloaker: '',
      monetization_type: ''
    });
    setSearchQuery('');
  };

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
          {/* Stats */}
          <StatsOverview offers={offers} />

          {/* Filters */}
          <OfferFilters 
            filters={filters} 
            setFilters={setFilters}
            onClear={clearFilters}
          />

          {/* Offers Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Ofertas disponíveis
                <span className="text-zinc-500 font-normal ml-2">({filteredOffers.length})</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#0A0A0C] border border-white/5 rounded-xl p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <Skeleton className="w-12 h-12 rounded-xl bg-white/5" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 bg-white/5 mb-2" />
                        <Skeleton className="h-4 w-20 bg-white/5" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full bg-white/5 mb-4" />
                    <Skeleton className="h-10 w-full bg-white/5" />
                  </div>
                ))}
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Nenhuma oferta encontrada</h3>
                <p className="text-zinc-500 text-sm">Tente ajustar os filtros ou busca</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOffers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}