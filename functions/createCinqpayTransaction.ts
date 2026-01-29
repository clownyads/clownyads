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

    // LOG COMPLETO DA RESPOSTA DA CINQPAY
    console.error('========== RESPOSTA CINQPAY COMPLETA ==========');
    console.error(JSON.stringify(result, null, 2));
    console.error('=============================================');

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: result.message || "Erro na CinqPay", details: result }), { status: 400, headers });
    }

    // Estruturar resposta - CinqPay retorna 'data' com transaction
    const transaction = result.data || result.transaction || result;
    
    // Log para debug - remover após validação
    console.log('Transaction extraída:', JSON.stringify(transaction, null, 2));
    
    // Extrair dados do PIX da resposta da CinqPay
    let pixData = null;
    if (body.payment_method === 'pix') {
      // Mapeamento correto conforme documentação CinqPay
      const pixCode = transaction.pix_bruto || 
                      transaction.pix_code || 
                      transaction.emv ||
                      transaction.pix?.code ||
                      '';
      const pixQrCode = transaction.pix_image ||
                        transaction.qr_code ||
                        transaction.pix_qr_code_url ||
                        transaction.pix?.qr_code_url ||
                        '';
      
      console.log('PIX Code encontrado:', pixCode ? 'SIM' : 'NÃO');
      console.log('PIX QR Code encontrado:', pixQrCode ? 'SIM' : 'NÃO');
      
      if (pixCode || pixQrCode) {
        pixData = {
          pix_code: pixCode,
          pix_qr_code_url: pixQrCode
        };
      }
    }

    // Retornar resposta estruturada com sucesso confirmado
    const successResponse = {
      success: true,
      transaction: {
        hash: transaction.hash || transaction.id || '',
        status: transaction.status || 'pending',
        payment_method_details: pixData
      }
    };

    return new Response(JSON.stringify(successResponse), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});