import solid from "solid-start/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";

export default defineConfig(({ mode, command }) => ({
  plugins: [
    /*
    solid({
      ssr: true,
    }),
    */
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
