import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, AlertTriangle, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'Ofertas agressivas',
    description: 'Nutra, hot e info que realmente convertem. Testadas no campo.',
    color: '#FF6B6B'
  },
  {
    icon: Target,
    title: 'Ângulos vencedores',
    description: 'Copys e hooks que estão gerando resultado agora.',
    color: '#39FF14'
  },
  {
    icon: AlertTriangle,
    title: 'Alertas de ban',
    description: 'Saiba antes quando uma oferta está caindo ou sendo banida.',
    color: '#FFB800'
  },
  {
    icon: TrendingUp,
    title: 'Status real de escala',
    description: 'Veja o que está escalando, estável ou saturando.',
    color: '#BF00FF'
  }
];

export default function Features() {
  return (
    <section id="recursos" className="py-24 bg-[#0B0B0D] relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF14]/5 to-transparent" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#BF00FF] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Ferramentas reais pra quem quer escalar de verdade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${feature.color}10, transparent)` 
                }}
              />
              <div className="relative p-8 border border-white/5 rounded-2xl group-hover:border-white/10 transition-all duration-300">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}