import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
              <Heart size={24} className="text-[#FF6B6B]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Favoritos</h1>
              <p className="text-zinc-500 text-sm">Suas ofertas salvas</p>
            </div>
          </div>

          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum favorito ainda</h3>
            <p className="text-zinc-500 text-sm">Salve ofertas para acessar rapidamente</p>
          </div>
        </main>
      </div>
    </div>
  );
}