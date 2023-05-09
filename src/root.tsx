// @refresh reload
import "nprogress/nprogress.css";
import { Suspense, createEffect } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useIsRouting,
} from "solid-start";
import "./root.css";
import Navbar from "~/components/navbar";
// @ts-expect-error importing
import Nprogress from "nprogress";

export default function Root() {
  const isRouting = useIsRouting();
  createEffect(() => {
    const routing = isRouting();
    if (routing) {
      Nprogress.start();
    } else {
      Nprogress.done();
    }
  });

  return (
    <Html lang="en" data-theme="corporate">
      <Head>
        <Title>Football tracker</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="flex flex-col space-y-4 py-4">
        <ErrorBoundary>
          <Navbar  />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <FileRoutes />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
