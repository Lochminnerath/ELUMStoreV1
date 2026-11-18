/// <reference types="vitest/config" />
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer, defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * content.json: what Store's home page says and shows, as built in (src/content/defaults.ts), with
 * the list of sections. The ELUM Console's Site section reads it to know what can be edited in
 * Store and what each part was to begin with. Served live in dev, written next to Store when it builds.
 */
async function contentJson(server?: ViteDevServer): Promise<string> {
  const own = !server;
  const s = server ?? (await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true }, appType: 'custom' }));
  try {
    const m = await s.ssrLoadModule('/src/content/defaults.ts');
    return JSON.stringify({ version: 1, site: 'store', sections: m.SECTIONS, symbols: [], defaults: m.DEFAULTS });
  } finally {
    if (own) await s.close();
  }
}

function storeContent(): Plugin {
  let outDir = 'dist';
  let root = process.cwd();
  return {
    name: 'elum-store-content',
    configResolved(c) {
      root = c.root;
      outDir = c.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use('/content.json', (_req, res) => {
        contentJson(server).then(
          (json) => {
            res.setHeader('content-type', 'application/json');
            res.setHeader('access-control-allow-origin', '*');
            res.end(json);
          },
          (e) => {
            res.statusCode = 500;
            res.end(String(e));
          },
        );
      });
    },
    async closeBundle() {
      writeFileSync(resolve(root, outDir, 'content.json'), await contentJson());
    },
  };
}

export default defineConfig({
  plugins: [react(), storeContent()],
  server: { port: 5178 },
  build: {
    rollupOptions: {
      output: {
        // React rarely changes, so it gets a long-lived chunk of its own.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|react-router)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
