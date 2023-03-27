import solid from "solid-start/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";

export default defineConfig(({ command }) => ({
  plugins: [
    solid({
      ...(command === "serve"
        ? {}
        : {
            adapter: vercel({}),
          }),
    }),
  ],
  ssr: { external: ["@prisma/client"] },
}));
