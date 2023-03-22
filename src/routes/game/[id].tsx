import dayjs from "dayjs";
import { createMemo } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { prisma } from "~/util/prisma";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(
    ([, id]) => {
      return prisma.game.findUniqueOrThrow({
        where: { id },
        select: {
          kickoffTime: true,
          homeTeam: {
            select: {
              name: true,
            },
          },
          awayTeam: {
            select: {
              name: true,
            },
          },
          goals: {
            select: {
              isHomeTeamGoal: true,
            },
          },
        },
      });
    },
    { key: () => ["game-data", params.id] }
  );
};
export default () => {
  const gameData = useRouteData<typeof routeData>();

  const calendarDate = createMemo(() =>
    dayjs(gameData()?.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() =>
    dayjs(gameData()?.kickoffTime).format("HH:mm")
  );

  const result = () => {
    let homeTeamGoalCount = 0;
    let awayTeamGoalCount = 0;

    for (let goal of gameData()?.goals ?? []) {
      if (goal.isHomeTeamGoal) {
        homeTeamGoalCount++;
        continue;
      }
      awayTeamGoalCount++;
    }

    return `${homeTeamGoalCount} - ${awayTeamGoalCount}`;
  }

  return (
    <div>
      <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div class="flex flex-col p-4">
          {/* Content */}
          <span class="flex space-x-4 text-sm">
            <span>{calendarDate()}</span>
            <span>{kickoffTime()}</span>
          </span>
          <span class="flex w-full flex-col">
            <span class="flex w-full justify-center space-x-4">
              <span class="text-lg font-bold">{gameData()?.homeTeam.name}</span>
              <span>{result()}</span>
              <span class="text-lg font-bold">{gameData()?.awayTeam.name}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
