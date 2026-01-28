import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Flame, Glasses, Target, Image, AlertTriangle, TrendingUp, Package, Zap } from 'lucide-react';

const items = [
  { icon: Beaker, label: 'Ofertas de Nutra', color: '#22C55E' },
  { icon: Flame, label: 'Ofertas Nicho Hot', color: '#FF6B6B' },
  { icon: Glasses, label: 'Info White e Black', color: '#6B7280' },
  { icon: Target, label: 'Ângulos vencedores', color: '#39FF14' },
  { icon: Image, label: 'Criativos escalados', color: '#BF00FF' },
  { icon: AlertTriangle, label: 'Nível de risco da Oferta (Bloqueios)', color: '#FFB800' },
  { icon: TrendingUp, label: 'Status real: testando, escalando ou saturando', color: '#3B82F6' },
  { icon: Package, label: 'Materiais prontos para usar', color: '#10B981' },
  { icon: Zap, label: 'Hacks para Escalar', color: '#F59E0B' }
];

export default function WhatYouFind() {
  return (
    <section id="recursos" className="py-16 bg-[#0B0B0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            O que você encontra dentro
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group relative"
            >
              {/* Pill capsule background with glassmorphism */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#BF00FF]/10 via-transparent to-[#39FF14]/10" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full rounded-r-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(191, 0, 255, 0.15), rgba(191, 0, 255, 0.05))',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full rounded-l-full"
                  style={{
                    background: 'linear-gradient(225deg, rgba(57, 255, 20, 0.15), rgba(57, 255, 20, 0.05))',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>
              <div className="relative p-5 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-300 flex items-start gap-3 backdrop-blur-sm bg-black/20">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 space-y-2"
        >
          <p className="text-zinc-400 font-semibold">Nada de oferta morta.</p>
          <p className="text-zinc-400 font-semibold">Nada de lixo reciclado.</p>
        </motion.div>
      </div>
    </section>
  );
}