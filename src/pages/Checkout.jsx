import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const planDetails = {
  NOVATO: { name: 'NOVATO', price: 'R$ 27,90', value: 27.90, billing: 'Semanal' },
  CABULOSO: { name: 'CABULOSO', price: 'R$ 87,90', value: 87.90, billing: 'Mensal' },
  MESTRE: { name: 'MESTRE', price: 'R$ 697,90', value: 697.90, billing: 'Vitalício' }
};

export default function Checkout() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planName = searchParams.get('plan') || 'CABULOSO';
  const plan = planDetails[planName] || planDetails.CABULOSO;

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui será integrado com a API do Asaas
      // Por enquanto, apenas simulação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar usuário ou atualizar plano
      const user = await base44.auth.me();
      await base44.auth.updateMe({
        plan: planName,
        plan_status: 'active'
      });

      toast.success('Pagamento processado com sucesso!');
      window.location.href = '/Dashboard';
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Finalizar Assinatura</h1>
          <p className="text-zinc-400">Complete seus dados para acessar o plano {plan.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Dados Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-zinc-300">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Método de Pagamento</h2>
                <div className="flex gap-3 mb-4">
                  <Button
                    type="button"
                    variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('pix')}
                    className={paymentMethod === 'pix' ? 'bg-[#39FF14] text-black' : 'border-white/10 text-white'}
                  >
                    <Phone className="mr-2" size={16} />
                    PIX
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className={paymentMethod === 'card' ? 'bg-[#39FF14] text-black' : 'border-white/10 text-white'}
                  >
                    <CreditCard className="mr-2" size={16} />
                    Cartão
                  </Button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber" className="text-zinc-300">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="0000 0000 0000 0000"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardName" className="text-zinc-300">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardExpiry" className="text-zinc-300">Validade</Label>
                      <Input
                        id="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="MM/AA"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv" className="text-zinc-300">CVV</Label>
                      <Input
                        id="cardCvv"
                        value={formData.cardCvv}
                        onChange={(e) => setFormData({...formData, cardCvv: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="000"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                    <Phone className="mx-auto mb-3 text-[#39FF14]" size={48} />
                    <p className="text-white font-semibold mb-2">Pagamento via PIX</p>
                    <p className="text-zinc-400 text-sm">Após confirmar, você receberá o QR Code para pagamento</p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-bold h-12"
              >
                {loading ? 'Processando...' : `Finalizar Pagamento - ${plan.price}`}
              </Button>
            </form>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plano</span>
                  <span className="text-white font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Cobrança</span>
                  <span className="text-white">{plan.billing}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#39FF14] font-bold text-xl">{plan.price}</span>
                </div>
              </div>

              <div className="bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-xl p-4">
                <p className="text-zinc-300 text-sm">
                  ✓ Acesso imediato após pagamento<br/>
                  ✓ Cancele quando quiser<br/>
                  ✓ Suporte via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}