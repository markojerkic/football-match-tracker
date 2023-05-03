import { ErrorBoundary, Show } from "solid-js";
import { RouteDataArgs, Title, useRouteData } from "solid-start";
import { HttpStatusCode, createServerData$ } from "solid-start/server";
import { PlayerDetail } from "~/components/player";
import { getPlayerById } from "~/server/players";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  const player = createServerData$(([, id]) => getPlayerById(id), {
    key: () => ["player-by-id", params.id],
  });

  return player;
};

export default () => {
  const player = useRouteData<typeof routeData>();

  const currentTeam = () => player()?.currentTeam ?? undefined;

  return (
    <ErrorBoundary
      fallback={(e) => (
        <>
          <HttpStatusCode code={404} />
          <Title>Player not found</Title>
          <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
            <span>
              Player with the given id was not fuond. Please try another id.{" "}
              {e.message}
            </span>
          </div>
        </>
      )}
    >
      <Show when={player()} keyed>
        {(player) => (
          <>
            <Title>
              {player.firstName} {player.lastName}
            </Title>
            <PlayerDetail
              id={player.id}
              firstName={player.firstName}
              lastName={player.lastName}
              imageSlug={player.imageSlug ?? undefined}
              currentTeam={currentTeam()}
            />
          </>
        )}
      </Show>
    </ErrorBoundary>
  );
};
