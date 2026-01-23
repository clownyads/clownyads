import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Filter, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Eye,
    number: '01',
    title: 'Monitoramos o mercado',
    description: 'Analisamos plataformas, campanhas, VSLs e movimentos reais de escala.'
  },
  {
    icon: Filter,
    number: '02',
    title: 'Filtramos o que performa',
    description: 'Só entra oferta com sinal claro de conversão e potencial de escala.'
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Você executa',
    description: 'Escolhe a oferta, aplica o modelo e vai direto pro tráfego.'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-[#0B0B0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#39FF14] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Como funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            3 passos pra escalar
          </h2>
          <p className="text-zinc-400">Simples. Rápido. Lucrativo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}
              
              <div className="relative p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 flex items-center justify-center">
                    <step.icon size={24} className="text-[#39FF14]" />
                  </div>
                  <span className="text-5xl font-black text-white/5">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}