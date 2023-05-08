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

                <img
                  class="avatar h-16 object-contain"
                  src={team.imageSlug ?? "/shield.svg"}
                />

                <span class="text-center text-3xl font-bold">{team.name}</span>

                <div class="flex grow justify-end">
                  <A
                    href={`/admin/team/${id}`}
                    class="btn-outline btn-circle btn justify-self-end"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </A>
                </div>
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
