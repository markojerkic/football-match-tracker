import { ErrorBoundary, Show, Suspense } from "solid-js";
import { Outlet, useParams, useRouteData } from "solid-start";
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

  const paramId = useParams().id !== undefined;

  return (
    <div class="grid grid-cols-[auto,1fr,auto] grid-rows-[auto,1fr] space-y-4 overflow-x-clip px-4">
      <input
        type="checkbox"
        id="games-toggle"
        class="peer absolute hidden"
        checked={!paramId}
      />
      <label
        for="games-toggle"
        class="absolute top-0 z-10 rotate-0 self-start transition-all duration-500 peer-checked:rotate-180 md:hidden"
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

      <div class="fixed left-0 z-20 col-start-1 row-start-2 h-[120vh] w-full min-w-[300px] -translate-x-full space-y-4 overflow-auto bg-base-100 px-8 pt-8 pb-20 duration-300 ease-in-out peer-checked:translate-x-0 md:relative md:left-auto md:top-auto md:translate-x-0 md:pb-8">
          <Show when={games()} keyed>
            {(games) => (
              <div class="mx-auto max-h-full w-full max-w-md overflow-y-scroll px-4">
                <GamesPage games={games} />
              </div>
            )}
          </Show>
      </div>

      <div class="col-start-2 row-start-2 h-full w-10 place-self-center overflow-auto md:min-w-full lg:min-w-[50rem] md:max-w-3xl">
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
