import dayjs from "dayjs";
import { ErrorBoundary, Show, Suspense, createMemo } from "solid-js";
import { A, RouteDataArgs, useMatch, useRouteData, Outlet } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { GameDataById, getGameDataById } from "~/server/games";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(([, id]) => getGameDataById(id), {
    key: () => ["game-data", params.id],
  });
};

const inactiveStyle = "block p-4 text-sm font-medium text-black";
const activeStyle =
  "relative block border-t border-l border-r border-gray-400 bg-white p-4 text-sm font-medium";

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

  const isLineup = useMatch(() => `/game/${gameData.id}/lineup`);
  const isStatistics = useMatch(() => `/game/${gameData.id}/statistics`);
  const isGoals = useMatch(() => `/game/${gameData.id}`);

  return (
    <>
      <div class="relative h-full w-full transform border-2 border-black bg-white">
        <div class="flex flex-col space-y-6 p-4">
          <span class="flex space-x-4 text-sm">
            <span>{calendarDate()}</span>
            <span>{kickoffTime()}</span>
          </span>
          <span class="flex w-full flex-col">
            <span class="flex w-full justify-center space-x-4">
              <span class="text-lg font-bold">{gameData.homeTeam.name}</span>
              <span>{result()}</span>
              <span class="text-lg font-bold">{gameData.awayTeam.name}</span>
            </span>
          </span>
        </div>
      </div>

      <div class="flex flex-col space-y-4">
        <div class="flex border-b border-gray-400 text-center">
          <span class="flex-1">
            <A
              href={`/game/${gameData.id}`}
              class={isGoals() ? activeStyle : inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Goals
            </A>
          </span>

          <span class="flex-1">
            <A
              href={`/game/${gameData.id}/lineup`}
              class={isLineup() ? activeStyle : inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Lineups
            </A>
          </span>

          <span class="flex-1">
            <A
              href={`/game/${gameData.id}/statistics`}
              class={isStatistics() ? activeStyle : inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Statistics
            </A>
          </span>
        </div>
      </div>

      <ErrorBoundary fallback={<div class="w-full h-52 bg-red-200">Error loading data</div>}>
        <Suspense fallback={<p>Loading...</p>}>
          <div class="relative h-full w-full transform border-2 border-black bg-white">
            <div class="flex flex-col space-y-6 p-4">
              <Outlet />
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default () => {
  const gameData = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col space-y-4">
      <Show when={gameData()} keyed>
        {(gameData) => <GameInfo {...gameData} />}
      </Show>
    </div>
  );
};
