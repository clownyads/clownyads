import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { addDays, addMonths, addYears } from 'npm:date-fns';

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

        const eventType = webhookData.event || webhookData.type;
        const email = webhookData.customer?.email || webhookData.email;
        const productName = webhookData.product?.name || webhookData.plan;
        const amount = webhookData.amount || webhookData.value || 0;
        const transactionId = webhookData.transaction_id || webhookData.id;
        
        if (!email) {
            console.error('Email não encontrado no webhook');
            return Response.json(
                { success: false, error: 'Email não encontrado' },
                { status: 400, headers: corsHeaders }
            );
        }

        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (!users || users.length === 0) {
            console.error('Usuário não encontrado:', email);
            return Response.json(
                { success: false, error: 'Usuário não encontrado' },
                { status: 404, headers: corsHeaders }
            );
        }
        let user = users[0];

        let userPlan = user.plan;
        let planExpiresAt = user.plan_expires_at;
        const now = new Date();

        switch (eventType) {
            case 'purchase_approved':
            case 'payment.approved':
            case 'payment.confirmed':
            case 'subscription_created':
            case 'subscription_renewed':
                if (productName?.includes('NOVATO') || productName?.includes('Novato')) {
                    userPlan = 'NOVATO';
                    planExpiresAt = addDays(now, 7).toISOString();
                } else if (productName?.includes('CABULOSO') || productName?.includes('Cabuloso')) {
                    userPlan = 'CABULOSO';
                    planExpiresAt = addMonths(now, 1).toISOString();
                } else if (productName?.includes('MESTRE') || productName?.includes('Mestre')) {
                    userPlan = 'MESTRE';
                    planExpiresAt = addYears(now, 1).toISOString();
                }
                
                await base44.asServiceRole.entities.User.update(user.id, {
                    plan: userPlan,
                    plan_updated_at: now.toISOString(),
                    plan_expires_at: planExpiresAt
                });
    
                console.log(`Plano do usuário ${email} atualizado para ${userPlan}. Expira em ${planExpiresAt}`);
    
                await base44.asServiceRole.entities.Payment.create({
                    amount: amount / 100,
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
                    { success: true, message: 'Pagamento processado com sucesso', user_plan: userPlan },
                    { status: 200, headers: corsHeaders }
                );

            case 'purchase_refused':
            case 'subscription_canceled':
            case 'subscription_renewal_refused':
            case 'chargeback':
            case 'refund':
                await base44.asServiceRole.entities.User.update(user.id, {
                    plan: 'FREE',
                    plan_updated_at: now.toISOString(),
                    plan_expires_at: now.toISOString()
                });
                console.log(`Plano do usuário ${email} alterado para FREE devido ao evento ${eventType}`);

                await base44.asServiceRole.entities.Payment.create({
                    amount: amount / 100,
                    currency: 'BRL',
                    status: eventType.replace(/_/g, '.'),
                    transactionId: transactionId,
                    userId: user.id,
                    plan: userPlan,
                    paymentMethod: webhookData.payment_method || 'unknown',
                    metadata: JSON.stringify(webhookData)
                });

                return Response.json(
                    { success: true, message: 'Plano revogado com sucesso', user_plan: 'FREE' },
                    { status: 200, headers: corsHeaders }
                );

            default:
                console.log(`Evento ${eventType} recebido, mas não há lógica para ele.`);
                return Response.json(
                    { success: true, message: 'Evento recebido mas não processado' },
                    { status: 200, headers: corsHeaders }
                );
        }

    } catch (error) {
        console.error('Erro no webhook Cakto:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
});