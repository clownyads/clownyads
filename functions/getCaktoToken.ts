import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Only authenticated users (likely app proxy) can call this
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = (Deno.env.get('CLIENT_ID') || '').trim();
    const clientSecret = (Deno.env.get('CLIENT_SECRET') || '').trim();

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: 'Missing CLIENT_ID or CLIENT_SECRET' },
        { status: 500 }
      );
    }

    // Official Cakto Auth Flow
    // URL: https://api.cakto.com.br/public_api/token/
    // Method: POST
    // Content-Type: application/x-www-form-urlencoded
    // Body: client_id, client_secret

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch('https://api.cakto.com.br/public_api/token/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cakto Token Error:', JSON.stringify(data));
      return Response.json({ error: data.error || 'Failed to retrieve token', details: data }, { status: response.status });
    }

    return Response.json(data);

  } catch (error) {
    console.error('Cakto Token Exception:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});