import { Show } from "solid-js";
import { Navigate, RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { getLatestSeasonCompetitionForTeam } from "~/server/teams"

export const routeData = ({ params }: RouteDataArgs) => {
  const competitionSeason = createServerData$(([, id]) => getLatestSeasonCompetitionForTeam(id), {
    key: () => ["competition-season-for-team", params.id]
  });
  return competitionSeason;
}

export default () => {
  const latestSeason = useRouteData<typeof routeData>();

  return (
    <Show when={latestSeason()} fallback={<div>Here be dragons.</div>} keyed>
      {(season) => <Navigate href={season.id} />}
    </Show>
  );
}
