import dayjs from "dayjs";
import { ParentComponent, createMemo } from "solid-js";
import { For, Show } from "solid-js/web";
import { A, useSearchParams } from "solid-start";
import { type Game } from "~/server/games";

const Team = (team: { teamName: string; goalCount: number }) => {
  return (
    <span class="flex w-full items-center justify-between">
      <span class="max-w-[80%] text-lg font-bold">{team.teamName}</span>
      <span class="font-semibold">{team.goalCount}</span>
    </span>
  );
};

export const GamePreview = (game: {
  homeTeam: string;
  awayTeam: string;
  homeTeamGoalCount: number;
  awayTeamGoalCount: number;
  kickoffTime: Date;
  id: string;
}) => {
  const [query] = useSearchParams();
  const calendarDate = createMemo(() =>
    dayjs(game.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() => dayjs(game.kickoffTime).format("HH:mm"));

  return (
    <A
      href={`/game/${game.id}/goals${query.date ? "?date=" + query.date : ""}`}
      class="group relative block"
    >
      <span class="absolute inset-0 border-2 border-dashed border-black"></span>

      <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div class="flex flex-col p-4">
          {/* Content */}
          <span class="flex space-x-4 text-sm">
            <span>{calendarDate()}</span>
            <span>{kickoffTime()}</span>
          </span>
          <span class="flex w-full flex-col space-y-1">
            <Team goalCount={game.homeTeamGoalCount} teamName={game.homeTeam} />
            <Team goalCount={game.awayTeamGoalCount} teamName={game.awayTeam} />
          </span>
        </div>
      </div>
    </A>
  );
};

export const inactiveStyle = "block p-4 text-sm font-medium text-black";
export const activeStyle =
  "relative block border-t border-l border-r border-gray-400 bg-white p-4 text-sm font-medium";

export const GameDetailWrapper: ParentComponent<{
  gameId: string;
}> = (props) => {
  const [query] = useSearchParams();

  return (
    <>
      <div class="flex flex-col space-y-4">
        <div class="flex border-b border-gray-400 text-center">
          <span class="flex-1">
            <A
              end={true}
              href={`/game/${props.gameId}/goals${
                query.date ? "?date=" + query.date : ""
              }`}
              activeClass={activeStyle}
              inactiveClass={inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Goals
            </A>
          </span>

          <span class="flex-1">
            <A
              end={true}
              href={`/game/${props.gameId}/lineup${
                query.date ? "?date=" + query.date : ""
              }`}
              activeClass={activeStyle}
              inactiveClass={inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Lineups
            </A>
          </span>

          <span class="flex-1">
            <A
              end={true}
              href={`/game/${props.gameId}/statistics${
                query.date ? "?date=" + query.date : ""
              }`}
              activeClass={activeStyle}
              inactiveClass={inactiveStyle}
            >
              <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
              Statistics
            </A>
          </span>
        </div>
      </div>

      <div class="relative mt-4 h-full w-full transform border-2 border-black bg-white">
        <div class="flex flex-col space-y-6 p-4">{props.children}</div>
      </div>
    </>
  );
};

export default function GamesList(props: { games: Game[] }) {
  return (
    <div class="flex max-h-[75vh] flex-col space-y-4 md:max-h-max">
      <Show when={props.games} keyed>
        {(data) => (
          <For each={data}>
            {(game) => (
              <GamePreview
                awayTeam={game.awayTeam.name}
                homeTeam={game.homeTeam.name}
                homeTeamGoalCount={game.homeTeamGoalCount}
                awayTeamGoalCount={game.awayTeamGoalCount}
                kickoffTime={game.kickoffTime}
                id={game.id}
              />
            )}
          </For>
        )}
      </Show>
    </div>
  );
}
