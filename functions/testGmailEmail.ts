import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Verificar autenticação do admin
        const user = await base44.auth.me();
        if (user?.role !== 'admin') {
            return Response.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        // Pegar o e-mail de destino do body
        const { email, plan } = await req.json();
        
        if (!email) {
            return Response.json(
                { error: 'E-mail é obrigatório' },
                { status: 400 }
            );
        }

        const testPlan = plan || 'CABULOSO';
        const planNames = {
            'NOVATO': 'Novato (Semanal)',
            'CABULOSO': 'Cabuloso (Mensal)',
            'MESTRE': 'Mestre (Anual)'
        };

        // Obter access token do Gmail
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0D; color: #fff; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #39FF14; margin: 0;">🎪 ClownyAds</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(191, 0, 255, 0.1) 100%); border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="color: #39FF14; margin-top: 0;">✅ E-mail de Teste - Gmail OAuth</h2>
                    <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                        Este é um e-mail de teste para validar a integração com Gmail OAuth.
                    </p>
                    <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                        Plano simulado: <strong style="color: #39FF14;">${planNames[testPlan] || testPlan}</strong>
                    </p>
                </div>

                <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <h3 style="color: #39FF14; margin-top: 0;">🚀 Como acessar a plataforma:</h3>
                    <ol style="color: #fff; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                        <li>Acesse: <a href="https://clownyads.pro/login" style="color: #39FF14; text-decoration: none;">https://clownyads.pro/login</a></li>
                        <li>Faça login com seu e-mail</li>
                        <li>Use a senha que você criou no checkout</li>
                    </ol>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://clownyads.pro/login" style="display: inline-block; background: linear-gradient(90deg, #39FF14 0%, #BF00FF 100%); color: #000; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Acessar Plataforma Agora 🚀
                    </a>
                </div>

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #888; font-size: 13px;">
                    <p>Este é um e-mail de teste enviado via Gmail OAuth</p>
                    <p style="margin-top: 10px;">© ${new Date().getFullYear()} ClownyAds. Todos os direitos reservados.</p>
                </div>
            </div>
        `;

        // Criar o e-mail no formato RFC 2822
        const emailContent = [
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `To: ${email}`,
            `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent('🧪 [TESTE] Bem-vindo ao ClownyAds! Seu acesso está liberado')))}?=`,
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
            const errorData = await response.text();
            throw new Error(`Gmail API error: ${response.status} - ${errorData}`);
        }

        const result = await response.json();

        return Response.json({
            success: true,
            message: 'E-mail de teste enviado com sucesso via Gmail OAuth!',
            messageId: result.id,
            recipient: email
        });

    } catch (error) {
        console.error('Erro ao enviar e-mail de teste:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
});