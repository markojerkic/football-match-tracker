import dayjs from "dayjs";
import {
  ErrorBoundary,
  Match,
  Show,
  Suspense,
  Switch,
  createEffect,
  createMemo,
} from "solid-js";
import { isServer } from "solid-js/web";
import {
  A,
  RouteDataArgs,
  useRouteData,
  Outlet,
  Title,
  Meta,
  refetchRouteData,
  useLocation,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { AdminOnly } from "~/components/admin-only";
import gameDetail from "~/components/game-detail";
import { GameDetailWrapper } from "~/components/games";
import { FallbackLineup } from "~/components/lineup";
import { GameDataById, getGameDataById } from "~/server/games";
import { subscribeGame } from "~/server/pusher";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(([, id]) => getGameDataById(id), {
    key: () => ["game-data", params.id],
  });
};

const GameInfo = (gameData: GameDataById) => {
  const calendarDate = createMemo(() =>
    dayjs(gameData.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() =>
    dayjs(gameData.kickoffTime).format("HH:mm")
  );

  const result = () => {
    let homeTeamGoalCount = 0;
    let awayTeamGoalCount = 0;

    for (let goal of gameData.goals) {
      if (goal.isHomeTeamGoal) {
        homeTeamGoalCount++;
        continue;
      }
      awayTeamGoalCount++;
    }

    return `${homeTeamGoalCount} - ${awayTeamGoalCount}`;
  };

  createEffect(() => {
    if (!isServer) {
      console.log(import.meta.env);
      const subscription = subscribeGame(gameData.id, () => {
        refetchRouteData();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  });

  const location = useLocation();
  const isLineups = () => location.pathname.endsWith("/lineup");

  return (
    <>
      <div class="relative h-full w-full transform border-2 border-black bg-white">
        <div class="flex flex-col space-y-6 p-4">
          <span class="flex items-center justify-start space-x-4 text-sm">
            <span class="flex flex-col space-y-2">
              <A
                class="hover:link"
                href={`/competition/${gameData.competition?.id}/table/${gameData.season?.id}`}
              >
                {gameData.competition?.name} - {gameData.season?.title}
              </A>
              <span class="flex space-x-2">
                <span>{calendarDate()}</span>
                <span>{kickoffTime()}</span>
              </span>
            </span>

            <AdminOnly>
              <div class="flex grow justify-end">
                <A
                  href={`/admin/game/${gameData.id}`}
                  class="btn-outline btn-circle btn justify-self-end"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </A>
              </div>
            </AdminOnly>
          </span>
          <span class="flex w-full flex-col">
            <span class="flex w-full justify-center space-x-4">
              <A
                href={`/team/${gameData.homeTeam.id}`}
                class="flex items-center space-x-4 text-lg font-bold hover:link"
              >
                <img
                  src={gameData.homeTeam.imageSlug ?? "/shield.svg"}
                  class="avatar h-10 object-cover"
                />
                <span>{gameData.homeTeam.name}</span>
              </A>

              <span class="self-center text-lg font-semibold">{result()}</span>
              <A
                href={`/team/${gameData.awayTeam.id}`}
                class="flex items-center space-x-4 text-lg font-bold hover:link"
              >
                <span>{gameData.awayTeam.name}</span>
                <img
                  src={gameData.awayTeam.imageSlug ?? "/shield.svg"}
                  class="avatar h-10 object-cover"
                />
              </A>
            </span>
          </span>
        </div>
      </div>

      <ErrorBoundary
        fallback={() => (
          <GameDetailWrapper gameId={gameData.id}>
            <Show
              when={isLineups()}
              fallback={
                <div class="rounded-md bg-error p-4 text-white">
                  <span>
                    Error loading data for this tab. Try another tab or another
                    game.
                  </span>
                </div>
              }
            >
              <Suspense fallback="Loading...">
                <div class="rounded-md bg-error p-4 text-white">
                  <span>
                    Lineups cannot be found. Here is a list of all awailable
                    players for that season.
                  </span>
                </div>
                <FallbackLineup
                  gameId={gameData.id}
                  homeTeam={gameData.homeTeam.name ?? ""}
                  awayTeam={gameData.awayTeam.name ?? ""}
                />
              </Suspense>
            </Show>
          </GameDetailWrapper>
        )}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default () => {
  const gameData = useRouteData<typeof routeData>();

  return (
    <>
      <Title>Game details</Title>
      <div class="flex flex-col space-y-4">
        <Show when={gameData()} keyed>
          {(gameData) => (
            <>
              <Title>
                {gameData.homeTeam.name} vs {gameData.awayTeam.name}
              </Title>
              <Meta
                name="description"
                content={`On ${gameData.kickoffTime.toLocaleString()}, ${
                  gameData.homeTeam.name
                } and ${
                  gameData.homeTeam.name
                } took each other on in a football game.`}
              />
              <GameInfo {...gameData} />
            </>
          )}
        </Show>
      </div>
    </>
  );
};
