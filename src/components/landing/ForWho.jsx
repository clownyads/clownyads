import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Target } from 'lucide-react';

const forYou = [
  'Você roda tráfego pago',
  'Você já quebrou a cara testando oferta lixo',
  'Você prefere copiar o que funciona',
  'Você entende que risco faz parte do jogo'
];

const notForYou = [
  'Procura renda fácil',
  'Tem medo de oferta agressiva',
  'Quer aprender o básico do zero'
];

export default function ForWho() {
  return (
    <section className="py-16 bg-[#0B0B0D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#BF00FF]/10 flex items-center justify-center mx-auto mb-6">
            <Target size={32} className="text-[#BF00FF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Para quem é (e para quem não é)
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* É pra você */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0C] border border-[#39FF14]/20 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-[#39FF14] mb-6 flex items-center gap-2">
              <Check size={20} />
              É pra você se:
            </h3>
            <div className="space-y-3">
              {forYou.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-[#39FF14]" />
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Não é pra você */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0C] border border-red-500/20 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <X size={20} />
              Não é pra você se:
            </h3>
            <div className="space-y-3">
              {notForYou.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X size={12} className="text-red-400" />
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}