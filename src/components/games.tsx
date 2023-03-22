import { createInfiniteQuery } from "@tanstack/solid-query";
import dayjs from "dayjs";
import { createMemo } from "solid-js";
import { For, Show, isServer } from "solid-js/web"
import { A } from "solid-start";
import server$ from "solid-start/server";
import { createScrollToBottom } from "~/hooks/infinite-scroll";
import { getGames, getLastId, type Game } from "~/server/games";

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

const getGames$ = server$(async (pageParam?: string) => getGames(pageParam));

export default function GamesList (props: { games: Game[] }) {

  const gamesPage = createInfiniteQuery(() => ["games-page"],
    async ({ pageParam = undefined as string | undefined }) => {
      return getGames$(pageParam);
    },
    {
      getNextPageParam: (lastGamesPage: Game[]) => getLastId(lastGamesPage),
      suspense: true,
      keepPreviousData: true,
      enabled: !isServer,
      initialData: () => {
        return {
          pages: [],
          pageParams: []
        }
      }
    }
  );

  createScrollToBottom(
    gamesPage.hasNextPage ?? true,
    gamesPage.isFetchingNextPage,
    gamesPage.fetchNextPage
  );

  return (
    <Show when={props.games} keyed >
      {(data) => (
        <For each={data} >
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
  )
}
