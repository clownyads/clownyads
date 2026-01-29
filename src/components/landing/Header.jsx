import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/9f53f90ae_ClownyAds3.png"
              alt="ClownyAds"
              className="h-10 w-auto" />

            <span className="font-black text-xl tracking-tight">
              <span className="text-white font-medium">Clowny</span><span className="text-[#39FF14] font-black">Ads</span>
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
            <Button 
              variant="ghost" 
              onClick={handleLogin}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Entrar
            </Button>
            <a href="#precos">
              <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                Acessar ofertas
              </Button>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400">

            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen &&
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
            <Button 
              variant="ghost" 
              onClick={handleLogin}
              className="w-full text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Entrar
            </Button>
            <a href="#precos">
              <Button className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold">
                Acessar ofertas
              </Button>
            </a>
          </div>
        </div>
      }
    </header>);

}