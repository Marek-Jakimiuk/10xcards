/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://10xcards-4vw.pages.dev", // Your Cloudflare Pages domain
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
      SUPABASE_KEY: envField.string({ context: "server", access: "secret" }),
      OPENROUTER_API_KEY: envField.string({ context: "server", access: "secret" }),
    },
  },
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  experimental: {
    session: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
