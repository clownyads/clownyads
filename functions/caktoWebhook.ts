import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Webhook-Signature',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders, status: 204 });
    }

    try {
        const base44 = createClientFromRequest(req);
        
        // Pegar o corpo da requisição
        const body = await req.text();
        const webhookData = JSON.parse(body);

        // Validar a chave secreta do webhook
        const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
        const signature = req.headers.get('X-Webhook-Signature') || webhookData.webhook_secret;

        if (signature !== webhookSecret) {
            console.error('Webhook signature inválida');
            return Response.json(
                { success: false, error: 'Webhook signature inválida' },
                { status: 401, headers: corsHeaders }
            );
        }

        console.log('Webhook Cakto recebido:', webhookData);

        // Identificar o tipo de evento
        const eventType = webhookData.event || webhookData.type;
        const status = webhookData.status;
        const email = webhookData.customer?.email || webhookData.email;
        const plan = webhookData.product?.name || webhookData.plan || 'CABULOSO';
        const amount = webhookData.amount || webhookData.value || 0;
        const transactionId = webhookData.transaction_id || webhookData.id;

        // Processar apenas pagamentos aprovados/confirmados
        if (eventType === 'payment.approved' || eventType === 'payment.confirmed' || status === 'approved' || status === 'paid') {
            
            if (!email) {
                console.error('Email não encontrado no webhook');
                return Response.json(
                    { success: false, error: 'Email não encontrado' },
                    { status: 400, headers: corsHeaders }
                );
            }

            // Buscar o usuário pelo email usando service role
            const users = await base44.asServiceRole.entities.User.filter({ email });

            if (!users || users.length === 0) {
                console.error('Usuário não encontrado:', email);
                return Response.json(
                    { success: false, error: 'Usuário não encontrado' },
                    { status: 404, headers: corsHeaders }
                );
            }

            const user = users[0];

            // Determinar o plano baseado no nome do produto
            let userPlan = 'FREE';
            if (plan.includes('NOVATO') || plan.includes('Novato')) {
                userPlan = 'NOVATO';
            } else if (plan.includes('CABULOSO') || plan.includes('Cabuloso')) {
                userPlan = 'CABULOSO';
            } else if (plan.includes('MESTRE') || plan.includes('Mestre')) {
                userPlan = 'MESTRE';
            }

            // Atualizar o plano do usuário
            await base44.asServiceRole.entities.User.update(user.id, {
                plan: userPlan,
                plan_updated_at: new Date().toISOString()
            });

            console.log(`Plano do usuário ${email} atualizado para ${userPlan}`);

            // Registrar o pagamento na entidade Payment
            await base44.asServiceRole.entities.Payment.create({
                amount: amount / 100, // Converter centavos para reais
                currency: 'BRL',
                status: 'approved',
                transactionId: transactionId,
                userId: user.id,
                plan: userPlan,
                paymentMethod: webhookData.payment_method || 'unknown',
                metadata: JSON.stringify(webhookData)
            });

            console.log(`Pagamento registrado para usuário ${email}`);

            return Response.json(
                { 
                    success: true, 
                    message: 'Pagamento processado com sucesso',
                    user_plan: userPlan
                },
                { status: 200, headers: corsHeaders }
            );
        }

        // Para outros eventos, apenas retornar sucesso
        return Response.json(
            { success: true, message: 'Evento recebido mas não processado' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('Erro no webhook Cakto:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
});