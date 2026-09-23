import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const webhookSecret = Deno.env.get("CINQPAY_WEBHOOK_SECRET");
    const signature = req.headers.get("x-cinqpay-signature");
    
    if (!signature || signature !== webhookSecret) {
      return Response.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const body = await req.json();
    const { transaction_id, amount, currency, status, user_id, plan, payment_method } = body;

    // Criar ou atualizar registro de pagamento
    const existingPayments = await base44.asServiceRole.entities.Payment.filter({ 
      transactionId: transaction_id 
    });

    if (existingPayments.length > 0) {
      // Atualizar pagamento existente
      await base44.asServiceRole.entities.Payment.update(existingPayments[0].id, {
        status: status,
        amount: parseFloat(amount) / 100
      });
    } else {
      // Criar novo pagamento
      await base44.asServiceRole.entities.Payment.create({
        transactionId: transaction_id,
        amount: parseFloat(amount) / 100,
        currency: currency || 'BRL',
        status: status,
        userId: user_id,
        plan: plan,
        paymentMethod: payment_method
      });
    }

    // Se pagamento aprovado, atualizar plano do usuário
    if (status === 'approved' || status === 'paid') {
      try {
        const users = await base44.asServiceRole.entities.User.filter({ email: user_id });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, { 
            plan: plan 
          });
        }
      } catch (error) {
        console.log('Usuário não encontrado para atualização:', error);
      }
    }

    return Response.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});