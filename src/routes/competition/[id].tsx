import { Show, Suspense } from "solid-js";
import ErrorBoundary, {
  A,
  RouteDataArgs,
  Title,
  useRouteData,
} from "solid-start";
import { Outlet } from "solid-start";
import { HttpStatusCode, createServerData$ } from "solid-start/server";
import { activeStyle, inactiveStyle } from "~/components/games";
import { getCompetitionDetail } from "~/server/competitions";

export const routeData = ({ params }: RouteDataArgs) => {
  const competitionDetail = createServerData$(
    ([, id]) => getCompetitionDetail(id),
    {
      key: () => ["competition", params.id],
    }
  );

  return competitionDetail;
};

export const Flag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="mx-auto h-6 w-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
);

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

export default () => {
  const competitionDetail = useRouteData<typeof routeData>();

  return (
    <>
      <ErrorBoundary
        fallback={(e) => (
          <>
            <HttpStatusCode code={404} />
            <Title>Competition not found</Title>
            <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
              <span>
                Competition with the given id was not found. Please try another
                id. <span class="divider" />
                {e.message}
              </span>
            </div>
          </>
        )}
      >
        <Show
          when={competitionDetail()}
          fallback={<Title>Loading competition</Title>}
          keyed
        >
          {(competition) => (
            <>
              <Title>{competition.name}</Title>
              <div class="mx-auto w-[90%] border-2 border-black p-4 md:w-[50%]">
                <div class="flex space-x-4">
                  <span class="flex flex-col items-center justify-center space-y-2 text-sm">
                    <Show
                      when={competition.country.imageSlug}
                      fallback={<Flag />}
                      keyed
                    >
                      {(flag) => <img class="avatar h-6 w-6 ring ring-black ring-offset-2" src={flag} />}
                    </Show>
                    <span>{competition.country.name}</span>
                  </span>

                  <span class="text-3xl font-bold">{competition.name}</span>
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
              </div>
            </>
          )}
        </Show>
      </ErrorBoundary>
    </>
  );
};
