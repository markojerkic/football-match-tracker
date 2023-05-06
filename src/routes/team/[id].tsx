import { Show, Suspense } from "solid-js";
import ErrorBoundary, {
  A,
  Outlet,
  RouteDataArgs,
  Title,
  useParams,
  useRouteData,
} from "solid-start";
import { HttpStatusCode, createServerData$ } from "solid-start/server";
import { getTeamById } from "~/server/teams";
import { Flag } from "../competition/[id]";
import { activeStyle, inactiveStyle } from "~/components/games";

export const routeData = ({ params }: RouteDataArgs) => {
  const team = createServerData$(([, id]) => getTeamById(id), {
    key: () => ["team-by-id", params.id],
  });

  return team;
};

export default () => {
  const team = useRouteData<typeof routeData>();
  const id = useParams().id;

  return (
    <div class="mx-auto w-[90%] border border-black p-4 md:w-[50%]">
      <ErrorBoundary
        fallback={(e) => (
          <>
            <HttpStatusCode code={404} />
            <Title>Team not found</Title>
            <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
              <span>
                Team with the given id was not found. Please try another id.{" "}
                <span class="divider" />
                {e.message}
              </span>
            </div>
          </>
        )}
      >
        <Show when={team()} keyed>
          {(team) => (
            <>
              <Title>{team.name}</Title>
              <div class="flex space-x-4">
                <span class="flex flex-col items-center justify-center space-y-2 text-sm">
                  <Show when={team.country.imageSlug} fallback={<Flag />} keyed>
                    {(flag) => (
                      <img
                        class="avatar h-6 w-6 ring ring-black ring-offset-2"
                        src={flag}
                      />
                    )}
                  </Show>
                  <span>{team.country.name}</span>
                </span>

                <span class="text-3xl font-bold">{team.name}</span>
              </div>

              <span class="divider" />

              <TabSelector />

              <Suspense>
                <ErrorBoundary
                  fallback={(e) => (
                    <div class="rounded-md bg-error p-4 text-white">
                      <span>
                        Error loading data for this tab. Try another tab or
                        another game.
                        <span class="divider" />
                        {e.message}
                      </span>
                    </div>
                  )}
                >
                  <Outlet />
                </ErrorBoundary>
              </Suspense>
            </>
          )}
        </Show>
      </ErrorBoundary>
    </div>
  );
};

const TabSelector = () => {
  return (
    <div class="flex flex-col space-y-4">
      <div class="flex border-b border-gray-400 text-center">
        <Tab route="table" label="Table" />
        <Tab route="games" label="Games" />

        {/*
        <Tab route="games" label="Games" id={props.playerId} />
        */}
      </div>
    </div>
  );
};

const Tab = (props: { label: string; route: string }) => {
  return (
    <span class="flex-1">
      <A
        href={props.route}
        activeClass={activeStyle}
        inactiveClass={inactiveStyle}
      >
        <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
        {props.label}
      </A>
    </span>
  );
};
