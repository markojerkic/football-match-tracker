
import { For } from "solid-js";
import {
  A,
  RouteDataArgs,
  Title,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Select } from "~/components/form-helpers";
import { getTableForCompetitionInSeason } from "~/server/competitions";
import { getCompetitionSeasonsIds } from "~/server/seasons";

export const routeData = ({ params }: RouteDataArgs) => {
  const seasons = createServerData$(
    ([, id]) => getCompetitionSeasonsIds(id),
    {
      key: () => ["competition-seasons", params.id],
      initialValue: [],
    }
  );

  const table = createServerData$(
    ([, id]) =>
      getTableForCompetitionInSeason(id),
    {
      key: () => ["table-for-team", params.competitionInSeason],
    }
  );


  return {
    seasons,
    table
  }
}

export default () => {
  const { table, seasons } = useRouteData<typeof routeData>();
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Title>Table for season</Title>
      <div class="my-4 flex flex-col space-y-4">
        <Select
          name="season"
          label="Season"
          options={seasons() ?? []}
          control={{
            value: params.competitionInSeason,
            setValue: (val) => {
              navigate(`/team/${params.id}/table/${val}`);
            },
          }}
          required
        />

        <table class="table-zebra my-4 table w-full">
          <thead>
            <tr>
              <th>Position</th>
              <th>Team</th>
              <th>Played</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            <For each={table()}>
              {(team, index) => (
                <tr>
                  <td>{index() + 1}</td>
                  <td>
                    <A class="hover:link" href={`/team/${team.id}`}>
                      {team.name}
                    </A>
                  </td>
                  <td>{Math.ceil(team.played ?? 0)}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.points}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </>
  );
};

