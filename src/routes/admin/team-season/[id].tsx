import {
  For,
  Resource,
  Show,
  createEffect,
  createRenderEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import ErrorBoundary, {
  RouteDataArgs,
  Title,
  useParams,
  useRouteData,
} from "solid-start";
import {
  HttpStatusCode,
  createServerAction$,
  createServerData$,
} from "solid-start/server";
import { Select, type Option } from "~/components/form-helpers";
import { Flag } from "~/routes/competition/[id]";
import {
  getCompetitionSeasons,
  getTeamInCompetitionSeasons,
} from "~/server/competitions";
import {
  TeamInSeasonFormElement,
  getTeamById,
  saveTeamInCompetitionSeasons,
  teamInSeasonFormSchema,
} from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs) => {
  const competitionSeasons = createServerData$(
    async () => getCompetitionSeasons(),
    {
      key: () => ["competition-in-seasons"],
      initialValue: [],
    }
  );

  const teamInCompetitionSeaons: Resource<TeamInSeasonFormElement[]> =
    createServerData$(
      async ([, teamId]) => getTeamInCompetitionSeasons(teamId),
      {
        key: () => ["team-competition-in-seasons", params.id],
        initialValue: [],
      }
    );

  const team = createServerData$(([, id]) => getTeamById(id), {
    key: () => ["team-by-id", params.id],
  });

  return { competitionSeasons, team, teamInCompetitionSeaons };
};

export default () => {
  const teamId = useParams<{ id: string }>().id;
  const { team, competitionSeasons, teamInCompetitionSeaons } =
    useRouteData<typeof routeData>();

  const [teamSeasons, setTeamSeasons] = createStore<TeamInSeasonFormElement[]>(
    []
  );
  const [seasonsToDelete, setSeasonsToDelete] = createStore<string[]>([]);

  createRenderEffect(() => {
    const teamSeasons = teamInCompetitionSeaons();
    if (teamSeasons) {
      setTeamSeasons((curr) => [...curr, ...teamSeasons]);
    }
  });

  const [_, { Form }] = createServerAction$(async (formData: FormData) => {
    console.log(Object.fromEntries(formData.entries()));
    const data = teamInSeasonFormSchema.parse(formData);
    return saveTeamInCompetitionSeasons(data);
  });

  const loading = () => teamInCompetitionSeaons.loading;

  return (
    <ErrorBoundary
      fallback={(e) => (
        <>
          <HttpStatusCode code={404} />
          <Title>Player not found</Title>
          <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
            <span>
              Player with the given id was not found. Please try another id.{" "}
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

            <Form class="mx-auto flex w-[90%] flex-col space-y-4 border-2 border-black p-4 md:w-[50%]">
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
              </div>

              <span class="divider" />
              <input type="hidden" name="teamId" value={teamId} />
              <For each={seasonsToDelete}>
                {(team, index) => (
                  <input
                    type="hidden"
                    name={`seasonsToDelete[${index()}]`}
                    value={team}
                  />
                )}
              </For>
              <For each={teamSeasons}>
                {(team, index) => (
                  <div class="grid grid-cols-2 items-end gap-2">
                    <input
                      type="hidden"
                      name={`season[${index()}].id`}
                      value={team.id ?? ""}
                    />

                    <Select
                      name={`season[${index()}].competitionSeasonId`}
                      label="Season"
                      required
                      disabled={loading()}
                      options={competitionSeasons() ?? []}
                      control={{
                        value: team.competitionSeasonId,
                        setValue: (val) =>
                          setTeamSeasons(index(), "competitionSeasonId", val),
                      }}
                    />

                    <button
                      type="button"
                      class="btn-error btn"
                      disabled={teamInCompetitionSeaons.state === "pending"}
                      onClick={() => {
                        const id = team.id;
                        if (id) {
                          setSeasonsToDelete((curr) => [...curr, id]);
                        }

                        setTeamSeasons((curr) =>
                          [...curr].filter((_, i) => i !== index())
                        );
                      }}
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </For>

              <span class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="btn"
                  onClick={() => {
                    setTeamSeasons((curr) => [
                      ...curr,
                      {
                        competitionSeasonId: "",
                        id: undefined,
                      } satisfies TeamInSeasonFormElement,
                    ]);
                  }}
                >
                  Add new season to team
                </button>

                <button type="submit" class="btn" disabled={loading()}>
                  Save
                </button>
              </span>
            </Form>
          </>
        )}
      </Show>
    </ErrorBoundary>
  );
};
