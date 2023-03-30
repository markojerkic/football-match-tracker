import {
  ErrorBoundary,
  Show,
  Suspense,
  createEffect,
  createSignal,
} from "solid-js";
import {
  Meta,
  Outlet,
  Title,
  useParams,
  useRouteData,
  useSearchParams,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getGames } from "~/server/games";
import GamesPage from "~/components/games";
import { Calendar } from "~/components/calendar";

export const routeData = () => {
  const [searchParams] = useSearchParams();
  const gamesFirstPage = createServerData$(
    ([, selectedDate]) => {
      return getGames(selectedDate ?? new Date().toISOString().split("T")[0]);
    },
    { key: () => ["games-first-page", searchParams.date] }
  );

  return gamesFirstPage;
};

export default () => {
  const games = useRouteData<typeof routeData>();

  const params = useParams();
  const hasNoParamId = () => params.id === undefined;

  const [isNavbarOpened, setIsNavbarOpened] = createSignal(hasNoParamId());

  let checkbox: HTMLInputElement | undefined = undefined;
  createEffect(() => {
    setIsNavbarOpened(false);
    if (checkbox) {
      checkbox.checked = false;
    }
    console.log(params.id);
  });

  return (
    <>
      <Title>Games list</Title>
      <Meta name="description" content="List of games filtered by a date." />
      <div class="grid grid-cols-[auto,1fr,auto] grid-rows-[auto,1fr] space-y-4 overflow-x-clip px-4">
        <input
          ref={checkbox}
          type="checkbox"
          id="games-toggle"
          class="peer absolute hidden"
          checked={isNavbarOpened()}
        />
        <label
          for="games-toggle"
          class="absolute top-0 z-10 rotate-0 self-start transition-all duration-500 peer-checked:rotate-180 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </label>

        <div class="fixed left-0 top-4 z-20 col-start-1 row-start-2 h-full min-h-[120vh] w-full min-w-[300px] -translate-x-full space-y-4 overflow-auto bg-base-100 px-8 pb-20 pt-8 duration-300 ease-in-out peer-checked:translate-x-0 md:relative md:left-auto md:top-auto md:translate-x-0 md:pb-8">
          <Show when={games()} keyed>
            {(games) => (
              <div class="mx-auto max-h-full w-full max-w-md overflow-y-scroll px-4">
                <Calendar />
                <GamesPage games={games} />
              </div>
            )}
          </Show>
          <Show when={games()?.length === 0}>
            <p class="my-1 flex px-4 text-sm font-medium text-gray-700">
              No games were found for that date.
            </p>
            <p class="my-1 flex px-4 text-sm font-medium text-gray-700">
              Try another date.
            </p>
          </Show>
        </div>

        <div class="col-start-2 row-start-2 h-full w-full place-self-center overflow-auto md:min-w-full md:max-w-3xl lg:min-w-[50rem]">
          <ErrorBoundary
            fallback={
              <div class="h-52 w-full bg-error p-4 text-white">
                Error loading data
              </div>
            }
          >
            <Suspense fallback={<p>Loading...</p>}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};
