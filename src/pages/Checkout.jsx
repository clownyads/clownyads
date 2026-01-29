import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Check, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const PLAN_CONFIGS = {
  NOVATO: { 
    name: 'NOVATO', 
    price: 27.90, 
    hash: 'pjjz31oykp', 
    billing: 'Semanal',
    benefits: [
      'Acesso a ofertas atualizadas diariamente',
      'Filtros básicos de nichos e status',
      'Visualização de dados de performance',
      'Suporte via email'
    ]
  },
  CABULOSO: { 
    name: 'CABULOSO', 
    price: 87.90, 
    hash: 'pjjz31oykp', 
    billing: 'Mensal',
    benefits: [
      'Todos os benefícios do NOVATO',
      'Alertas em tempo real de ofertas quentes',
      'Análise avançada de competição',
      'Acesso prioritário a novas ofertas',
      'Suporte via WhatsApp'
    ]
  },
  MESTRE: { 
    name: 'MESTRE', 
    price: 697.90, 
    hash: 'pjjz31oykp', 
    billing: 'Anual',
    benefits: [
      'Todos os benefícios do CABULOSO',
      'Clowncker PLUS (cloaker premium)',
      'Sistema Anti-Chargeback',
      'Criativos exclusivos e scripts',
      'Consultoria individual mensal',
      'Grupo VIP de membros MESTRE'
    ]
  }
};

const COUNTRIES = [
  { code: '+55', name: 'Brasil', flag: '🇧🇷', length: 11 },
  { code: '+1', name: 'EUA/Canadá', flag: '🇺🇸', length: 10 },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', length: 9 },
  { code: '+34', name: 'Espanha', flag: '🇪🇸', length: 9 },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧', length: 10 },
  { code: '+39', name: 'Itália', flag: '🇮🇹', length: 10 }
];

