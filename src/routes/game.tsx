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
    <div class="flex justify-between space-y-4 px-4">
      <div class="flex max-h-[90vh] w-[50%] grow justify-center">
        <Show when={games()} keyed>
          {(games) => (
            <div class="w-full max-w-md overflow-y-scroll px-4">
              <GamesPage games={games} />
            </div>
          )}
        </Show>
      </div>
      <div class="w-[50%]">
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
