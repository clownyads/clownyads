import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

export default function WhatIs() {
  return (
    <section className="py-24 bg-[#0B0B0D] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#BF00FF]/5 to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#BF00FF]/10 flex items-center justify-center mx-auto mb-6">
            <Radar size={32} className="text-[#BF00FF]" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
            O radar de ofertas para quem vive de escala.
          </h2>
          
          <div className="space-y-4 text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            <p>
              O ClownyAds é uma plataforma de curadoria de ofertas agressivas que já estão rodando no mercado.
            </p>
            <p className="font-semibold text-white">
              Nada de achismo.<br />
              Nada de "testa pra ver".
            </p>
            <p>
              A gente observa o jogo, filtra o que está performando e entrega o atalho.
            </p>
            <p className="text-[#39FF14] font-semibold">
              Você entra, escolhe, clona e escala.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}