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

    const basic = btoa(`${clientId}:${clientSecret}`);
    const tokenUrl = 'https://api.cakto.com.br/public_api/token/';

    const attempt = async (init) => {
      const res = await fetch(tokenUrl, init);
      const txt = await res.text();
      let json;
      try { json = JSON.parse(txt); } catch { json = { raw: txt }; }
      return { res, json };
    };

    // Attempt 1: form-encoded with client_id/secret (as per docs)
    let { res, json } = await attempt({
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret })
    });

    if (res.ok) {
      return Response.json(json, { status: 200 });
    }

    // Attempt 2: Basic auth + grant_type=client_credentials
    if (json?.error === 'unsupported_grant_type' || res.status === 400) {
      const basic = btoa(`${clientId}:${clientSecret}`);
      ({ res, json } = await attempt({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basic}`,
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' })
      }));
      if (res.ok) {
        return Response.json(json, { status: 200 });
      }
    }

    // Attempt 3: grant_type in body + client creds in body
    if (json?.error === 'unsupported_grant_type' || res.status === 400) {
      ({ res, json } = await attempt({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        })
      }));
      if (res.ok) {
        return Response.json(json, { status: 200 });
      }
    }

    return Response.json(
      { error: 'Cakto token request failed', status: res.status, data: json },
      { status: 502 }
    );
  } catch (error) {
    return Response.json({ error: error && error.message ? error.message : String(error) }, { status: 500 });
  }
});