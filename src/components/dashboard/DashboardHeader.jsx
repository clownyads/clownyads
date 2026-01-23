import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, Bell } from 'lucide-react';

export default function DashboardHeader({ onMenuClick, searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <Menu size={24} />
          </Button>
          
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar ofertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 lg:w-80 pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-[#39FF14]/50"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-zinc-400 hover:text-white"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full" />
          </Button>
          
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#39FF14] to-[#BF00FF] flex items-center justify-center">
            <span className="text-black font-bold text-sm">U</span>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Buscar ofertas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>
    </header>
  );
}