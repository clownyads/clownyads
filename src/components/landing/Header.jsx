import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#BF00FF] flex items-center justify-center">
              <span className="text-black font-black text-sm">C</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Clowny<span className="text-[#39FF14]">Ads</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Como funciona
            </a>
            <a href="#recursos" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#precos" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Preços
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                Acessar ofertas
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0B0D] border-t border-white/5 px-4 py-4 space-y-4">
          <a href="#como-funciona" className="block text-sm text-zinc-400 hover:text-white">
            Como funciona
          </a>
          <a href="#recursos" className="block text-sm text-zinc-400 hover:text-white">
            Recursos
          </a>
          <a href="#precos" className="block text-sm text-zinc-400 hover:text-white">
            Preços
          </a>
          <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="w-full text-zinc-400 hover:text-white hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                Acessar ofertas
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}