import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Shield, 
  Flame,
  ExternalLink,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  escalando: { 
    label: 'Escalando', 
    icon: TrendingUp, 
    color: 'bg-green-500/10 text-green-400 border-green-500/20' 
  },
  estavel: { 
    label: 'Estável', 
    icon: Minus, 
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
  },
  saturando: { 
    label: 'Saturando', 
    icon: TrendingDown, 
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
  },
  morta: { 
    label: 'Morta', 
    icon: AlertTriangle, 
    color: 'bg-red-500/10 text-red-400 border-red-500/20' 
  }
};

const riskConfig = {
  baixo: { label: 'Risco Baixo', color: 'bg-green-500/10 text-green-400' },
  medio: { label: 'Risco Médio', color: 'bg-yellow-500/10 text-yellow-400' },
  alto: { label: 'Risco Alto', color: 'bg-orange-500/10 text-orange-400' },
  extremo: { label: 'Risco Extremo', color: 'bg-red-500/10 text-red-400' }
};

const nicheConfig = {
  nutra: { label: 'Nutra', color: 'bg-emerald-500/10 text-emerald-400' },
  hot: { label: 'Hot', color: 'bg-pink-500/10 text-pink-400' },
  info_gray: { label: 'Info Gray', color: 'bg-purple-500/10 text-purple-400' },
  info_black: { label: 'Info Black', color: 'bg-zinc-500/10 text-zinc-400' }
};

export default function OfferCard({ offer }) {
  const status = statusConfig[offer.status] || statusConfig.estavel;
  const risk = riskConfig[offer.risk_level] || riskConfig.baixo;
  const niche = nicheConfig[offer.niche] || nicheConfig.nutra;
  const StatusIcon = status.icon;

  return (
    <div className="group relative bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300">
      {/* Hot Badge */}
      {offer.is_hot && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30">
            <Flame size={12} className="mr-1" />
            Em alta
          </Badge>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#39FF14]/20 to-[#BF00FF]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {offer.name?.charAt(0) || 'O'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg truncate group-hover:text-[#39FF14] transition-colors">
              {offer.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("text-xs border", niche.color)}>
                {niche.label}
              </Badge>
              {offer.commission && (
                <span className="text-xs text-zinc-500">{offer.commission}</span>
              )}
            </div>
          </div>
        </div>

        {/* Status & Risk */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={cn("border", status.color)}>
            <StatusIcon size={12} className="mr-1" />
            {status.label}
          </Badge>
          <Badge variant="outline" className={cn("border", risk.color)}>
            <Shield size={12} className="mr-1" />
            {risk.label}
          </Badge>
        </div>

        {/* Aggressiveness */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Agressividade</span>
            <span>{offer.aggressiveness}/5</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
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

        {/* Cloaker Info */}
        {offer.requires_cloaker && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 mb-4">
            <AlertTriangle size={14} />
            <span>Precisa de cloaker</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
          <Link to={createPageUrl('OfferDetail') + `?id=${offer.id}`} className="flex-1">
            <Button 
              className="w-full bg-white/5 hover:bg-white/10 text-white border-0"
              variant="outline"
            >
              <Eye size={16} className="mr-2" />
              Ver oferta
            </Button>
          </Link>
          {offer.affiliate_url && (
            <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="outline" className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 border-[#39FF14]/20 text-[#39FF14]">
                <ExternalLink size={16} />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}