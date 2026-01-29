import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    // Forçar installments como 1 se for PIX e não vier no body
    if (body.payment_method === 'pix' && !body.installments) {
      body.installments = 1;
    }

    const response = await fetch('https://api.cinqpay.com.br/api/public/v1/transactions?api_token=' + Deno.env.get('CINQPAY_API_TOKEN' ), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: result.message || 'Erro na CinqPay' }, { status: response.status });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
