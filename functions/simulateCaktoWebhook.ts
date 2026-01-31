import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
        }

        const { email, event, plan } = await req.json();

        if (!email || !event) {
            return Response.json({ error: 'Email and event are required' }, { status: 400 });
        }

        // Get the webhook secret to sign the request
        const webhookSecret = Deno.env.get('CAKTO_WEBHOOK_SECRET');
        if (!webhookSecret) {
            return Response.json({ error: 'CAKTO_WEBHOOK_SECRET not set' }, { status: 500 });
        }

        // Determine offer name based on plan
        let offerName = "Oferta Padrão";
        if (plan === 'NOVATO') offerName = "Oferta Novato";
        else if (plan === 'CABULOSO') offerName = "Oferta Cabuloso";
        else if (plan === 'MESTRE') offerName = "Oferta Mestre";

        // Construct the payload exactly as Cakto sends it
        const payload = {
            secret: webhookSecret,
            event: event,
            data: {
                id: `test_trans_${Date.now()}`,
                amount: 99.90,
                status: event.includes('approved') ? 'approved' : 'refused',
                customer: {
                    email: email,
                    name: "Test User",
                    cpf: "000.000.000-00",
                    phone: "11999999999"
                },
                offer: {
                    hash: "test_offer_hash",
                    name: offerName
                },
                product: {
                    name: "ClownyAds Pro"
                },
                paymentMethod: "credit_card"
            }
        };

        // Call the webhook function via its public URL
        const appId = Deno.env.get("BASE44_APP_ID");
        const webhookUrl = `https://${appId}.base44.app/functions/caktoWebhook`;

        console.log(`Simulating webhook to: ${webhookUrl}`);

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        return Response.json({
            success: true,
            simulated_payload: payload,
            webhook_response: result,
            webhook_status: response.status
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});