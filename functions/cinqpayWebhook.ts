import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verificar o segredo do webhook
    const webhookSecret = Deno.env.get("CINQPAY_WEBHOOK_SECRET");
    const signature = req.headers.get("x-cinqpay-signature");
    
    if (!signature || signature !== webhookSecret) {
      return Response.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const body = await req.json();
    
    // Extrair dados do webhook do CinqPay
    const { 
      transaction_id, 
      amount, 
      currency, 
      status, 
      user_id, 
      plan,
      payment_method 
    } = body;

    // Criar registro de pagamento
    await base44.asServiceRole.entities.Payment.create({
      transactionId: transaction_id,
      amount: parseFloat(amount),
      currency: currency || 'BRL',
      status: status,
      userId: user_id,
      plan: plan,
      paymentMethod: payment_method
    });

    // Se o pagamento foi aprovado, criar o usuário se necessário e atualizar o plano
    if (status === 'approved' || status === 'paid') {
      try {
        // Tentar atualizar usuário existente
        await base44.asServiceRole.entities.User.update(user_id, {
          plan: plan
        });
      } catch (error) {
        // Se usuário não existe, o sistema de auth já deve ter criado
        console.log('Usuário será criado pelo sistema de autenticação');
      }
    }

    return Response.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});