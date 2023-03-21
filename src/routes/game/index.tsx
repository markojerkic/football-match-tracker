import dayjs from "dayjs";
import { createMemo, For } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { prisma } from "../../util/prisma";

export const routeData = () => {
  const games = createServerData$(() => {
    const games = prisma.game
      .findMany({
        take: 20,
        orderBy: {
          kickoffTime: "desc",
        },
        select: {
          id: true,
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
          kickoffTime: true,
          goals: {
            select: {
              isHomeTeamGoal: true,
            },
          },
        },
      })
      .then((games) => {
        return games.map((game) => {
          let homeTeamGoalCount = 0;
          let awayTeamGoalCount = 0;

          for (let goal of game.goals) {
            if (goal.isHomeTeamGoal) {
              homeTeamGoalCount++;
              continue;
            }
            awayTeamGoalCount++;
          }
          return { ...game, homeTeamGoalCount, awayTeamGoalCount };
        });
      });
    return games;
  });

  return games;
};

const Team = (team: { teamName: string; goalCount: number }) => {
  return (
    <span class="flex w-full justify-between">
      <span class="text-lg font-bold">{team.teamName}</span>
      <span class="font-semibold">{team.goalCount}</span>
    </span>
  );
};

const Game = (game: {
  homeTeam: string;
  awayTeam: string;
  homeTeamGoalCount: number;
  awayTeamGoalCount: number;
  kickoffTime: Date;
}) => {
  const calendarDate = createMemo(() =>
    dayjs(game.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() => dayjs(game.kickoffTime).format("HH:mm"));

  return (
    <a href="" class="group relative block w-full max-w-md">
      <span class="absolute inset-0 border-2 border-dashed border-black"></span>

      <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div class="flex flex-col p-4">
          {/* Content */}
          <span class="flex space-x-4 text-sm">
            <span>{calendarDate()}</span>
            <span>{kickoffTime()}</span>
          </span>
          <span class="flex w-full flex-col">
            <Team goalCount={game.homeTeamGoalCount} teamName={game.homeTeam} />
            <Team goalCount={game.awayTeamGoalCount} teamName={game.awayTeam} />
          </span>
        </div>
      </div>
    </a>
  );
};

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col space-y-4 place-items-center">
      <For each={games()}>
        {(game) => (
          <Game
            awayTeam={game.awayTeam.name}
            homeTeam={game.homeTeam.name}
            homeTeamGoalCount={game.homeTeamGoalCount}
            awayTeamGoalCount={game.awayTeamGoalCount}
            kickoffTime={game.kickoffTime}
          />
        )}
      </For>
    </div>
  );
};
