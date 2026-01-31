import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = Deno.env.get('CLIENT_ID');
    const clientSecret = Deno.env.get('CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: 'Missing CLIENT_ID or CLIENT_SECRET in environment' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.cakto.com.br/public_api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
          }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return Response.json(
        { error: 'Cakto token request failed', status: response.status, data },
        { status: 502 }
      );
    }

    // Expected shape: { access_token, expires_in, token_type, ... }
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: error && error.message ? error.message : String(error) }, { status: 500 });
  }
});