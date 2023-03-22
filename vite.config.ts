import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    /*
    solid({
      ssr: true,
    }),
    */
    solid({
      islands: true,
    }),
  ],
  ssr: { external: ["@prisma/client"] },
});
