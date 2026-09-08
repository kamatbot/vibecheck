import { createServer } from 'vite';
import { createApp } from './index.js';

const api = createApp();
let vite;
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await vite?.close();
  api.closeAllConnections();
  await new Promise(resolve => api.close(resolve));
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => { void close().then(() => process.exit(0)); });
}
try {
  await new Promise((resolve, reject) => {
    api.once('error', reject);
    api.listen(8794, '127.0.0.1', resolve);
  });
  vite = await createServer({ server: { host: '127.0.0.1', port: 8793, strictPort: true } });
  await vite.listen();
  vite.printUrls();
} catch (error) {
  console.error(`Twin Studio could not start: ${error.message}`);
  await close();
  process.exitCode = 1;
}
