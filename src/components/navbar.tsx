import { A, createRouteAction } from "solid-start";
import { AdminOnly } from "./admin-only";
import { createServerAction$, redirect } from "solid-start/server";

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
  const [, { Form }] = createRouteAction(async (f: FormData) => {
    return redirect(`/search?q=${f.get("q")}`);
  });

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

        <Form class="relative duration-500 ease-in-out focus:w-full">
          <input
            type="text"
            placeholder="search"
            name="q"
            class="input w-4 duration-300 focus:w-full focus:outline-0"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-6 w-6"
            >
              <path
                fill-rule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input type="submit" class="hidden" />
        </Form>

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
