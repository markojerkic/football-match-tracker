import { mount, StartClient } from "solid-start/entry-client";
// @ts-expect-error importing Nprogress
import Nprogress from "nprogress";

mount(() => <StartClient />, document);

// @ts-expect-error Router not windw variable
window.ROUTER.addEventListener("navigation-start", (e) => {
  Nprogress.start();
});

// @ts-expect-error Router not windw variable
window.ROUTER.addEventListener("navigation-end", (e) => {
  Nprogress.done();
});

// @ts-expect-error Router not windw variable
window.ROUTER.addEventListener("navigation-error", (e) => {
  Nprogress.done();
});
