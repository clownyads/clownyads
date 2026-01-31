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

    // Configurations to try (Prioritizing the one that worked: JSON Body + Trailing Slash)
    const configs = [
      // 1. JSON Body + Trailing Slash (Confirmed working)
      {
        name: "JSON Body + Trailing Slash",
        url: 'https://api.cakto.com.br/public_api/token/',
        init: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
          })
        }
      },
      // 2. Basic Auth + Trailing Slash (Backup)
      {
        name: "Basic Auth + Trailing Slash",
        url: 'https://api.cakto.com.br/public_api/token/',
        init: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          },
          body: new URLSearchParams({ grant_type: 'client_credentials' })
        }
      },
      // 3. Form Encoded + Trailing Slash + Scope (Backup)
      {
        name: "Form Encoded + Trailing Slash + Scope",
        url: 'https://api.cakto.com.br/public_api/token/',
        init: {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            scope: '*'
          })
        }
      },
      // 4. Form Encoded + Trailing Slash + NO grant_type (Implicit)
      {
        name: "Form Encoded + Trailing Slash + NO grant_type",
        url: 'https://api.cakto.com.br/public_api/token/',
        init: {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret
          })
        }
      },
      // 5. Query Params + Trailing Slash (Desperation)
      {
        name: "Query Params + Trailing Slash",
        url: `https://api.cakto.com.br/public_api/token/?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        init: {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      }
    ];

    const attempts = [];

    for (const config of configs) {
      console.log(`Trying auth config: ${config.name}`);
      try {
        const res = await fetch(config.url, config.init);
        const txt = await res.text();
        let json;
        try { json = JSON.parse(txt); } catch { json = { raw: txt }; }
        
        attempts.push({ name: config.name, status: res.status, response: json });

        if (res.ok && json.access_token) {
          console.log(`Success with config: ${config.name}`);
          return Response.json(json, { status: 200 });
        }
      } catch (err) {
        attempts.push({ name: config.name, error: err.message });
      }
    }

    return Response.json(
      { error: 'All Cakto token strategies failed', attempts },
      { status: 502 }
    );
  } catch (error) {
    return Response.json({ error: error && error.message ? error.message : String(error) }, { status: 500 });
  }
});