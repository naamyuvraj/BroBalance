import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode — required for Capacitor (no server bundle, outputs index.html)
  ssr: false,
  prerender: ["/"],
} satisfies Config;
