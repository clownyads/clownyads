import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Calendar, Mail } from 'lucide-react';

export default function Profile() {
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BF00FF]/10 flex items-center justify-center">
              <User size={24} className="text-[#BF00FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Perfil</h1>
              <p className="text-zinc-500 text-sm">Gerencie suas informações</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#39FF14] to-[#BF00FF] flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-black text-3xl">U</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Usuário</h2>
                <p className="text-zinc-500 text-sm mb-4">usuario@email.com</p>
                <Badge className="bg-[#BF00FF]/10 text-[#BF00FF] border-[#BF00FF]/20">
                  <Crown size={12} className="mr-1" />
                  Plano Cabuloso
                </Badge>
              </div>

              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6 mt-4">
                <h3 className="font-semibold text-white mb-4">Resumo</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-zinc-500" />
                    <div>
                      <p className="text-sm text-white">Membro desde</p>
                      <p className="text-xs text-zinc-500">Janeiro 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-zinc-500" />
                    <div>
                      <p className="text-sm text-white">Próxima cobrança</p>
                      <p className="text-xs text-zinc-500">15/02/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-6">Informações pessoais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-400 text-sm mb-2 block">Nome</Label>
                    <Input 
                      defaultValue="Usuário"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm mb-2 block">Email</Label>
                    <Input 
                      defaultValue="usuario@email.com"
                      className="bg-white/5 border-white/10 text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm mb-2 block">WhatsApp</Label>
                    <Input 
                      placeholder="+55 11 99999-9999"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm mb-2 block">Telegram</Label>
                    <Input 
                      placeholder="@usuario"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <Button className="mt-6 bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                  Salvar alterações
                </Button>
              </div>

              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Assinatura</h3>
                <div className="flex items-center justify-between p-4 bg-[#BF00FF]/5 border border-[#BF00FF]/20 rounded-xl">
                  <div>
                    <p className="font-bold text-white">Plano Cabuloso</p>
                    <p className="text-sm text-zinc-400">R$87,90/mês • Renova em 15/02/2025</p>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    Gerenciar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}