import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { addDays, addMonths, addYears } from 'npm:date-fns';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { email, plan } = await req.json();

        if (!email || !plan) {
            return Response.json({ error: 'Email e plano são obrigatórios' }, { status: 400 });
        }

        // Verificar se o usuário já existe
        let users = await base44.asServiceRole.entities.User.filter({ email });
        let targetUser;
        let isNewUser = false;

        if (!users || users.length === 0) {
            console.log('Usuário não encontrado, criando convite:', email);
            await base44.users.inviteUser(email, "user");
            console.log('Convite enviado para:', email);
            isNewUser = true;
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            users = await base44.asServiceRole.entities.User.filter({ email });
            if (!users || users.length === 0) {
                console.log('Tentando buscar novamente...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                users = await base44.asServiceRole.entities.User.filter({ email });
                
                if (!users || users.length === 0) {
                    return Response.json({ 
                        error: 'Usuário convidado mas ainda não apareceu no sistema. Verifique o email de convite.',
                        invited: true 
                    }, { status: 202 });
                }
            }
        }
        
        targetUser = users[0];

        // Definir data de expiração baseada no plano
        const now = new Date();
        let planExpiresAt;

        if (plan === 'NOVATO') {
            planExpiresAt = addDays(now, 7).toISOString();
        } else if (plan === 'CABULOSO') {
            planExpiresAt = addMonths(now, 1).toISOString();
        } else if (plan === 'MESTRE') {
            planExpiresAt = addYears(now, 1).toISOString();
        } else {
            return Response.json({ error: 'Plano inválido. Use: NOVATO, CABULOSO ou MESTRE' }, { status: 400 });
        }

        // Atualizar plano do usuário
        await base44.asServiceRole.entities.User.update(targetUser.id, {
            plan: plan,
            plan_updated_at: now.toISOString(),
            plan_expires_at: planExpiresAt
        });

        console.log(`Plano ${plan} concedido manualmente para ${email}`);

        // Enviar e-mail de boas-vindas
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
                        <h2 style="color: #39FF14; margin-top: 0;">Seu acesso foi liberado! ✅</h2>
                        <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                            Olá <strong>${targetUser.full_name || 'Cliente'}</strong>,
                        </p>
                        <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                            Seu acesso ao plano <strong style="color: #39FF14;">${planNames[plan]}</strong> está ativo!
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
                                <td style="padding: 8px 0; text-align: right;"><strong style="color: #39FF14;">${planNames[plan]}</strong></td>
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
            console.error('Erro ao enviar e-mail:', emailError);
        }

        return Response.json({
            success: true,
            message: `Acesso ao plano ${plan} concedido para ${email}`,
            plan: plan,
            expiresAt: planExpiresAt,
            isNewUser: isNewUser
        });

    } catch (error) {
        console.error('Erro ao conceder acesso:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});