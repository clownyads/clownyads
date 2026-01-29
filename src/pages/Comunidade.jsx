import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle } from 'lucide-react';

export default function Comunidade() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7289DA] to-[#5865F2] flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Comunidade</h1>
              <p className="text-zinc-500 text-sm">Conecte-se com outros membros</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Discord */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-8 text-center hover:border-[#5865F2]/30 transition-all group">
              <div className="w-20 h-20 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#5865F2]/20 transition-all">
                <svg className="w-10 h-10" fill="#5865F2" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-white mb-2">Discord</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Junte-se ao nosso servidor Discord para conversar com outros top players e receber suporte em tempo real
              </p>
              <a href="https://discord.gg/clownyads" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold w-full">
                  Entrar no Discord
                </Button>
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-8 text-center hover:border-[#25D366]/30 transition-all group">
              <div className="w-20 h-20 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#25D366]/20 transition-all">
                <MessageCircle size={40} className="text-[#25D366]" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">WhatsApp</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Entre no nosso grupo VIP do WhatsApp para receber alertas exclusivos e networking com top players
              </p>
              <a href="https://chat.whatsapp.com/clownyads" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold w-full">
                  Entrar no WhatsApp
                </Button>
              </a>
            </div>
          </div>

          <div className="max-w-4xl bg-gradient-to-r from-[#39FF14]/10 to-[#BF00FF]/10 border border-[#39FF14]/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">💎 Comunidade Exclusiva</h3>
            <p className="text-zinc-400 text-sm">
              Conecte-se com outros top players, compartilhe resultados, tire dúvidas e aprenda com quem está escalando todos os dias.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}