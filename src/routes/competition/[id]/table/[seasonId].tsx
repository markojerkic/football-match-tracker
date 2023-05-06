import { For } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getTableForCompetition } from "~/server/competitions";

export const routeData = ({ params }: RouteDataArgs) => {
  const table = createServerData$(
    ([, competitionId, seasonId]) =>
      getTableForCompetition(competitionId, seasonId),
    {
      key: () => ["table", params.id, params.seasonId],
    }
  );

  return table;
};

export default () => {
  const table = useRouteData<typeof routeData>();

  return (
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
  );
};
