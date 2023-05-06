import { For } from "solid-js";
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
import { getGamesForCompetitionSeason } from "~/server/games";
import { getCompetitionSeasons } from "~/server/seasons";

export const routeData = ({ params }: RouteDataArgs) => {
  const competitionSeasons = createServerData$(
    ([, id]) => getCompetitionSeasons(id),
    {
      key: () => ["competition-seasons", params.id],
      initialValue: [],
    }
  );

  const games = createServerData$(
    ([, id]) => getGamesForCompetitionSeason(id),
    {
      key: () => [
        "games-for-team-competition-season",
        params.competitionInSeasonId,
      ],
      initialValue: [],
    }
  );

  return { games, competitionSeasons };
};

export default () => {
  const { games, competitionSeasons } = useRouteData<typeof routeData>();

  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Title>Games for season</Title>
      <div class="flex flex-col space-y-4">
        <Select
          name="season"
          label="Season"
          options={competitionSeasons() ?? []}
          control={{
            value: params.competitionInSeasonId,
            setValue: (val) => {
              navigate(`/team/${params.id}/games/${val}`);
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
