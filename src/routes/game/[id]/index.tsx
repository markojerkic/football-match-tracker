import { Show } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import GameDetail from "~/components/game-detail";
import { getGameGoalsById } from "~/server/games";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  console.log("params", params);
  return createServerData$(([, gameId]) => getGameGoalsById(gameId), {
    key: () => ["goals-in-game", params.id],
  });
};

export default () => {
  const goals = useRouteData<typeof routeData>();

  return (
    <Show when={goals()} keyed>
      {(goals) => <GameDetail goals={goals} />}
    </Show>
  );
};
