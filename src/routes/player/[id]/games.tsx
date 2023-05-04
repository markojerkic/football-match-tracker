import { For } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGamesForPlayer } from "~/server/games";
import { GamePreview } from "~/components/games";

export const routeData = ({ params }: RouteDataArgs) => {
  const games = createServerData$(([, id]) => getGamesForPlayer(id), {
    key: () => ["games-for-player", params.id],
    initialValue: [],
  });

  return games;
};

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col space-y-4">
      <For each={games()}>
        {(game) => (
          <span>
            <GamePreview
              id={game.gameid}
              homeTeam={game.hometeamname ?? ""}
              awayTeam={game.awayteamname ?? ""}
              kickoffTime={game.kickoffTime}
              homeTeamGoalCount={game.hometeamgoalcount ?? 0}
              awayTeamGoalCount={game.awayteamgoalcount ?? 0}
            />
          </span>
        )}
      </For>
    </div>
  );
};
