import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Flame, AlertTriangle } from 'lucide-react';

export default function StatsOverview({ offers }) {
  const stats = [
    {
      icon: Package,
      label: 'Total de ofertas',
      value: offers.length,
      color: '#39FF14'
    },
    {
      icon: TrendingUp,
      label: 'Escalando',
      value: offers.filter(o => o.status === 'escalando').length,
      color: '#22C55E'
    },
    {
      icon: Flame,
      label: 'Em alta',
      value: offers.filter(o => o.is_hot).length,
      color: '#FF6B6B'
    },
    {
      icon: AlertTriangle,
      label: 'Com alertas',
      value: offers.filter(o => o.alerts?.length > 0).length,
      color: '#FFB800'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}