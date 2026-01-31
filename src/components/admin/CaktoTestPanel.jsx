import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { Loader2, TestTube, CheckCircle2, XCircle } from 'lucide-react';

export default function CaktoTestPanel() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('CABULOSO');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const events = [
    { label: 'Assinatura Criada', value: 'subscription_created', type: 'success' },
    { label: 'Assinatura Renovada', value: 'subscription_renewed', type: 'success' },
    { label: 'Assinatura Cancelada', value: 'subscription_canceled', type: 'danger' },
    { label: 'Renovação Recusada', value: 'subscription_renewal_refused', type: 'danger' },
    { label: 'Compra Aprovada', value: 'purchase_approved', type: 'success' },
  ];

  const handleTest = async (event) => {
    if (!email) {
      toast.error('Por favor, digite um e-mail para teste');
      return;
    }

    setLoading(true);
    setLastResult(null);

    try {
      const { data } = await base44.functions.invoke('simulateCaktoWebhook', {
        email,
        event,
        plan
      });

      setLastResult(data);

      if (data.webhook_response?.success) {
        toast.success(`Evento ${event} enviado com sucesso!`);
      } else {
        toast.error(`Erro no webhook: ${data.webhook_response?.error || 'Desconhecido'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao simular webhook');
      setLastResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#0A0A0C] border-white/10 text-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="text-[#39FF14]" />
          <CardTitle>Simulador de Integração Cakto</CardTitle>
        </div>
        <CardDescription className="text-zinc-500">
          Simule eventos de pagamento e assinatura para validar a integração.
          Isso envia um webhook real para o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>E-mail do Cliente (Teste)</Label>
            <Input 
              placeholder="cliente@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Plano Simulado</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOVATO">Novato</SelectItem>
                <SelectItem value="CABULOSO">Cabuloso</SelectItem>
                <SelectItem value="MESTRE">Mestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Disparar Evento</Label>
          <div className="flex flex-wrap gap-2">
            {events.map((evt) => (
              <Button
                key={evt.value}
                onClick={() => handleTest(evt.value)}
                disabled={loading}
                variant="outline"
                className={`border-white/10 hover:bg-white/5 ${
                  evt.type === 'success' 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {evt.label}
              </Button>
            ))}
          </div>
        </div>

        {lastResult && (
          <div className={`p-4 rounded-lg border ${
            lastResult.webhook_response?.success 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {lastResult.webhook_response?.success 
                ? <CheckCircle2 className="text-green-400 w-5 h-5" />
                : <XCircle className="text-red-400 w-5 h-5" />
              }
              <span className={`font-semibold ${
                lastResult.webhook_response?.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {lastResult.webhook_response?.success ? 'Sucesso' : 'Falha'}
              </span>
            </div>
            
            <pre className="text-xs text-zinc-400 overflow-auto max-h-40 bg-black/20 p-2 rounded">
              {JSON.stringify(lastResult.webhook_response || lastResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}