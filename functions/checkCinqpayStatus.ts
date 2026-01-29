import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const apiToken = Deno.env.get("CINQPAY_API_TOKEN");
    const { transactionHash } = await req.json();

    if (!apiToken) {
      return Response.json({ error: 'API Token não configurado' }, { status: 500 });
    }

    if (!transactionHash) {
      return Response.json({ error: 'Transaction hash required' }, { status: 400 });
    }

    const response = await fetch(
      `https://api.cinqpay.com.br/api/public/v1/transactions/${transactionHash}?api_token=${apiToken}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao verificar status');
    }

    return Response.json({
      status: result.status,
      transaction: result
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});