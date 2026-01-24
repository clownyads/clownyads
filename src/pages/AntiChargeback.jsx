import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Play, Lock } from 'lucide-react';

const modules = [
  {
    name: 'Beta',
    description: 'Fundamentos do anti-chargeback',
    lessons: [
      'Introdução ao Chargeback',
      'Principais Causas de Reembolso',
      'Estrutura de Página Segura',
      'Termos de Uso Blindados',
      'Políticas de Privacidade',
      'FAQ Estratégico',
      'Primeiros Passos'
    ],
    color: '#39FF14'
  },
  {
    name: 'Alfa',
    description: 'Táticas avançadas de proteção',
    lessons: [
      'Copywriting Anti-Reembolso',
      'Gatilhos de Confiança',
      'Prova Social Estratégica',
      'Checkouts Blindados',
      'Email Sequences Preventivos',
      'Suporte que Evita Chargeback',
      'Scripts de Atendimento'
    ],
    color: '#BF00FF'
  },
  {
    name: 'Escalador',
    description: 'Máximo nível de proteção',
    lessons: [
      'Análise de Padrões de Reembolso',
      'Automações Anti-Chargeback',
      'Sistemas de Alerta Preventivo',
      'Documentação Legal',
      'Contestação de Chargebacks',
      'Cases de Sucesso',
      'Estratégias Secretas'
    ],
    color: '#FFB800'
  }
];

export default function AntiChargeback() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Verificar se o usuário tem plano MESTRE
        if (currentUser.plan !== 'MESTRE') {
          window.location.href = createPageUrl('Dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        window.location.href = createPageUrl('Dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFB800]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-[#FFB800]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Entregáveis Anti-Chargeback</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Aprenda as estratégias secretas para zerar seus reembolsos e proteger seu faturamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {modules.map((module, i) => (
            <div key={i} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <span className="font-black text-lg" style={{ color: module.color }}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{module.name}</h2>
                  <p className="text-xs text-zinc-500">{module.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {module.lessons.map((lesson, j) => (
                  <div 
                    key={j}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${module.color}10` }}
                    >
                      {j < 2 ? (
                        <Play size={14} style={{ color: module.color }} />
                      ) : (
                        <Lock size={14} className="text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${j < 2 ? 'text-white' : 'text-zinc-600'}`}>
                        {lesson}
                      </p>
                      {j < 2 && (
                        <p className="text-xs text-zinc-500">Disponível agora</p>
                      )}
                      {j >= 2 && (
                        <p className="text-xs text-zinc-600">Em breve</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#39FF14]/10 to-[#BF00FF]/10 border border-[#39FF14]/20 rounded-2xl p-8 text-center">
          <ShieldCheck size={48} className="text-[#39FF14] mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-2">Proteção Máxima</h3>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Este conteúdo é exclusivo para membros MESTRE. 
            Novas aulas serão liberadas semanalmente com estratégias comprovadas.
          </p>
          <p className="text-zinc-500 text-sm">
            Próxima atualização: Sexta-feira
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}