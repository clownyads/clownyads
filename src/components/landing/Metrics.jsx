import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, Layers } from 'lucide-react';

const metrics = [
  {
    icon: TrendingUp,
    value: '147',
    label: 'Ofertas ativas',
    color: '#39FF14'
  },
  {
    icon: RefreshCw,
    value: '24h',
    label: 'Atualizações constantes',
    color: '#BF00FF'
  },
  {
    icon: Layers,
    value: '12',
    label: 'Nichos monitorados',
    color: '#39FF14'
  }
];

export default function Metrics() {
  return (
    <section className="py-20 bg-[#0B0B0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="relative p-8 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <metric.icon size={24} style={{ color: metric.color }} />
                </div>
                <div 
                  className="text-4xl font-black mb-2"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </div>
                <div className="text-zinc-400 text-sm">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}