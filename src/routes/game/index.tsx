import dayjs from "dayjs";
import { createMemo, For } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { prisma } from "../../util/prisma";

export const routeData = () => {
  const games = createServerData$(() => {
    const games = prisma.game.findMany({
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
            goal: {
              select: {
                _count: true,
              },
            },
          },
        },
      },
    });
    return games;
  });

  return games;
};

const Team = (team: { teamName: string; goalCount: number }) => {
  return (
    <span class="flex w-full justify-between">
      <span class="font-bold text-lg">{team.teamName}</span>
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
  const calendarDate = createMemo(() => dayjs(game.kickoffTime).format("DD.MM.YYYY."));
  const kickoffTime = createMemo(() => dayjs(game.kickoffTime).format("hh:mm"));

  return (
    <div class="flex flex-col w-full max-w-3xl rounded-md border border-base-content p-4">
      <span class="text-sm">
        <span>{calendarDate()}</span>
        <span>{kickoffTime()}</span>
      </span>
      <span class="flex w-full flex-col">
        <Team goalCount={game.homeTeamGoalCount} teamName={game.homeTeam} />
        <Team goalCount={game.awayTeamGoalCount} teamName={game.awayTeam} />
      </span>
    </div>
  );
};

export default () => {
  const games = useRouteData<typeof routeData>();
  return (
    <For each={games()}>
      {(game) => (
        <Game
          awayTeam={game.awayTeam.name}
          homeTeam={game.homeTeam.name}
          homeTeamGoalCount={0}
          awayTeamGoalCount={0}
          kickoffTime={game.kickoffTime}
        />
      )}
    </For>
  );
};
