import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import GameDetail from "~/components/game-detail";
import { GameDetailWrapper } from "~/components/games";
import { getGameGoalsById } from "~/server/games";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(([, gameId]) => {
    return getGameGoalsById(gameId);
  }, {
    key: () => ["goals-in-game", params.id],
  });
};

export default () => {
  const goals = useRouteData<typeof routeData>();
  const id = useParams().id;

  return (
    <GameDetailWrapper tab="timeline" gameId={id}>
      <GameDetail goals={goals()} />
    </GameDetailWrapper>
  );
};
