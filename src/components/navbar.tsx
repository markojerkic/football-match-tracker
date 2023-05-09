import { A } from "solid-start";
import { AdminOnly } from "./admin-only";

const User = () => (
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
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default () => {
  return (
    <nav
      aria-label="Site Nav"
      class="mx-auto flex max-w-3xl items-center justify-between p-4"
    >
      <A
        href="/"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
        end
      >
        <span class="sr-only">Logo</span>⚽
      </A>

      <ul class="flex items-center gap-2 text-sm font-medium text-gray-500">
        <li class="hidden lg:block">
          <A
            class="rounded-lg px-3 py-2"
            end
            activeClass="underline underline-offset-2"
            href="/"
          >
            {" "}
            Home{" "}
          </A>
        </li>

        <li>
          <A
            class="rounded-lg px-3 py-2"
            activeClass="underline underline-offset-2"
            href="/game"
            end
          >
            {" "}
            Games{" "}
          </A>
        </li>

        <AdminOnly>
          <li>
            <A
              class="rounded-lg px-3 py-2"
              activeClass="underline underline-offset-2"
              href="/admin/game"
              end
            >
              {" "}
              New Game{" "}
            </A>
          </li>
        </AdminOnly>

        <AdminOnly>
          <li>
            <A
              class="rounded-lg px-3 py-2"
              activeClass="underline underline-offset-2"
              href="/admin/player"
              end
            >
              {" "}
              New Player{" "}
            </A>
          </li>
        </AdminOnly>

        <AdminOnly>
          <li>
            <A
              class="rounded-lg px-3 py-2"
              activeClass="underline underline-offset-2"
              href="/admin/manager"
              end
            >
              {" "}
              New Manager{" "}
            </A>
          </li>
        </AdminOnly>

        <li>
          <A
            class="rounded-lg px-3 py-2"
            activeClass="underline underline-offset-2"
            href="/me"
            end
          >
            <User />
          </A>
        </li>
      </ul>
    </nav>
  );
};
