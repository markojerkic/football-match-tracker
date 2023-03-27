import solid from "solid-start/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [
    /*
    solid({
      ssr: true,
    }),
    */
    solid({
      adapter: vercel({
        prerender: {
          expiration: 60
        }
      })
    }),
  ],
  ssr: { external: ["@prisma/client"] },
});
