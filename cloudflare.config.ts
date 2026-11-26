import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(({ mode }) => ({
  worker: defineWorker({
    name: "ses-official",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-26",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv(),
      MEDIA: bindings.r2({
        name: "ses-official-media",
        dev: { remote: mode === "remote-media" },
      }),
      DB: bindings.d1({
        name: "ses-official-db",
        id: "db493d58-f656-4b8e-b776-edd9e5f4b1ed",
      }),
    },
  }),
}));
