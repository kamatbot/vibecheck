// Credentials remain in the same-origin service; this module handles UI state only.
export function createCoCreator({ refresh, apply, getConfig }) {
  const state = { connected: false, models: [], model: '', prompt: '', busy: '', error: '', flow: null, unavailable: false };
  let timer, generation = 0, polling = false;
  async function request(path, body) {
    let response;
    try {
      response = await fetch(`/api/chatgpt/${path}`, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: body === undefined ? {} : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(path === 'design' ? 120000 : 20000) });
    } catch { throw new Error('AI service unavailable. Try again.'); }
    let data;
    try { data = await response.json(); } catch { throw new Error('AI service unavailable. Try again.'); }
    if (!response.ok) throw new Error(response.status === 503 ? 'AI service unavailable. Try again.' : typeof data.error === 'string' ? data.error : 'The AI request could not be completed.');
    return data;
  }
  function stop() { clearTimeout(timer); generation++; state.flow = null; }
  function connected(data) {
    state.connected = data.connected === true || data.status === 'connected';
    state.models = Array.isArray(data.models) ? data.models.map(m => typeof m === 'string' ? { id: m, label: m } : m).filter(m => m && typeof m.id === 'string' && typeof m.label === 'string') : [];
    if (!state.models.some(m => m.id === state.model)) state.model = state.models[0]?.id || '';
  }
  async function status() {
    state.busy = 'status'; state.error = ''; refresh();
    try { connected(await request('status')); state.unavailable = false; }
    catch(error) { state.error = error.message; state.unavailable = true; }
    finally { state.busy = ''; refresh(); }
  }
  async function poll() {
    if (!state.flow || polling) return;
    clearTimeout(timer);
    const epoch = generation, flow = state.flow;
    if (Date.now() >= flow.deadline) { stop(); state.error = 'Connection expired. Connect again when ready.'; refresh(); return; }
    polling = true;
    try {
      const result = await request('poll', { flowId: flow.flowId });
      if (epoch !== generation) return;
      state.error = '';
      if (result.status === 'connected') { stop(); await status(); return; }
      if (result.status !== 'pending') throw new Error('Connection could not be completed. Please reconnect.');
      timer = setTimeout(poll, flow.interval);
    } catch(error) { if (epoch === generation) state.error = error.message; }
    finally { polling = false; refresh(); }
  }
  async function start() {
    stop(); const epoch = generation; state.busy = 'connect'; state.error = ''; refresh();
    try {
      const result = await request('start', {});
      if (epoch !== generation) return;
      const url = new URL(result.verificationUrl);
      if (url.href !== 'https://auth.openai.com/codex/device' || typeof result.flowId !== 'string' || typeof result.userCode !== 'string') throw new Error('The service returned an invalid connection link.');
      state.flow = { ...result, deadline: Date.now() + 15 * 60 * 1000, interval: Math.max(3000, Math.min(60000, (Number(result.intervalSeconds) || 5) * 1000)) };
      timer = setTimeout(poll, state.flow.interval);
    } catch(error) { state.error = error.message; }
    finally { state.busy = ''; refresh(); }
  }
  async function disconnect() {
    stop(); state.busy = 'disconnect'; state.error = ''; refresh();
    try { await request('disconnect', {}); connected({ connected: false }); }
    catch(error) { state.error = error.message; }
    finally { state.busy = ''; refresh(); }
  }
  async function generate() {
    if (!state.connected || !state.model || !state.prompt.trim() || state.busy) return;
    state.busy = 'generate'; state.error = ''; refresh();
    try { const result = await request('design', { prompt: state.prompt.trim().slice(0, 1000), config: getConfig(), model: state.model }); apply(result.config); }
    catch(error) { state.error = error.message; }
    finally { state.busy = ''; refresh(); }
  }
  window.addEventListener('beforeunload', stop);
  return { state, status, start, poll, disconnect, generate, cancel: disconnect };
}
