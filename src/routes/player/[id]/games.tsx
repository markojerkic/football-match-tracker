import { For, createEffect, createRenderEffect, createSignal } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGamesForPlayer } from "~/server/games";
import { GamePreview } from "~/components/games";
import { getAllSeasons } from "~/server/seasons";
import { Select, type Option } from "~/components/form-helpers";

export const routeData = ({ params }: RouteDataArgs) => {
  const [selectedSeason, setSelectedSeason] = createSignal<string>();

  const seasons = createServerData$(() => getAllSeasons(), {
    key: () => ["seasons"],
    initialValue: [],
  });

  const games = createServerData$(
    ([, id, season]) => getGamesForPlayer(id, season),
    {
      key: () => ["games-for-player", params.id, selectedSeason()] as const,
      initialValue: [],
    }
  );

  return { games, seasons, selectedSeason, setSelectedSeason };
};

export default () => {
  const { games, seasons, selectedSeason, setSelectedSeason } =
    useRouteData<typeof routeData>();

  createRenderEffect(() => {
    const s = seasons();
    if (s && s.length >= 0) {
      setSelectedSeason(s[0].value as string | undefined);
    }
  });

  return (
    <div class="flex flex-col space-y-4">
      <Select
        name="season"
        label="Season"
        options={seasons() ?? []}
        control={{
          value: selectedSeason(),
          setValue: (val) => setSelectedSeason(val),
        }}
        required
      />

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
