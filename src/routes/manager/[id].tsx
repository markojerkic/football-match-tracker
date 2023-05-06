import { ErrorBoundary, Show } from "solid-js";
import { RouteDataArgs, Title, useRouteData } from "solid-start";
import { HttpStatusCode, createServerData$ } from "solid-start/server";
import { ManagerDetail } from "~/components/manager";
import { getManagerById } from "~/server/managers";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  const manager = createServerData$(([, id]) => getManagerById(id), {
    key: () => ["manager-by-id", params.id],
  });

  return manager;
};

export default () => {
  const manager = useRouteData<typeof routeData>();

  const currentTeam = () => manager()?.currentTeam ?? undefined;

  return (
    <ErrorBoundary
      fallback={(e) => (
        <>
          <HttpStatusCode code={404} />
          <Title>Manager not found</Title>
          <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
            <span>
              Manager with the given id was not fuond. Please try another id.{" "}
              {e.message}
            </span>
          </div>
        </>
      )}
    >
      <Show when={manager()} keyed>
        {(player) => (
          <>
            <Title>
              {player.firstName} {player.lastName}
            </Title>
            <ManagerDetail
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
