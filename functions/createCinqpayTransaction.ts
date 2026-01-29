import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // Configurar CORS para permitir chamadas do frontend
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  });

  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const apiToken = Deno.env.get("CINQPAY_API_TOKEN");

    if (!apiToken) {
      return new Response(JSON.stringify({ error: "Token da CinqPay não configurado" }), { status: 500, headers });
    }

    // A CinqPay exige installments mesmo no PIX
    const payload = { ...body, installments: body.installments || 1 };

    const response = await fetch(`https://api.cinqpay.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload )
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: result.message || "Erro na CinqPay", details: result }), { status: 400, headers });
    }

    // Extrair dados do PIX da resposta da CinqPay
    let pixData = null;
    if (body.payment_method === 'pix' && result.transaction) {
      const transaction = result.transaction;
      
      // Tentar encontrar os dados do PIX em diferentes campos possíveis
      pixData = {
        pix_code: transaction.pix_code || transaction.pixCode || transaction.emv || transaction.qrcode_text || '',
        pix_qr_code_url: transaction.pix_qr_code_url || transaction.pixQrCode || transaction.qrcode || transaction.qr_code_url || ''
      };
    }

    // Retornar resposta estruturada com sucesso confirmado
    const successResponse = {
      success: true,
      transaction: result.transaction || result,
      payment_method_details: pixData
    };

    return new Response(JSON.stringify(successResponse), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});