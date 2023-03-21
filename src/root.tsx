// @refresh reload
import { Suspense } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const Navbar = () => {
  return (
    <div class="navbar mx-auto w-[98%] rounded-lg bg-secondary px-2 text-white">
      <div class="flex-1">
        <A href="/" class="btn-ghost btn rounded-lg text-xl normal-case">footyTracker</A>
        <A href="/game" class="btn-ghost btn rounded-lg text-xl normal-case">Games list</A>
      </div>
      <div class="flex-none">
        <div class="dropdown-end dropdown">
          <label tabIndex={0} class="btn-ghost btn-circle btn">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>

              <span class="badge badge-sm indicator-item">8</span>
            </div>
          </label>
          <div
            tabIndex={0}
            class="card dropdown-content card-compact mt-3 w-52 bg-base-100 text-neutral-focus shadow"
          >
            <div class="card-body">
              <span class="text-lg font-bold">8 Items</span>
              <span class="text-info">Subtotal: $999</span>
              <div class="card-actions">
                <button class="btn-primary btn-block btn">View cart</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown-end dropdown text-neutral-focus">
          <label tabIndex={0} class="btn-ghost btn-circle avatar btn">
            <div class="w-10 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function Root() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

  return (
    <Html lang="en" data-theme="corporate">
      <Head>
        <Title>Football tracker</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="flex flex-col space-y-4 py-4">
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Suspense>
              <Navbar />
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </QueryClientProvider>
        <Scripts />
      </Body>
    </Html>
  );
}
