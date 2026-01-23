import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, AlertTriangle } from 'lucide-react';

const metrics = [
  {
    icon: Flame,
    label: '+ dezenas de ofertas ativas',
    description: 'Sempre com novidades',
    color: '#FF6B6B'
  },
  {
    icon: TrendingUp,
    label: 'Novas entradas toda semana',
    description: 'Mercado em movimento',
    color: '#39FF14'
  },
  {
    icon: Target,
    label: 'Ângulos que já convertem',
    description: 'Testados no mercado',
    color: '#BF00FF'
  },
  {
    icon: AlertTriangle,
    label: 'Alertas reais de ban e saturação',
    description: 'Você não entra no escuro',
    color: '#FFB800'
  }
];

export default function Metrics() {
  return (
    <section className="py-20 bg-[#0B0B0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              <div className="relative p-6 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <metric.icon size={20} style={{ color: metric.color }} />
                </div>
                <div 
                  className="text-sm font-bold mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.label}
                </div>
                <div className="text-xs text-zinc-500">{metric.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-zinc-400 text-sm"
        >
          Aqui você não testa no escuro. Você entra sabendo onde pisa.
        </motion.p>
      </div>
    </section>
  );
}