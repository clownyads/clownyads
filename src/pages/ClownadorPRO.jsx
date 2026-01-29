import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Wrench, ExternalLink } from 'lucide-react';

const tools = [
  {
    name: 'Analisador de Qualidade de Anúncios',
    description: 'Ferramenta que mostra a qualidade dos anúncios na biblioteca',
    url: 'https://chromewebstore.google.com/detail/mmehdbhpbgoegockemckbpjeoflflobc?utm_source=item-share-cb',
    icon: '📊'
  },
  {
    name: 'Download de Criativos em Alta Resolução',
    description: 'Ferramenta para baixar qualquer criativo ou VSL em alta resolução',
    url: 'https://chromewebstore.google.com/detail/ekhbcipncbkfpkaianbjbcbmfehjflpf?utm_source=item-share-cb',
    icon: '📥'
  },
  {
    name: 'Pesquisa de Ofertas com IP Internacional',
    description: 'Ferramenta para procurar por ofertas de forma nativa no meta, com ip de outro país',
    url: 'https://chromewebstore.google.com/detail/eppiocemhmnlbhjplcgkofciiegomcon?utm_source=item-share-cb',
    icon: '🌍'
  },
  {
    name: 'Habilitar Click Direito',
    description: 'Ferramenta para habilitar o click direito em qualquer página',
    url: 'https://chromewebstore.google.com/detail/ofgdcdohlhjfdhbnfkikfeakhpojhpgm?utm_source=item-share-cb',
    icon: '🖱️'
  },
  {
    name: 'Download de Código Completo',
    description: 'Ferramenta para baixar o código da página completo',
    url: 'https://chromewebstore.google.com/detail/nfmhckgnfajhgdkichmemeigkbiianea?utm_source=item-share-cb',
    icon: '💻'
  },
  {
    name: 'Download de VSL',
    description: 'Ferramenta para baixar qualquer VSL',
    url: 'https://chromewebstore.google.com/detail/iogidnfllpdhagebkblkgbfijkbkjdmm?utm_source=item-share-cb',
    icon: '🎥'
  }
];

export default function ClownadorPRO() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        
        if (!currentUser.plan || (currentUser.plan !== 'CABULOSO' && currentUser.plan !== 'MESTRE')) {
          window.location.href = createPageUrl('OfertasDoDia');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        window.location.href = createPageUrl('OfertasDoDia');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <p className="text-white">Carregando...</p>
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

        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF6B6B] flex items-center justify-center">
              <Wrench size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Clownador PRO</h1>
              <p className="text-zinc-500 text-sm">Ferramentas exclusivas para afiliados profissionais</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#BF00FF]/10 border border-[#39FF14]/20 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-3">🎯 Combo Completo de Ferramentas</h2>
            <p className="text-zinc-300 leading-relaxed">
              Parabéns, esse é o Combo para você conseguir se enfiar (lá ele), em qualquer oferta e ter tudo em mãos para escalar qualquer oferta!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Instale as extensões abaixo:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <div 
                  key={index}
                  className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                      <p className="text-sm text-zinc-400 mb-4">{tool.description}</p>
                    </div>
                  </div>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-semibold">
                      <ExternalLink size={16} className="mr-2" />
                      Acessar ferramenta!
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 text-center">
            <Wrench size={48} className="text-[#39FF14] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Arsenal Completo</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Com essas ferramentas você terá tudo o que precisa para analisar, copiar e escalar ofertas como um profissional.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}