import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const apiToken = Deno.env.get("CINQPAY_API_TOKEN");

    if (!apiToken) {
      return Response.json({ error: 'API Token não configurado' }, { status: 500 });
    }

    const body = await req.json();
    const { amount, offer_hash, payment_method, customer, cart, plan, card } = body;

    const payload = {
      amount: amount,
      offer_hash: offer_hash,
      payment_method: payment_method,
      customer: customer,
      cart: cart,
      metadata: {
        plan: plan,
        user_email: customer.email
      }
    };

    if (payment_method === 'credit_card' && card) {
      payload.card = card;
    }

    const response = await fetch(
      `https://api.cinqpay.com.br/api/public/v1/transactions?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao processar pagamento');
    }

    // Criar registro inicial do pagamento
    await base44.asServiceRole.entities.Payment.create({
      transactionId: result.hash,
      amount: amount / 100,
      currency: 'BRL',
      status: result.status,
      userId: customer.email,
      plan: plan,
      paymentMethod: payment_method
    });

    return Response.json({
      success: true,
      transaction: {
        hash: result.hash,
        status: result.status,
        payment_method_details: result.payment_method_details || null
      }
    });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return Response.json({ 
      error: error.message || 'Erro ao processar pagamento' 
    }, { status: 500 });
  }
});