import { Show } from "solid-js";
import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { GameDetailWrapper } from "~/components/games";
import { FieldWrapper } from "~/components/lineup";
import { getLineups } from "~/server/lineups";

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(([, id]) => getLineups({ gameId: id }), {
    key: () => ["lineups", params.id],
  });
};

export default () => {
  const lineups = useRouteData<typeof routeData>();
  const params = useParams();
  const id = () => params.id;

  return (
    <Show when={lineups()} keyed>
      {(lineups) => (
        <GameDetailWrapper gameId={id()}>
          <FieldWrapper lineups={lineups} />
        </GameDetailWrapper>
      )}
    </Show>
  );
};
