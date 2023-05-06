import { For, createSignal } from "solid-js";
import {
  RouteDataArgs,
  Title,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Select } from "~/components/form-helpers";
import { GamePreview } from "~/components/games";
import { getGamesForCompetitionInSeason } from "~/server/games";
import { getSeasonsFromCompetition } from "~/server/seasons";

export const routeData = ({ params }: RouteDataArgs) => {
  const seasons = createServerData$(([, id]) => getSeasonsFromCompetition(id), {
    key: () => ["seasons-from-competition", params.id],
    initialValue: [],
  });

  const games = createServerData$(
    ([, id, season]) => getGamesForCompetitionInSeason(id, season),
    {
      key: () => ["games-for-competition", params.id, params.seasonId],
      initialValue: [],
    }
  );

  return { games, seasons };
};

export default () => {
  const { games, seasons } = useRouteData<typeof routeData>();
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Title>Games for season</Title>
      <div class="flex flex-col space-y-4">
        <Select
          name="season"
          label="Season"
          options={seasons() ?? []}
          control={{
            value: params.seasonId,
            setValue: (val) => {
              navigate(`/competition/${params.id}/games/${val}`);
            },
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
  );
};
