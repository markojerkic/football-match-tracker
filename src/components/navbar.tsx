import { A } from "solid-start";

export default () => {
  return (
    <nav
      aria-label="Site Nav"
      class="mx-auto flex max-w-3xl items-center justify-between p-4"
    >
      <A
        href="/"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"
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
          >
            {" "}
            Games{" "}
          </A>
        </li>
      </ul>
    </nav>
  );
};