const getUpgradePlan = (currentPlanKey) => {
  if (currentPlanKey === 'NOVATO') return 'CABULOSO';
  if (currentPlanKey === 'CABULOSO') return 'MESTRE';
  return null;
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('register');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  
  const planKey = searchParams.get('plan') || 'CABULOSO';
  const currentPlan = PLAN_CONFIGS[planKey] || PLAN_CONFIGS.CABULOSO;

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
    cardCvv: '',
    countryCode: '+55'
  });

  const selectedCountry = COUNTRIES.find(c => c.code === formData.countryCode) || COUNTRIES[0];

  const handleInputChange = (field, value) => {
    // Validação para campo nome: apenas letras
    if (field === 'name') {
      const onlyLetters = /^[a-zA-ZÀ-ÿ\s]*$/;
      if (!onlyLetters.test(value)) return;
    }
    
    // Validação para telefone: apenas números
    if (field === 'phone') {
      const onlyNumbers = value.replace(/\D/g, '');
      if (onlyNumbers.length <= selectedCountry.length) {
        setFormData(prev => ({ ...prev, [field]: onlyNumbers }));
      }
      return;
    }

    // Validação para CPF: apenas números e formatação
    if (field === 'cpf') {
      let onlyNumbers = value.replace(/\D/g, '');
      if (onlyNumbers.length <= 11) {
        // Formata o CPF: 111.222.333-44
        if (onlyNumbers.length > 9) {
          onlyNumbers = onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (onlyNumbers.length > 6) {
          onlyNumbers = onlyNumbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (onlyNumbers.length > 3) {
          onlyNumbers = onlyNumbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        setFormData(prev => ({ ...prev, [field]: onlyNumbers }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCPF = (cpf) => {
    const numeros = cpf.replace(/\D/g, '').split('').map(Number);
    
    if (numeros.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (numeros.every(num => num === numeros[0])) return false;
    
    // Validação do primeiro dígito
    const soma1 = numeros.slice(0, 9).reduce((acc, num, idx) => acc + num * (10 - idx), 0);
    const digito1 = ((soma1 * 10) % 11) % 10;
    if (numeros[9] !== digito1) return false;
    
    // Validação do segundo dígito
    const soma2 = numeros.slice(0, 10).reduce((acc, num, idx) => acc + num * (11 - idx), 0);
    const digito2 = ((soma2 * 10) % 11) % 10;
    if (numeros[10] !== digito2) return false;
    
    return true;
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
    
    if (formData.phone.length !== selectedCountry.length) {
      toast.error(`O telefone deve ter ${selectedCountry.length} dígitos para ${selectedCountry.name}`);
      return false;
    }
    
    if (!validateCPF(formData.cpf)) {
      toast.error('CPF inválido');
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
      const payload = {
        amount: Math.round(currentPlan.price * 100),
        offer_hash: currentPlan.hash,
        payment_method: paymentMethod,
        customer: {
          name: formData.name,
          email: formData.email,
          phone_number: formData.countryCode + formData.phone,
          document: formData.cpf.replace(/\D/g, '')
        },
        cart: [{
          product_hash: currentPlan.hash,
          title: `Plano ${currentPlan.name}`,
          price: Math.round(currentPlan.price * 100),
          quantity: 1,
          operation_type: 1,
          tangible: false
        }],
        plan: currentPlan.name
      };

      if (paymentMethod === 'credit_card') {
        const [month, year] = formData.cardExpiry.split('/');
        payload.card = {
          number: formData.cardNumber.replace(/\s/g, ''),
          holder_name: formData.cardName,
          exp_month: parseInt(month),
          exp_year: parseInt('20' + year),
          cvv: formData.cardCvv
        };
      }

      const response = await base44.functions.invoke('createCinqpayTransaction', payload);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao processar pagamento');
      }

      const { transaction } = response.data;
      setTransactionHash(transaction.hash);

      if (paymentMethod === 'pix' && transaction.payment_method_details) {
        setPixData(transaction.payment_method_details);
        setStep('processing');
        startPaymentPolling(transaction.hash);
      } else if (transaction.status === 'approved' || transaction.status === 'paid') {
        toast.success('Pagamento aprovado! Criando sua conta...');
        setTimeout(() => {
          toast.success('Conta criada! Faça login para acessar.');
          base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        }, 2000);
      } else if (transaction.status === 'pending') {
        toast.info('Pagamento em processamento...');
        setStep('processing');
        startPaymentPolling(transaction.hash);
      } else {
        throw new Error('Status de pagamento desconhecido');
      }

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const startPaymentPolling = (hash) => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutos (5s * 120)

    const pollInterval = setInterval(async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        clearInterval(pollInterval);
        toast.error('Tempo de espera excedido. Entre em contato com o suporte.');
        return;
      }

      try {
        const response = await base44.functions.invoke('checkCinqpayStatus', {
          transactionHash: hash
        });

        if (response.data.status === 'approved' || response.data.status === 'paid') {
          clearInterval(pollInterval);
          toast.success('Pagamento confirmado! Criando sua conta...');
          
          setTimeout(() => {
            toast.success('Conta criada com sucesso! Faça login para acessar.');
            base44.auth.redirectToLogin(createPageUrl('Dashboard'));
          }, 1500);
        } else if (response.data.status === 'declined' || response.data.status === 'cancelled') {
          clearInterval(pollInterval);
          toast.error('Pagamento não aprovado. Tente novamente.');
          setStep('payment');
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 5000); // Verificar a cada 5 segundos
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
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/5 border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Resumo</h2>
              
              <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#BF00FF]/10 p-4 rounded-lg mb-4">
                <div className="text-sm text-zinc-400 mb-1">Plano</div>
                <div className="text-xl font-bold text-white mb-2">{currentPlan.name}</div>
                <div className="text-2xl font-black text-[#39FF14]">
                  R$ {currentPlan.price.toFixed(2)}
                  <span className="text-xs text-zinc-400 font-normal ml-1">/ {currentPlan.billing}</span>
                </div>
              </div>

              {/* Benefícios do Plano */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">O que está incluso:</h3>
                <ul className="space-y-2">
                  {currentPlan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check size={16} className="text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {currentPlan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>R$ {currentPlan.price.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Upgrade Offer */}
            {getUpgradePlan(planKey) && (
              <Card className="bg-gradient-to-br from-[#BF00FF]/10 to-[#39FF14]/10 border-[#BF00FF]/30 p-4">
                <div className="text-xs font-bold text-[#BF00FF] mb-2">🚀 UPGRADE DISPONÍVEL</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Plano {PLAN_CONFIGS[getUpgradePlan(planKey)].name}
                </h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Economize mais e tenha acesso a recursos exclusivos
                </p>
                
                <ul className="space-y-1.5 mb-4">
                  {PLAN_CONFIGS[getUpgradePlan(planKey)].benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check size={14} className="text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {PLAN_CONFIGS[getUpgradePlan(planKey)].benefits.length > 3 && (
                    <li className="text-xs text-zinc-400 italic">
                      +{PLAN_CONFIGS[getUpgradePlan(planKey)].benefits.length - 3} benefícios adicionais
                    </li>
                  )}
                </ul>

                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <div className="text-2xl font-black text-[#39FF14]">
                    R$ {PLAN_CONFIGS[getUpgradePlan(planKey)].price.toFixed(2)}
                    <span className="text-xs text-zinc-400 font-normal ml-1">
                      / {PLAN_CONFIGS[getUpgradePlan(planKey)].billing}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(createPageUrl('Checkout') + `?plan=${getUpgradePlan(planKey)}`)}
                  className="w-full bg-gradient-to-r from-[#BF00FF] to-[#39FF14] text-white font-bold"
                >
                  Fazer upgrade agora
                </Button>
              </Card>
            )}
          </div>

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
                        className={`bg-white/5 border-white/10 text-white ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? 'border-red-500'
                            : formData.confirmPassword && formData.password === formData.confirmPassword
                            ? 'border-green-500'
                            : ''
                        }`}
                        placeholder="Confirme sua senha"
                        required
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <Check size={12} /> Senhas correspondem
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Celular *</Label>
                      <div className="flex gap-2">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange('countryCode', e.target.value)}
                          className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 w-32"
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-white/5 border-white/10 text-white flex-1"
                          placeholder={`${selectedCountry.length} dígitos`}
                          maxLength={selectedCountry.length}
                          required
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        {selectedCountry.name}: {selectedCountry.length} dígitos
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">CPF *</Label>
                      <Input
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="000.000.000-00"
                        maxLength={14}
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

            {step === 'processing' && (
              <Card className="bg-white/5 border-white/10 p-6">
                <div className="text-center">
                  {pixData ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 flex items-center justify-center mx-auto mb-4">
                        <QrCode size={32} className="text-[#39FF14]" />
                      </div>
                      
                      <h2 className="text-xl font-bold text-white mb-2">Pague com PIX</h2>
                      <p className="text-zinc-400 mb-6">Escaneie o QR Code ou copie o código abaixo</p>

                      {/* QR Code */}
                      {pixData.qrcode && (
                        <div className="bg-white p-4 rounded-lg mx-auto w-fit mb-4">
                          <img src={pixData.qrcode} alt="QR Code PIX" className="w-64 h-64" />
                        </div>
                      )}

                      <div className="bg-white/5 p-4 rounded-lg mb-4">
                        <p className="text-xs text-zinc-400 mb-2">Código PIX (Copia e Cola)</p>
                        <p className="text-white text-xs break-all font-mono">{pixData.qrcode_text || pixData.emv}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(pixData.qrcode_text || pixData.emv);
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
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="animate-spin text-[#39FF14]" size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Processando pagamento</h2>
                      <p className="text-zinc-400">Aguarde enquanto confirmamos seu pagamento...</p>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}