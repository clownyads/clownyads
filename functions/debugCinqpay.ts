import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const apiToken = Deno.env.get("CINQPAY_API_TOKEN");

    const payload = {
      amount: 8790,
      offer_hash: "pjjz31oykp",
      payment_method: "pix",
      installments: 1,
      customer: {
        name: "teste",
        email: "test@test.com",
        document: "12345678900"
      }
    };

    console.error('Enviando para CinqPay...');
    console.error('Token:', apiToken ? 'EXISTE' : 'NÃO EXISTE');
    
    const response = await fetch(`https://api.cinqpay.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.error('Status HTTP:', response.status);
    console.error('Headers:', Object.fromEntries(response.headers));
    
    const result = await response.json();

    console.error('=== RESPOSTA CINQPAY ===');
    console.error(JSON.stringify(result, null, 2));

    return new Response(JSON.stringify({result, log: 'check console'}), {status: 200});

  } catch (error) {
    console.error('ERRO:', error.message);
    return new Response(JSON.stringify({error: error.message}), {status: 500});
  }
});