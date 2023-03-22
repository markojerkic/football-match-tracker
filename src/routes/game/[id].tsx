import { Tab, TabGroup, TabList } from "solid-headless";
import dayjs from "dayjs";
import { For, Show, createMemo } from "solid-js";
import { RouteDataArgs, unstable_island, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { prisma } from "~/util/prisma";

const getGameData = async (id: string) => {
  return await prisma.game.findUniqueOrThrow({
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
        orderBy: {
          scoredInMinute: "asc",
        },
        select: {
          isOwnGoal: true,
          isPenalty: true,
          isHomeTeamGoal: true,
          scoredBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          assistedBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          scoredInMinute: true,
          scoredInExtraMinute: true,
        },
      },
    },
  });
};

export type SingleGameInfo = ReturnType<Awaited<typeof getGameData>>;
export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(([, id]) => getGameData(id), {
    key: () => ["game-data", params.id],
  });
};

const GameInfo = unstable_island(() => import("../../components/game-detail"));

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
