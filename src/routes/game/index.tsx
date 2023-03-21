import dayjs from "dayjs";
import { createEffect, createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A, useRouteData } from "solid-start";
import server$ from "solid-start/server";
import { prisma } from "../../util/prisma";
import { createInfiniteQuery, isServer } from "@tanstack/solid-query";

const getGames = server$(async (id: string | undefined) => {
  console.log("request");
  const games = await prisma.game
    .findMany({
      take: 20,
      ...(id !== undefined && id !== null
        ? {
          cursor: {
            id
          },
        }
        : {}),
      orderBy: {
        // kickoffTime: "desc",
        id: "asc",
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

    console.log("req gotov");

  return games;
});

export const routeData = () => {

  const gamesPage = createInfiniteQuery(
    () => ["games-list"],
    async ({ pageParam = undefined as string | undefined }) => {
      return getGames(pageParam);
    },
    {
      getNextPageParam: (lastGamesPage) => {
        let lastGameId = undefined;
        let kickoffTime = undefined;
        if (lastGamesPage.length > 0) {
          lastGameId = lastGamesPage[lastGamesPage.length - 1].id;
          kickoffTime = lastGamesPage[lastGamesPage.length - 1].kickoffTime;
        }
        return lastGameId;
      },
      suspense: true,
      keepPreviousData: true,
    }
  );


  return gamesPage;
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
    <A href="/" class="group relative block w-full max-w-md">
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
    </A>
  );
};

const createScrollToBottom = (
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) => {
  if (isServer) {
    return;
  }
  createEffect(() => {
    const listener = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollTop + clientHeight >= scrollHeight - (scrollHeight / 4) &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    addEventListener("scroll", listener);

    return () => {
      removeEventListener("scroll", listener);
    };
  });
};

export default () => {
  const games = useRouteData<typeof routeData>();

  createScrollToBottom(
    games.hasNextPage ?? true,
    games.isFetchingNextPage,
    games.fetchNextPage
  );

  const mergedLists = createMemo(() => (games.data?.pages ?? [[]]).flat());

  return (
    <div
      class="flex flex-col place-items-center space-y-4"
    >
      <Suspense fallback={<div>test...</div>}>
        <Show when={mergedLists()} keyed>
          {(data) => (
            <For each={data}>
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
          )}
        </Show>
      </Suspense>
    </div>
  );
};
