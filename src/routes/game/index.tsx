import { Show } from "solid-js";
import { unstable_island, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGames } from "~/server/games";

export const routeData = () => {
  const gamesFirstPage = createServerData$(() => {
    return getGames();
  }, { key: () => ["games-first-page"] });


  return gamesFirstPage;
};

const GamesPage = unstable_island(() => import('../../components/games'));

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div
      class="flex flex-col place-items-center space-y-4"
    >
      {JSON.stringify(games)}
      <Show when={games()} keyed>
        {(games) =>
          <div class="w-full max-w-md">
            <GamesPage games={games} />
          </div>
        }
      </Show>
    </div>
  );
};

