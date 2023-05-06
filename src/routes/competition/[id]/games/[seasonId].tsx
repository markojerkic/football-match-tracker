import { For, createSignal } from "solid-js";
import { RouteDataArgs, Title, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server";
import { Select } from "~/components/form-helpers";
import { GamePreview } from "~/components/games";
import { getGamesForCompetitionInSeason } from "~/server/games";
import { getSeasonsFromCompetition } from "~/server/seasons";

export const routeData = ({ params }: RouteDataArgs) => {
  const [selectedSeason, setSelectedSeason] = createSignal<string>(params.seasonId);

  const seasons = createServerData$(([, id]) => getSeasonsFromCompetition(id), {
    key: () => ["seasons-from-competition", params.id],
    initialValue: [],
  });

  const games = createServerData$(
    ([, id, season]) => getGamesForCompetitionInSeason(id, season),
    {
      key: () => ["games-for-competition", params.id, selectedSeason()] as const,
      initialValue: [],
    }
  );

  return { games, seasons, selectedSeason, setSelectedSeason };
}

export default () => {
  const { games, seasons, selectedSeason, setSelectedSeason } =
    useRouteData<typeof routeData>();


  return (
    <>
      <Title>Games for season</Title>
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
    </>
  )
}
