import React from 'react';
import { motion } from 'framer-motion';
import { Zap, X, Check } from 'lucide-react';

const notItems = [
  'Não vendemos curso',
  'Não ensinamos o básico',
  'Não romantizamos tráfego'
];

const yesItems = [
  'Mostramos o que está rodando',
  'Indicamos risco real',
  'Economizamos seu tempo e dinheiro'
];

export default function WhyDifferent() {
  return (
    <section className="py-16 bg-[#0B0B0D] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#BF00FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#39FF14]/10 flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-[#39FF14]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Aqui o jogo é real.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Não é */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {notItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <X size={14} className="text-red-400" />
                </div>
                <span className="text-zinc-300 text-sm">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* É */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {yesItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-[#39FF14]" />
                </div>
                <span className="text-zinc-300 text-sm">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 text-lg text-zinc-400"
        >
          Se você já sabe rodar tráfego,{' '}
          <span className="text-[#39FF14] font-semibold">
            o ClownyAds vira sua ferramenta secreta cabulosa.
          </span>
        </motion.p>
      </div>
    </section>
  );
}