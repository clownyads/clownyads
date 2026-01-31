import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint, method = 'GET', query = {}, payload } = await req.json().catch(() => ({ }));

    if (!endpoint || typeof endpoint !== 'string') {
      return Response.json({ error: 'Missing or invalid "endpoint"' }, { status: 400 });
    }

    // Basic hardening: block absolute URLs and path traversal
    if (endpoint.includes('://') || endpoint.includes('..')) {
      return Response.json({ error: 'Invalid endpoint path' }, { status: 400 });
    }

    // Get OAuth2 token via existing function (server-to-server)
    const tokenResp = await base44.functions.invoke('getCaktoToken', {});
    const { access_token, token_type } = tokenResp.data || {};

    if (!access_token) {
      return Response.json({ error: 'Failed to obtain access token', details: tokenResp.data }, { status: 502 });
    }

    const baseUrl = 'https://api.cakto.com.br/public_api/';
    const cleanEndpoint = endpoint.replace(/^\/+/, '');

    // Build query string
    const qp = new URLSearchParams();
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qp.append(String(k), String(v));
    });
    const qs = qp.toString();

    const url = baseUrl + cleanEndpoint + (qs ? `?${qs}` : '');

    const headers = new Headers({
      'Authorization': `${token_type || 'Bearer'} ${access_token}`,
    });

    let body: BodyInit | undefined = undefined;

    if (payload !== undefined && method.toUpperCase() !== 'GET') {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(payload);
    }

    const upstream = await fetch(url, {
      method,
      headers,
      body,
    });

    const text = await upstream.text();

    // Try to return JSON if possible
    try {
      const json = JSON.parse(text);
      return Response.json(json, { status: upstream.status });
    } catch {
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'text/plain' },
      });
    }
  } catch (error) {
    return Response.json({ error: error && (error as Error).message ? (error as Error).message : String(error) }, { status: 500 });
  }
});