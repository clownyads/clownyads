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
        
        // Pegar token da URL (se houver)
        const url = new URL(req.url);
        const querySecret = url.searchParams.get('token') || url.searchParams.get('secret');

        // Pegar o corpo da requisição
        const body = await req.text();
        let webhookData = {};
        try {
            webhookData = JSON.parse(body);
        } catch (e) {
            console.log('Corpo da requisição não é JSON válido ou está vazio');
        }

        // Validar a chave secreta do webhook (prioridade para o body, fallback para URL)
        const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
        const receivedSecret = webhookData.secret || querySecret;

        if (receivedSecret !== webhookSecret) {
            console.error('Webhook secret inválido. Recebido:', receivedSecret);
            return Response.json(
                { success: false, error: 'Webhook secret inválido' },
                { status: 401, headers: corsHeaders }
            );
        }

        console.log('Webhook Cakto recebido:', JSON.stringify(webhookData, null, 2));

        const eventType = webhookData.event;
        const email = webhookData.data?.customer?.email;
        const offerName = webhookData.data?.offer?.name;
        const productName = webhookData.data?.product?.name;
        const amount = webhookData.data?.amount || 0;
        const transactionId = webhookData.data?.id;
        
        if (!email) {
            console.error('Email não encontrado no webhook');
            return Response.json(
                { success: false, error: 'Email não encontrado' },
                { status: 400, headers: corsHeaders }
            );
        }

        let users = await base44.asServiceRole.entities.User.filter({ email });
        let user;
        let isNewUser = false;

        if (!users || users.length === 0) {
            console.log('Usuário não encontrado, criando convite:', email);
            
            // Convidar o usuário para criar a conta
            await base44.users.inviteUser(email, "user");
            console.log('Convite enviado para:', email);
            
            isNewUser = true;
            
            // Aguardar um pouco para o usuário ser criado
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Buscar o usuário recém-criado
            users = await base44.asServiceRole.entities.User.filter({ email });
            if (!users || users.length === 0) {
                console.error('Erro ao criar usuário:', email);
                return Response.json(
                    { success: false, error: 'Erro ao criar usuário' },
                    { status: 500, headers: corsHeaders }
                );
            }
        }
        
        user = users[0];

        let userPlan = user.plan;
        let planExpiresAt = user.plan_expires_at;
        const now = new Date();

        switch (eventType) {
            case 'purchase_approved':
            case 'subscription_created':
            case 'subscription_renewed':
                // Verificar nome da oferta ou produto
                const fullName = `${offerName} ${productName}`.toLowerCase();
                
                if (fullName.includes('novato')) {
                    userPlan = 'NOVATO';
                    planExpiresAt = addDays(now, 7).toISOString();
                } else if (fullName.includes('cabuloso')) {
                    userPlan = 'CABULOSO';
                    planExpiresAt = addMonths(now, 1).toISOString();
                } else if (fullName.includes('mestre')) {
                    userPlan = 'MESTRE';
                    planExpiresAt = addYears(now, 1).toISOString();
                } else {
                    console.warn('Plano não identificado. Oferta:', offerName, 'Produto:', productName);
                    userPlan = 'CABULOSO'; // Fallback para o plano mais popular
                    planExpiresAt = addMonths(now, 1).toISOString();
                }
                
                await base44.asServiceRole.entities.User.update(user.id, {
                    plan: userPlan,
                    plan_updated_at: now.toISOString(),
                    plan_expires_at: planExpiresAt
                });
    
                console.log(`Plano do usuário ${email} atualizado para ${userPlan}. Expira em ${planExpiresAt}`);
    
                await base44.asServiceRole.entities.Payment.create({
                    amount: amount,
                    currency: 'BRL',
                    status: 'approved',
                    transactionId: transactionId,
                    userId: user.id,
                    plan: userPlan,
                    paymentMethod: webhookData.data?.paymentMethod || 'unknown'
                });
    
                console.log(`Pagamento registrado para usuário ${email}`);

                // Enviar e-mail de acesso usando Gmail OAuth
                try {
                    const planNames = {
                        'NOVATO': 'Novato (Semanal)',
                        'CABULOSO': 'Cabuloso (Mensal)',
                        'MESTRE': 'Mestre (Anual)'
                    };

                    const accessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');

                    const htmlBody = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0D; color: #fff; padding: 40px 20px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #39FF14; margin: 0;">🎪 ClownyAds</h1>
                            </div>

                            <div style="background: linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(191, 0, 255, 0.1) 100%); border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                                <h2 style="color: #39FF14; margin-top: 0;">Pagamento Confirmado! ✅</h2>
                                <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                                    Olá <strong>${user.full_name || 'Cliente'}</strong>,
                                </p>
                                <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                                    Seu pagamento foi confirmado com sucesso e seu acesso ao plano <strong style="color: #39FF14;">${planNames[userPlan] || userPlan}</strong> está ativo!
                                </p>
                            </div>

                            <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                                <h3 style="color: #39FF14; margin-top: 0;">🚀 Como acessar a plataforma:</h3>
                                ${isNewUser ? `
                                <div style="background-color: rgba(57, 255, 20, 0.1); border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                    <p style="color: #39FF14; font-size: 14px; margin: 0; font-weight: bold;">
                                        ⚠️ IMPORTANTE: Você receberá um e-mail separado da plataforma ClownyAds com um link para criar sua senha de acesso.
                                    </p>
                                    <p style="color: #fff; font-size: 13px; margin: 8px 0 0 0;">
                                        Verifique sua caixa de entrada (e spam) para o e-mail com o assunto "Convite para acessar ClownyAds".
                                    </p>
                                </div>
                                ` : ''}
                                <ol style="color: #fff; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                                    <li>${isNewUser ? 'Verifique seu e-mail e clique no link de convite para criar sua senha' : 'Acesse: <a href="https://clownyads.base44.com" style="color: #39FF14; text-decoration: none;">https://clownyads.base44.com</a>'}</li>
                                    <li>${isNewUser ? 'Crie sua senha de acesso' : 'Faça login com seu e-mail: <strong style="color: #39FF14;">' + email + '</strong>'}</li>
                                    <li>${isNewUser ? 'Acesse: <a href="https://clownyads.base44.com" style="color: #39FF14; text-decoration: none;">https://clownyads.base44.com</a>' : 'Use sua senha'}</li>
                                </ol>
                            </div>

                            <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                                <h3 style="color: #39FF14; margin-top: 0;">📊 Detalhes da sua assinatura:</h3>
                                <table style="width: 100%; color: #fff; font-size: 14px;">
                                    <tr>
                                        <td style="padding: 8px 0;">Plano:</td>
                                        <td style="padding: 8px 0; text-align: right;"><strong style="color: #39FF14;">${planNames[userPlan] || userPlan}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">Validade:</td>
                                        <td style="padding: 8px 0; text-align: right;"><strong>${new Date(planExpiresAt).toLocaleDateString('pt-BR')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">E-mail:</td>
                                        <td style="padding: 8px 0; text-align: right;"><strong>${email}</strong></td>
                                    </tr>
                                </table>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://clownyads.base44.com" style="display: inline-block; background: linear-gradient(90deg, #39FF14 0%, #BF00FF 100%); color: #000; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                    Acessar Plataforma Agora 🚀
                                </a>
                            </div>

                            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #888; font-size: 13px;">
                                <p>Precisa de ajuda? Responda este e-mail ou entre em contato conosco.</p>
                                <p style="margin-top: 10px;">© ${new Date().getFullYear()} ClownyAds. Todos os direitos reservados.</p>
                            </div>
                        </div>
                    `;

                    // Criar o e-mail no formato RFC 2822
                    const emailContent = [
                        'Content-Type: text/html; charset=utf-8',
                        'MIME-Version: 1.0',
                        `To: ${email}`,
                        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent('🎉 Bem-vindo ao ClownyAds! Seu acesso está liberado')))}?=`,
                        '',
                        htmlBody
                    ].join('\r\n');

                    const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
                        .replace(/\+/g, '-')
                        .replace(/\//g, '_')
                        .replace(/=+$/, '');

                    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            raw: encodedEmail
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Gmail API error: ${response.status}`);
                    }

                    console.log(`E-mail de acesso enviado via Gmail para ${email}`);
                } catch (emailError) {
                    console.error('Erro ao enviar e-mail de acesso:', emailError);
                    // Não falha a transação se o e-mail falhar
                }

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
                    amount: amount,
                    currency: 'BRL',
                    status: eventType.replace(/_/g, '.'),
                    transactionId: transactionId,
                    userId: user.id,
                    plan: userPlan,
                    paymentMethod: webhookData.data?.paymentMethod || 'unknown'
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