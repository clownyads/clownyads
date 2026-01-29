import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, Code, Copy, CheckCircle2, User } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function ClownckerPlus() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blackUrl, setBlackUrl] = useState('');
  const [whiteUrl, setWhiteUrl] = useState('');
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          base44.auth.redirectToLogin(window.location.pathname);
          return;
        }
        
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const generateScript = () => {
    if (!blackUrl || !whiteUrl) {
      toast.error('Preencha ambas as URLs');
      return;
    }
    setScriptGenerated(true);
  };

  const script = `<script>
(function() {
  var botPatterns = [
    /bot/i, /crawl/i, /spider/i, /facebookexternalhit/i,
    /twitterbot/i, /linkedinbot/i, /whatsapp/i, /telegram/i
  ];
  
  var userAgent = navigator.userAgent;
  var isBot = botPatterns.some(function(pattern) {
    return pattern.test(userAgent);
  });
  
  if (isBot || navigator.webdriver) {
    window.location.href = '${whiteUrl}';
  }
  
  // Track visit
  fetch('https://api.clownyads.com/track', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      url: window.location.href,
      userAgent: userAgent,
      timestamp: new Date().toISOString()
    })
  });
})();
</script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success('Script copiado!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  // Se não é MESTRE, mostrar upgrade
  if (!user || user.plan !== 'MESTRE') {
    return (
      <div className="min-h-screen bg-[#0B0B0D]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:pl-64">
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-xl bg-[#FFB800]/10 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-[#FFB800]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Clowncker PLUS</h1>
            <p className="text-zinc-400">Acesso Exclusivo para Mestres</p>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Esta ferramenta é exclusiva para o plano MESTRE
              </h2>
              <p className="text-zinc-400">
                Faça upgrade para ter acesso ao Clowncker PLUS e outras funcionalidades exclusivas
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
                <div className="absolute top-0 right-0">
                  <div className="rounded-none rounded-bl-lg px-3 py-1 font-semibold bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30">
                    Uma vez só
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FFB800]/15">
                      <Shield size={20} className="text-[#FFB800]" />
                    </div>
                    <span className="font-bold text-white text-lg">MESTRE</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-white">R$697,90</span>
                    <span className="text-zinc-500 text-sm ml-2">/ Anual</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFB800]/20">
                        <Shield size={12} className="text-[#FFB800]" />
                      </div>
                      <span className="text-sm text-zinc-300">Clowncker PLUS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFB800]/20">
                        <Shield size={12} className="text-[#FFB800]" />
                      </div>
                      <span className="text-sm text-zinc-300">Acesso total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFB800]/20">
                        <Shield size={12} className="text-[#FFB800]" />
                      </div>
                      <span className="text-sm text-zinc-300">Estratégias secretas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FFB800]/20">
                        <Shield size={12} className="text-[#FFB800]" />
                      </div>
                      <span className="text-sm text-zinc-300">Alertas antecipados</span>
                    </div>
                  </div>
                  <Link to={`${createPageUrl('Checkout')}?plan=MESTRE`}>
                    <Button className="w-full font-semibold border border-white/10 bg-transparent text-white hover:bg-white/5">
                      Fazer Upgrade
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFB800]/10 flex items-center justify-center">
              <Shield size={24} className="text-[#FFB800]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Clowncker PLUS</h1>
              <p className="text-zinc-400">Cloacker EXCLUSIVO para Mestres</p>
            </div>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            Proteja suas campanhas black de robôs de plataformas de anúncios. 
            Gere um script personalizado que redireciona automaticamente bots para uma página white.
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <Label htmlFor="blackUrl" className="text-white text-lg mb-2 block">
              URL da Página Black (Oferta)
            </Label>
            <Input
              id="blackUrl"
              value={blackUrl}
              onChange={(e) => setBlackUrl(e.target.value)}
              placeholder="https://exemplo.com/oferta"
              className="bg-white/5 border-white/10 text-white h-12"
            />
          </div>

          <div>
            <Label htmlFor="whiteUrl" className="text-white text-lg mb-2 block">
              URL da Página White (Redirecionamento)
            </Label>
            <Input
              id="whiteUrl"
              value={whiteUrl}
              onChange={(e) => setWhiteUrl(e.target.value)}
              placeholder="https://exemplo.com/safe"
              className="bg-white/5 border-white/10 text-white h-12"
            />
          </div>

          <Button 
            onClick={generateScript}
            className="w-full bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold h-12"
          >
            <Code className="mr-2" />
            Gerar Script
          </Button>

          {scriptGenerated && (
            <div className="space-y-4">
              <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="text-[#39FF14] mt-1" size={20} />
                  <div>
                    <p className="text-white font-semibold">Script Gerado!</p>
                    <p className="text-zinc-400 text-sm">
                      Copie o código abaixo e cole dentro da tag &lt;head&gt; da sua página black.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  value={script}
                  readOnly
                  className="bg-slate-900 border-white/10 text-slate-100 font-mono text-xs h-64"
                />
                <Button
                  onClick={copyScript}
                  size="sm"
                  className="absolute top-2 right-2 bg-white/10 hover:bg-white/20"
                >
                  <Copy size={14} className="mr-1" />
                  Copiar
                </Button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Importante:</strong> Este script detecta bots comuns de plataformas de anúncios 
                  e os redireciona para a página white. Teste sempre antes de usar em campanhas reais.
                </p>
              </div>
            </div>
          )}
        </div>

          </div>
        </main>
      </div>
    </div>
  );
}