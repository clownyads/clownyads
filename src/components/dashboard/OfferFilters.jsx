import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';

export default function OfferFilters({ filters, setFilters, onClear }) {
  const hasFilters = Object.values(filters).some(v => v && v !== 'all');

  return (
    <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal size={18} />
          <span className="font-semibold text-sm">Filtros</span>
        </div>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-zinc-400 hover:text-white h-8 px-2"
          >
            <X size={14} className="mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Nicho */}
        <Select 
          value={filters.niche || 'all'} 
          onValueChange={(v) => setFilters({...filters, niche: v === 'all' ? '' : v})}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Nicho" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-white/10">
            <SelectItem value="all">Todos nichos</SelectItem>
            <SelectItem value="nutra">Nutra</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="info_gray">Info Gray</SelectItem>
            <SelectItem value="info_black">Info Black</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(v) => setFilters({...filters, status: v === 'all' ? '' : v})}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-white/10">
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="escalando">Escalando</SelectItem>
            <SelectItem value="estavel">Estável</SelectItem>
            <SelectItem value="saturando">Saturando</SelectItem>
            <SelectItem value="morta">Morta</SelectItem>
          </SelectContent>
        </Select>

        {/* Agressividade */}
        <Select 
          value={filters.aggressiveness?.toString() || 'all'} 
          onValueChange={(v) => setFilters({...filters, aggressiveness: v === 'all' ? '' : parseInt(v)})}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Agressividade" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-white/10">
            <SelectItem value="all">Toda agressividade</SelectItem>
            <SelectItem value="1">Nível 1 - Leve</SelectItem>
            <SelectItem value="2">Nível 2</SelectItem>
            <SelectItem value="3">Nível 3 - Médio</SelectItem>
            <SelectItem value="4">Nível 4</SelectItem>
            <SelectItem value="5">Nível 5 - Extremo</SelectItem>
          </SelectContent>
        </Select>

        {/* Cloaker */}
        <Select 
          value={filters.requires_cloaker?.toString() || 'all'} 
          onValueChange={(v) => setFilters({...filters, requires_cloaker: v === 'all' ? '' : v === 'true'})}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Cloaker" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-white/10">
            <SelectItem value="all">Cloaker</SelectItem>
            <SelectItem value="true">Precisa cloaker</SelectItem>
            <SelectItem value="false">Sem cloaker</SelectItem>
          </SelectContent>
        </Select>

        {/* Monetização */}
        <Select 
          value={filters.monetization_type || 'all'} 
          onValueChange={(v) => setFilters({...filters, monetization_type: v === 'all' ? '' : v})}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
            <SelectValue placeholder="Monetização" />
          </SelectTrigger>
          <SelectContent className="bg-[#18181B] border-white/10">
            <SelectItem value="all">Toda monetização</SelectItem>
            <SelectItem value="cpa">CPA</SelectItem>
            <SelectItem value="revshare">RevShare</SelectItem>
            <SelectItem value="cpl">CPL</SelectItem>
            <SelectItem value="cpc">CPC</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}