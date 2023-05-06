import { Show } from "solid-js";
import { Navigate, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getLatestSeasonForCompetition } from "~/server/competitions";

export const routeData = ({ params }: RouteDataArgs) => {
  const latestSeason = createServerData$(
    ([, competitionId]) => getLatestSeasonForCompetition(competitionId),
    {
      key: () => ["latest-season", params.id],
    }
  );

  return latestSeason;
};

export default () => {
  const latestSeason = useRouteData<typeof routeData>();

  return (
    <Show when={latestSeason()} fallback={<div>Here be dragons.</div>} keyed>
      {(season) => <Navigate href={season.seasonId} />}
    </Show>
  );
};
