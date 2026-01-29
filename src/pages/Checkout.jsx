import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Check, Loader2 } from 'lucide-react';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  
  const plan = searchParams.get('plan') || 'BASIC';
  
  const planDetails = {
    BASIC: {
      name: 'TRAMPO',
      price: 97,
      features: ['Ofertas verificadas', 'Atualizações diárias', 'Suporte básico']
    },
    CABULOSO: {
      name: 'CABULOSO',
      price: 197,
      features: ['Tudo do TRAMPO', 'Alertas em tempo real', 'Suporte prioritário', 'Análises avançadas']
    },
    MESTRE: {
      name: 'MESTRE',
      price: 497,
      features: ['Tudo do CABULOSO', 'Clowncker PLUS', 'Anti-Chargeback', 'Consultoria 1:1', 'Acesso vitalício']
    }
  };

  const currentPlan = planDetails[plan] || planDetails.BASIC;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Aqui você integraria com o CinqPay JS SDK
      // Por enquanto, simulando o processo
      console.log('Processando pagamento:', {
        plan,
        amount: currentPlan.price,
        method: selectedMethod,
        userId: user.id
      });
      
      // Exemplo de integração com CinqPay:
      // const cinqpay = window.CinqPay.configure({ publicKey: 'sua_chave_publica' });
      // const result = await cinqpay.createCheckout({
      //   amount: currentPlan.price,
      //   currency: 'BRL',
      //   customer: { email: user.email },
      //   metadata: { plan, userId: user.id }
      // });
      
      alert('Processando pagamento... Em produção, isso iniciaria o fluxo do CinqPay.');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#39FF14] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/9f53f90ae_ClownyAds3.png"
            alt="ClownyAds"
            className="h-16 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-zinc-400">Complete seu pagamento para acessar o plano {currentPlan.name}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Plano */}
          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>
            
            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#BF00FF]/10 p-6 rounded-lg mb-6">
              <div className="text-sm text-zinc-400 mb-2">Plano</div>
              <div className="text-2xl font-bold text-white mb-4">{currentPlan.name}</div>
              <div className="text-3xl font-black text-[#39FF14]">
                R$ {currentPlan.price}
                <span className="text-sm text-zinc-400 font-normal">/mês</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">O que está incluso:</h3>
              {currentPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check size={16} className="text-[#39FF14] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Método de Pagamento */}
          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Método de Pagamento</h2>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedMethod('credit_card')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedMethod === 'credit_card'
                    ? 'border-[#39FF14] bg-[#39FF14]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <CreditCard size={24} className={selectedMethod === 'credit_card' ? 'text-[#39FF14]' : 'text-zinc-400'} />
                <div className="text-left">
                  <div className="font-semibold text-white">Cartão de Crédito</div>
                  <div className="text-xs text-zinc-400">Aprovação instantânea</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('pix')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedMethod === 'pix'
                    ? 'border-[#39FF14] bg-[#39FF14]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <QrCode size={24} className={selectedMethod === 'pix' ? 'text-[#39FF14]' : 'text-zinc-400'} />
                <div className="text-left">
                  <div className="font-semibold text-white">PIX</div>
                  <div className="text-xs text-zinc-400">Aprovação em poucos minutos</div>
                </div>
              </button>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-bold py-6 text-lg"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                `Pagar R$ ${currentPlan.price}`
              )}
            </Button>

            <p className="text-xs text-zinc-500 text-center mt-4">
              Pagamento seguro processado por CinqPay. Seus dados estão protegidos.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}