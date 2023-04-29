import solid from "solid-start/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";
import devtools from "solid-devtools/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    solid({
      ...(command === "serve"
        ? {}
        : {
            adapter: vercel({}),
          }),
    }),
    devtools(),
  ],
  ssr: { external: ["@prisma/client"] },
}));
