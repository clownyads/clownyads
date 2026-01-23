import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0D] border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Disclaimer */}
        <div className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-xl text-center">
          <p className="text-zinc-400 text-sm leading-relaxed mb-2">
            <span className="text-white font-semibold">O ClownyAds não vende promessas.</span>
            <br />
            Vendemos informação de mercado.
          </p>
          <p className="text-zinc-500 text-xs">
            O risco é seu. A vantagem também.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/23bff8abb_logoClownyAds.png"
              alt="ClownyAds" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-white text-lg tracking-tight">
              Clowny<span className="text-[#39FF14]">Ads</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Termos de uso
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Contato
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} ClownyAds
          </p>
        </div>
      </div>
    </footer>
  );
}