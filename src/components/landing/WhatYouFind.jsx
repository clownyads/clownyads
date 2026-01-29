import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Flame, Glasses, Target, Image, AlertTriangle, TrendingUp, Package, Zap } from 'lucide-react';

const categories = [
  '🐾 Pets',
  '💸 Low Ticket',
  '🔥 Tendências',
  '📈 Renda Extra',
  '💎 Estilo de Vida',
  '💄 Moda & Beleza',
  '🙏 Espiritualidade',
  '🏃 Emagrecimento',
  '💕 Relacionamento',
  '🌶️ Sexualidade',
  '❤️ Saúde & Bem-estar',
  '📚 Educação & Idiomas',
  '🧠 Desenvolv. Pessoal',
  '🏋️ Fitness & Exercícios',
  '👨‍👩‍👧 Família & Maternidade'
].sort((a, b) => a.length - b.length);

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-8">
            <ul className="space-y-3 text-left">
              {categories.map((category, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="text-lg text-zinc-200 font-medium hover:text-[#39FF14] transition-colors cursor-default"
                >
                  {category}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

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