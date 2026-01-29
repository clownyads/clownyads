import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle, 
  Shield,
  Target,
  Globe,
  DollarSign,
  Flame,
  Copy,
  Check,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  escalando: { label: 'Escalando', icon: TrendingUp, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  estavel: { label: 'Estável', icon: Minus, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  saturando: { label: 'Saturando', icon: TrendingDown, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  morta: { label: 'Morta', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/20' }
};

const riskConfig = {
  baixo: { label: 'Risco Baixo', color: 'text-green-400 bg-green-500/10' },
  medio: { label: 'Risco Médio', color: 'text-yellow-400 bg-yellow-500/10' },
  alto: { label: 'Risco Alto', color: 'text-orange-400 bg-orange-500/10' },
  extremo: { label: 'Risco Extremo', color: 'text-red-400 bg-red-500/10' }
};

const nicheConfig = {
  nutra: { label: 'Nutra', color: 'text-emerald-400 bg-emerald-500/10' },
  hot: { label: 'Hot', color: 'text-pink-400 bg-pink-500/10' },
  info_gray: { label: 'Info Gray', color: 'text-purple-400 bg-purple-500/10' },
  info_black: { label: 'Info Black', color: 'text-zinc-400 bg-zinc-500/10' }
};

export default function OfferDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const urlParams = new URLSearchParams(window.location.search);
  const offerId = urlParams.get('id');

  React.useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
      }
    };
    checkAuth();
  }, []);

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: async () => {
      const offers = await base44.entities.Offer.filter({ id: offerId });
      return offers[0];
    },
    enabled: !!offerId
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = offer ? statusConfig[offer.status] : null;
  const risk = offer ? riskConfig[offer.risk_level] : null;
  const niche = offer ? nicheConfig[offer.niche] : null;

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-zinc-400 hover:text-white"
              >
                <Menu size={24} />
              </Button>
              <Link to={createPageUrl('OfertasDoDia')}>
                <Button variant="ghost" className="text-zinc-400 hover:text-white gap-2">
                  <ArrowLeft size={18} />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full bg-white/5 rounded-xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 bg-white/5 rounded-xl lg:col-span-2" />
                <Skeleton className="h-64 bg-white/5 rounded-xl" />
              </div>
            </div>
          ) : !offer ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-bold text-white mb-2">Oferta não encontrada</h2>
              <p className="text-zinc-500 mb-4">A oferta que você procura não existe</p>
              <Link to={createPageUrl('OfertasDoDia')}>
                <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                  Ver ofertas do dia
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#39FF14]/20 to-[#BF00FF]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-2xl">
                        {offer.name?.charAt(0) || 'O'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-black text-white">{offer.name}</h1>
                        {offer.is_hot && (
                          <Badge className="bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30">
                            <Flame size={12} className="mr-1" />
                            Em alta
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {niche && (
                          <Badge className={cn("border", niche.color)}>
                            {niche.label}
                          </Badge>
                        )}
                        {status && (
                          <Badge className={cn("border", status.color)}>
                            <status.icon size={12} className="mr-1" />
                            {status.label}
                          </Badge>
                        )}
                        {risk && (
                          <Badge className={cn("border", risk.color)}>
                            <Shield size={12} className="mr-1" />
                            {risk.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {offer.affiliate_url && (
                      <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                          <ExternalLink size={16} className="mr-2" />
                          Acessar oferta
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* Banner */}
                {offer.banner_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={offer.banner_url} 
                      alt={offer.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Overview */}
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                    <h2 className="font-bold text-white mb-4">Visão Geral</h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                      {offer.description || 'Sem descrição disponível.'}
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <DollarSign size={18} className="text-[#39FF14] mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">Ticket</p>
                        <p className="font-semibold text-white">{offer.ticket || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <Globe size={18} className="text-[#BF00FF] mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">GEO</p>
                        <p className="font-semibold text-white">{offer.geo || 'BR'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <Shield size={18} className="text-zinc-400 mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">Cloaker</p>
                        <p className="font-semibold text-white">{offer.requires_cloaker ? 'Necessário' : 'Opcional'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Angle */}
                  {offer.main_angle && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-white">Ângulo Principal</h2>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(offer.main_angle)}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                      </div>
                      <div className="p-4 bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-xl">
                        <p className="text-zinc-300 leading-relaxed">{offer.main_angle}</p>
                      </div>
                    </div>
                  )}

                  {/* Traffic Sources */}
                  {offer.traffic_sources?.length > 0 && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                      <h2 className="font-bold text-white mb-4">Fontes de Tráfego</h2>
                      <div className="flex flex-wrap gap-2">
                        {offer.traffic_sources.map((source, i) => (
                          <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ad Library Links */}
                  {offer.ad_library_links?.length > 0 && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                      <h2 className="font-bold text-white mb-4">Biblioteca de Anúncios</h2>
                      <div className="flex flex-wrap gap-2">
                        {offer.ad_library_links.map((link, i) => (
                          <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                              {i + 1}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files */}
                  {offer.files_url && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-xl bg-[#39FF14]/10 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-white mb-2">Arquivos da Oferta</h3>
                        <a href={offer.files_url} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                            <ExternalLink size={16} className="mr-2" />
                            Acessar arquivos
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Ad Volume Score */}
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Volume de Anúncios</h3>
                    <div className="relative w-full h-24 flex items-center justify-center mb-4">
                      {/* Gauge background */}
                      <svg className="w-full h-full" viewBox="0 0 200 110">
                        {/* Background arc */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#ffffff10"
                          strokeWidth="12"
                        />
                        {/* Colored sections */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 60 40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="12"
                        />
                        <path
                          d="M 60 40 A 80 80 0 0 1 100 20"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="12"
                        />
                        <path
                          d="M 100 20 A 80 80 0 0 1 140 40"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="12"
                        />
                        <path
                          d="M 140 40 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="12"
                        />
                        {/* Needle */}
                        <g transform={`rotate(${(() => {
                          const adCount = offer.aggressiveness * 25; // Simulate ad count from aggressiveness
                          let angle;
                          if (adCount <= 10) angle = -90 + (adCount / 10) * 45;
                          else if (adCount <= 30) angle = -45 + ((adCount - 10) / 20) * 45;
                          else if (adCount <= 99) angle = 0 + ((adCount - 30) / 69) * 45;
                          else angle = 45 + Math.min((adCount - 100) / 100, 1) * 45;
                          return angle;
                        })()} 100 100)`}>
                          <line x1="100" y1="100" x2="100" y2="30" stroke="white" strokeWidth="3" />
                          <circle cx="100" cy="100" r="5" fill="white" />
                        </g>
                      </svg>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-3">
                      <span>Baixo</span>
                      <span>Médio</span>
                      <span>Alto</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-zinc-400">
                        {(() => {
                          const adCount = offer.aggressiveness * 25;
                          if (adCount <= 10) return 'Baixo (0-10 anúncios)';
                          if (adCount <= 30) return 'Médio Baixo (11-30 anúncios)';
                          if (adCount <= 99) return 'Médio Alto (31-99 anúncios)';
                          return 'Alto (100+ anúncios)';
                        })()}
                      </p>
                    </div>
                    {offer.is_hot && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <Badge className="bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30 w-full justify-center">
                          <Flame size={14} className="mr-1" />
                          Em alta
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Banner */}
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden">
                    <div className="aspect-[5/2] bg-gradient-to-br from-[#39FF14]/10 via-[#BF00FF]/10 to-[#39FF14]/10 flex items-center justify-center">
                      <div className="text-center p-6">
                        <h3 className="text-xl font-black text-white mb-2">
                          Espaço para Banner
                        </h3>
                        <p className="text-sm text-zinc-500">500x200</p>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {offer.alerts?.length > 0 && (
                    <div className="bg-[#0A0A0C] border border-[#FFB800]/20 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={18} className="text-[#FFB800]" />
                        <h3 className="font-bold text-white">Alertas</h3>
                      </div>
                      <div className="space-y-3">
                        {offer.alerts.map((alert, i) => (
                          <div key={i} className="p-3 bg-[#FFB800]/5 border border-[#FFB800]/10 rounded-lg">
                            <p className="text-sm text-zinc-300">{alert}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Creatives Preview */}
                  {offer.creatives?.length > 0 && (
                    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4">Criativos ({offer.creatives.length})</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {offer.creatives.slice(0, 4).map((url, i) => (
                          <div key={i} className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Creative ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}