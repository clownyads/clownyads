import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Infinity } from 'lucide-react';

const plans = [
  {
    name: 'NOVATO',
    icon: Zap,
    price: 'R$27,90',
    billing: 'Semanal',
    features: [
      'Biblioteca das ofertas',
      '3 Ofertas diversas do Dia',
      'Indicador de risco básico'
    ],
    color: '#39FF14',
    planType: 'NOVATO'
  },
  {
    name: 'CABULOSO',
    icon: Crown,
    price: 'R$87,90',
    billing: 'Mensal',
    badge: 'Mais escolhido',
    features: [
      'Todas as ofertas',
      'Comunidade Exclusiva',
      'Alertas de ban',
      'Ângulos vencedores',
      'Hacks Secretos de Escala',
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
    billing: 'Anual',
    badge: 'Uma vez só',
    features: [
      'Acesso total',
      'Estratégia Secreta para ganhar no leilão',
      'Alertas antecipados',
      'Clowncker PLUS',
      'Entregáveis ant-chargeback'
    ],
    color: '#FFB800',
    planType: 'MESTRE'
  }
];

export default function PlanUpgradePrompt() {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Para ter acesso as melhores Ofertas e mais escaladas, adquira um dos planos abaixo
        </h2>
        <p className="text-zinc-400">
          Escolha o plano ideal para o seu negócio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden ${
              plan.highlight 
                ? 'bg-gradient-to-b from-[#BF00FF]/20 to-transparent border-2 border-[#BF00FF]/30' 
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

            <div className="p-6">
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
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm ml-2">/ {plan.billing}</span>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Check size={12} style={{ color: plan.color }} />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={`${createPageUrl('Checkout')}?plan=${plan.planType}`}>
                <Button 
                  className="w-full font-semibold"
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
          </div>
        ))}
      </div>
    </div>
  );
}