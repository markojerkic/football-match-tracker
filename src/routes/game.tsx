import { ErrorBoundary, Show, Suspense } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGames } from "~/server/games";
import GamesPage from "~/components/games";

export const routeData = () => {
  const gamesFirstPage = createServerData$(
    () => {
      return getGames();
    },
    { key: () => ["games-first-page"] }
  );

  return gamesFirstPage;
};

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div class="flex justify-between space-y-4 overflow-x-clip px-4">
      <input type="checkbox" id="games-toggle" class="peer absolute hidden" />
      <label
        for="games-toggle"
        class="absolute top-0 z-10 rotate-180 self-start transition-all duration-500 peer-checked:rotate-0"
      >
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
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </label>

      <div class="mr-4 max-h-[150vh] w-full min-w-fit justify-center duration-500 ease-in-out peer-checked:hidden peer-checked:-translate-x-full md:mr-0 md:w-[50%]">
        <Show when={games()} keyed>
          {(games) => (
            <div class="mx-auto max-h-full w-full max-w-md overflow-y-scroll px-4">
              <GamesPage games={games} />
            </div>
          )}
        </Show>
      </div>

      <div class="mx-auto w-[90%] max-w-3xl grow md:w-[50%]">
        <ErrorBoundary
          fallback={
            <div class="h-52 w-full bg-red-200">Error loading data</div>
          }
        >
          <Suspense fallback={<p>Loading...</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
