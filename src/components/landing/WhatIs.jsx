import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

export default function WhatIs() {
  return (
    <section className="py-12 bg-[#0B0B0D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BF00FF]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#BF00FF]/20 to-[#39FF14]/20 backdrop-blur-sm border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Radar size={40} className="text-[#BF00FF]" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 leading-tight">
            O Radar de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF00FF] to-[#39FF14]">OFERTAS</span> para quem vive de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#BF00FF]">ESCALA</span>.
          </h2>
          
          <div className="space-y-6 text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            <p className="text-xl">O ClownyAds é uma plataforma de ofertas de diversos nichos,
que já estão rodando escaladas.
            </p>
            
            <div className="inline-block px-6 py-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10">
              <p className="font-bold text-white text-xl">
                Nada de achismo.<br />
                Nada de "testa pra ver".
              </p>
            </div>
            
            <p className="text-lg">A gente observa o jogo, filtra o que está performando e entrega tudo pra você clonar e escalar.

            </p>
            
            <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-[#BF00FF]/10 backdrop-blur-sm border border-[#39FF14]/30 mt-4">
              <p className="text-[#39FF14] font-bold text-xl">
                Você entra, escolhe, clona e escala.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}