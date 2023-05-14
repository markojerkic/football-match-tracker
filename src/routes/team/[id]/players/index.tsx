import { Show } from "solid-js";
import { Navigate, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getAllSeasons } from "~/server/seasons";

export const routeData = () => {
  const seasons = createServerData$(() => getAllSeasons().then((s) => s[0]), {
    key: () => ["seasons"],
  });
  return seasons;
};

export default () => {
  const latestSeason = useRouteData<typeof routeData>();

  return (
    <Show when={latestSeason()} fallback={<div>Here be dragons.</div>} keyed>
      {(season) => <Navigate href={season.value as string} />}
    </Show>
  );
};
