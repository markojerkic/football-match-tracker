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

      <ErrorBoundary
        fallback={<div class="h-52 w-full bg-red-200">Error loading data</div>}
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
    <div class="flex flex-col space-y-4">
      <Show when={gameData()} keyed>
        {(gameData) => <GameInfo {...gameData} />}
      </Show>
    </div>
  );
};
