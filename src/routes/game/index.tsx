import { Show } from "solid-js";
import { unstable_island, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGames } from "~/server/games";

export const routeData = () => {
  const gamesFirstPage = createServerData$(() => {
    return getGames();
  }, { key: () => ["games-first-page"] });


  //const gamesPage = createInfiniteQuery(
  //  () => ["games-list"],
  //  async ({ pageParam = undefined as string | undefined }) => {
  //    return getGames(pageParam);
  //  },
  //  {
  //    getNextPageParam: (lastGamesPage: Game[]) => getLastId(lastGamesPage),
  //    suspense: true,
  //    keepPreviousData: true,
  //    enabled: !isServer,
  //    initialData: () => {
  //      const data = gamesFirstPage();
  //      const lastId = getLastId(data ?? []);
  //      return {
  //        pageParams: [lastId],
  //        pages: [data]
  //      } as InfiniteData<Game[]>
  //    }
  //  }
  //);


  return gamesFirstPage;
};

const GamesPage = unstable_island(() => import('../../components/games'));

export default () => {
  const games = useRouteData<typeof routeData>();
  //const mergedLists = createMemo(() => (games.data?.pages ?? [[]]).flat());

  return (
    <div
      class="flex flex-col place-items-center space-y-4"
    >
      {JSON.stringify(games)}
      <Show when={games()} keyed>
        {(games) =>
          <GamesPage games={games} />
        }
      </Show>
    </div>
  );
};

