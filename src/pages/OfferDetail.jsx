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
              <Link to={createPageUrl('Offers')}>
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
              <Link to={createPageUrl('Offers')}>
                <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                  Ver todas ofertas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <DollarSign size={18} className="text-[#39FF14] mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">Comissão</p>
                        <p className="font-semibold text-white">{offer.commission || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <Globe size={18} className="text-[#BF00FF] mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">GEO</p>
                        <p className="font-semibold text-white">{offer.geo || 'BR'}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <Target size={18} className="text-[#FFB800] mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">Monetização</p>
                        <p className="font-semibold text-white uppercase">{offer.monetization_type || 'CPA'}</p>
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Aggressiveness */}
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Agressividade</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-black text-white">{offer.aggressiveness}</span>
                      <span className="text-zinc-500">/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-2 flex-1 rounded-full",
                            level <= offer.aggressiveness
                              ? offer.aggressiveness >= 4 
                                ? "bg-red-500" 
                                : offer.aggressiveness >= 3 
                                  ? "bg-yellow-500" 
                                  : "bg-green-500"
                              : "bg-white/10"
                          )}
                        />
                      ))}
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