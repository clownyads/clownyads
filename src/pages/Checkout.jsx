import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Check, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const planPrices = {
  NOVATO: { name: 'NOVATO', price: 27.90, billing: 'Semanal' },
  CABULOSO: { name: 'CABULOSO', price: 87.90, billing: 'Mensal' },
  MESTRE: { name: 'MESTRE', price: 697.90, billing: 'Vitalício' }
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // register, payment, processing
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const plan = searchParams.get('plan') || 'CABULOSO';
  const currentPlan = planPrices[plan] || planPrices.CABULOSO;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateRegister = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !formData.cpf) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (validateRegister()) {
      setStep('payment');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'credit_card') {
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv) {
        toast.error('Preencha todos os dados do cartão');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Simular integração com CinqPay
      // Na produção, você faria a chamada real para a API do CinqPay aqui
      const mockTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(mockTransactionId);

      if (paymentMethod === 'pix') {
        // Gerar código PIX (simulado)
        const mockPixCode = `00020126360014br.gov.bcb.pix0114${formData.cpf}52040000530398654${currentPlan.price.toFixed(2)}5802BR5925${formData.name}6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        setPixCode(mockPixCode);
        setStep('processing');
        
        // Iniciar polling para verificar pagamento
        startPaymentPolling(mockTransactionId);
      } else {
        // Cartão de crédito - processar pagamento
        await processPayment(mockTransactionId);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  const processPayment = async (txnId) => {
    try {
      // Simular aprovação do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar registro de pagamento
      await base44.asServiceRole.entities.Payment.create({
        transactionId: txnId,
        amount: currentPlan.price,
        currency: 'BRL',
        status: 'approved',
        userId: formData.email,
        plan: plan,
        paymentMethod: paymentMethod
      });

      // Criar usuário com plano
      // Na produção, isso seria feito via webhook do CinqPay
      // Por ora, simulando a criação
      toast.success('Pagamento aprovado! Criando sua conta...');
      
      setTimeout(() => {
        // Redirecionar para login
        toast.success('Conta criada com sucesso! Faça login para acessar.');
        base44.auth.redirectToLogin(createPageUrl('Dashboard'));
      }, 1500);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao finalizar pagamento.');
      setLoading(false);
    }
  };

  const startPaymentPolling = (txnId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await base44.functions.invoke('checkPaymentStatus', {
          transactionId: txnId
        });

        if (response.data.status === 'approved' || response.data.status === 'paid') {
          clearInterval(pollInterval);
          toast.success('Pagamento confirmado! Criando sua conta...');
          
          setTimeout(() => {
            toast.success('Conta criada com sucesso! Faça login para acessar.');
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
          }, 1500);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 3000); // Verificar a cada 3 segundos

    // Parar após 10 minutos
    setTimeout(() => {
      clearInterval(pollInterval);
      if (step === 'processing') {
        toast.error('Tempo de espera excedido. Entre em contato com o suporte.');
      }
    }, 600000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69730f7b4701117070f90750/9f53f90ae_ClownyAds3.png"
            alt="ClownyAds"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-zinc-400">Complete seu cadastro e pagamento para acessar o plano {currentPlan.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resumo do Plano */}
          <Card className="bg-white/5 border-white/10 p-6 lg:col-span-1 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">Resumo</h2>
            
            <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#BF00FF]/10 p-4 rounded-lg mb-4">
              <div className="text-sm text-zinc-400 mb-1">Plano</div>
              <div className="text-xl font-bold text-white mb-2">{currentPlan.name}</div>
              <div className="text-2xl font-black text-[#39FF14]">
                R$ {currentPlan.price.toFixed(2)}
                <span className="text-xs text-zinc-400 font-normal ml-1">/ {currentPlan.billing}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>R$ {currentPlan.price.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                <span>Total</span>
                <span>R$ {currentPlan.price.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Formulário */}
          <div className="lg:col-span-2">
            {step === 'register' && (
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14] text-black flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-white">Criar sua conta</h2>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white">Nome completo *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">E-mail *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Senha *</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Confirmar senha *</Label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Confirme sua senha"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Celular *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">CPF *</Label>
                      <Input
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-bold py-6"
                  >
                    Continuar para pagamento
                  </Button>
                </form>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep('register')}
                    className="text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-[#39FF14] text-black flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-white">Escolher pagamento</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Método de Pagamento */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'credit_card'
                          ? 'border-[#39FF14] bg-[#39FF14]/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <CreditCard size={24} className={paymentMethod === 'credit_card' ? 'text-[#39FF14]' : 'text-zinc-400'} />
                      <div className="text-left">
                        <div className="font-semibold text-white">Cartão de Crédito</div>
                        <div className="text-xs text-zinc-400">Aprovação instantânea</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'pix'
                          ? 'border-[#39FF14] bg-[#39FF14]/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <QrCode size={24} className={paymentMethod === 'pix' ? 'text-[#39FF14]' : 'text-zinc-400'} />
                      <div className="text-left">
                        <div className="font-semibold text-white">PIX</div>
                        <div className="text-xs text-zinc-400">Aprovação em poucos minutos</div>
                      </div>
                    </button>
                  </div>

                  {/* Dados do Cartão */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Número do cartão *</Label>
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-white">Nome no cartão *</Label>
                        <Input
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Nome como no cartão"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Validade *</Label>
                          <Input
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-white">CVV *</Label>
                          <Input
                            value={formData.cardCvv}
                            onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-bold py-6 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      `Pagar R$ ${currentPlan.price.toFixed(2)}`
                    )}
                  </Button>

                  <p className="text-xs text-zinc-500 text-center">
                    🔒 Pagamento seguro processado por CinqPay
                  </p>
                </form>
              </Card>
            )}

            {step === 'processing' && paymentMethod === 'pix' && (
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 flex items-center justify-center mx-auto mb-4">
                    <QrCode size={32} className="text-[#39FF14]" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-2">Pague com PIX</h2>
                  <p className="text-zinc-400 mb-6">Escaneie o QR Code ou copie o código abaixo</p>

                  {/* QR Code simulado */}
                  <div className="bg-white p-4 rounded-lg mx-auto w-64 h-64 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <QrCode size={200} className="text-black mx-auto" />
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg mb-4">
                    <p className="text-xs text-zinc-400 mb-2">Código PIX (Copia e Cola)</p>
                    <p className="text-white text-xs break-all font-mono">{pixCode}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(pixCode);
                        toast.success('Código copiado!');
                      }}
                      className="mt-2 text-white border-white/20"
                    >
                      Copiar código
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[#39FF14] mb-4">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-sm">Aguardando pagamento...</span>
                  </div>

                  <p className="text-xs text-zinc-500">
                    O sistema irá detectar automaticamente quando o pagamento for confirmado
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}