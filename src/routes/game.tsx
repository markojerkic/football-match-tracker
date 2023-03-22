import { Show } from "solid-js";
import { Outlet, unstable_island, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGames } from "~/server/games";

export const routeData = () => {
  const gamesFirstPage = createServerData$(
    () => {
      return getGames();
    },
    { key: () => ["games-first-page"] }
  );

  return gamesFirstPage;
};

const GamesPage = unstable_island(() => import("../components/games"));

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div class="flex justify-between space-y-4 px-4">
      <div class="flex w-[50%] grow justify-center">
        <Show when={games()} keyed>
          {(games) => (
            <div class="w-full max-w-md">
              <GamesPage games={games} />
            </div>
          )}
        </Show>
      </div>
      <div class="w-[50%]">
        <Outlet />
      </div>
    </div>
  );
};
