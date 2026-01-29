import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { transactionId } = await req.json();

    if (!transactionId) {
      return Response.json({ error: 'Transaction ID required' }, { status: 400 });
    }

    // Buscar o pagamento no banco de dados
    const payments = await base44.asServiceRole.entities.Payment.filter({ 
      transactionId: transactionId 
    });

    if (payments.length === 0) {
      return Response.json({ status: 'not_found' });
    }

    const payment = payments[0];
    
    return Response.json({ 
      status: payment.status,
      payment: payment
    });
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});