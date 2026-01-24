import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Crown, Infinity, Gift } from 'lucide-react';

const plans = [
  {
    name: 'NOVATO',
    icon: Zap,
    price: 'R$27,90',
    billing: 'Semanal',
    description: 'Testar o mercado real',
    features: [
      'Biblioteca das ofertas',
      '3 Ofertas diversas do Dia',
      'Indicador de risco básico'
    ],
    unavailable: [
      'Alertas de ban',
      'Ângulos vencedores'
    ],
    color: '#39FF14',
    highlight: false,
    planType: 'NOVATO'
  },
  {
    name: 'CABULOSO',
    icon: Crown,
    price: 'R$87,90',
    billing: 'Mensal',
    description: 'Pra quem leva a sério',
    badge: 'Mais escolhido',
    features: [
      'Todas as ofertas',
      'Comunidade Exclusiva',
      'Alertas de ban',
      'Ângulos vencedores',
      'Hacks Secretos de Escala MetaAds e GoogleAds',
      'Histórico mensal de Ofertas'
    ],
    color: '#BF00FF',
    highlight: true,
    planType: 'CABULOSO'
  },
  {
    name: 'MESTRE',
    icon: Infinity,
    price: 'R$697,90',
    billing: 'Vitalício',
    description: 'Acesso definitivo',
    badge: 'Uma vez só',
    features: [
      'Acesso total',
      'Estratégia Secreta para ganhar no leilão',
      'Acesso a Comunidade',
      'Alertas antecipados',
      'Histórico completo',
      'Clowncker PLUS [Cloacker EXCLUSIVO]',
      'Entregáveis ant-chargeback(Zero Reembolso)'
    ],
    color: '#FFB800',
    highlight: false,
    planType: 'MESTRE'
  }
];

export default function Pricing() {
  return (
    <section id="precos" className="py-24 bg-[#0B0B0D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#39FF14] text-sm font-semibold tracking-wider uppercase mb-4 block">
            Preços
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Escolha seu nível
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Sem enrolação. Paga e acessa. Cancela quando quiser.
          </p>
        </motion.div>

        {/* Plano Gratuito */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift size={20} className="text-zinc-500" />
              <span className="font-bold text-zinc-400 text-lg">TÔ LISO</span>
            </div>
            <p className="text-2xl font-black text-white mb-2">Gratuito</p>
            <p className="text-zinc-500 text-sm mb-4">Acesso a comunidade com 1 Oferta diária gratuita</p>
            <a href="https://chat.whatsapp.com/BijJFfPK9EDASCNUyFdeeK" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10">
                Entrar na Comunidade
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-[#BF00FF]/20 to-transparent border-2 border-[#BF00FF]/30 scale-105 md:scale-110 z-10' 
                  : 'bg-white/[0.02] border border-white/5'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <Badge 
                    className="rounded-none rounded-bl-lg px-3 py-1 font-semibold"
                    style={{ 
                      backgroundColor: `${plan.color}20`,
                      color: plan.color,
                      borderColor: `${plan.color}30`
                    }}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}15` }}
                  >
                    <plan.icon size={20} style={{ color: plan.color }} />
                  </div>
                  <span className="font-bold text-white text-lg">{plan.name}</span>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm ml-2">/ {plan.billing}</span>
                </div>

                <p className="text-zinc-400 text-sm mb-6">{plan.description}</p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${plan.color}20` }}
                      >
                        <Check size={12} style={{ color: plan.color }} />
                      </div>
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                  {plan.unavailable?.map((feature, j) => (
                    <div key={`unavail-${j}`} className="flex items-center gap-3 opacity-40">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500/20">
                        <X size={12} className="text-red-400" />
                      </div>
                      <span className="text-sm text-zinc-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={`${createPageUrl('Checkout')}?plan=${plan.planType}`}>
                  <Button 
                    className="w-full font-semibold h-12"
                    style={{ 
                      backgroundColor: plan.highlight ? plan.color : 'transparent',
                      color: plan.highlight ? '#0B0B0D' : 'white',
                      border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    Começar agora
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}