import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0D] border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#BF00FF] flex items-center justify-center">
              <span className="text-black font-black text-sm">C</span>
            </div>
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