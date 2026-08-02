/**
 * AgentSam lab Worker — serves static prototype/lab assets + health.
 * Domain: agentsam.inneranimalmedia.com (separate from inneranimalmedia Worker).
 */

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health' || url.pathname === '/health') {
      const version = env.CF_VERSION_METADATA || {};
      return json({
        ok: true,
        service: 'agentsam',
        surface: 'lab',
        git_sha: env.GIT_SHA || null,
        version_id: version.id || null,
        timestamp: Math.floor(Date.now() / 1000),
      });
    }

    if (!env.ASSETS) {
      return json({ ok: false, error: 'assets_binding_missing' }, 500);
    }

    return env.ASSETS.fetch(request);
  },
};
