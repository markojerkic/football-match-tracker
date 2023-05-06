import { For, Resource, Show, createRenderEffect } from "solid-js";
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
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Select } from "~/components/form-helpers";
import { BasicPlayerDetail } from "~/components/player";
import { getManagerById, saveManagerTeams } from "~/server/managers";
import { getAllSeasons } from "~/server/seasons";
import { getAllTeams, getTeamForManagerForm } from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs) => {
  const managerTeamsInSeasons: Resource<ManagerssTeamInSeason[]> =
    createServerData$(async ([, managerId]) => getTeamForManagerForm(managerId), {
      key: () => ["team-in-season-manager", params.id],
      initialValue: [],
    });

  const managerData = createServerData$(
    ([, managerId]) => getManagerById(managerId),
    {
      key: () => ["manager-by-id", params.id],
    }
  );

  const seasons = createServerData$(async () => getAllSeasons(), {
    key: () => ["seasons"],
    initialValue: [],
  });

  const teams = createServerData$(() => getAllTeams(), {
    key: () => ["teams"],
    initialValue: [],
  });

  return { managerData, seasons, teams, managerTeamsInSeasons };
};

const teamInSeasonSchema = z.object({
  id: zfd.text(z.string().optional()),
  teamId: zfd.text(),
  seasonId: zfd.text(),
});

const schema = zfd.formData(
  z.object({
    team: teamInSeasonSchema.array().optional().default([]),
    teamsToDelete: zfd.text().array().optional().default([]),
    managerId: zfd.text(),
  })
);

export type ManagerssTeamInSeason = z.infer<typeof teamInSeasonSchema>;
export type ManagerTeamsForm = z.infer<typeof schema>;

export default () => {
  const managerId = useParams<{ id: string }>().id;
  const { managerData, seasons, teams, managerTeamsInSeasons } =
    useRouteData<typeof routeData>();

  const [teamSeasons, setTeamSeasons] = createStore<ManagerssTeamInSeason[]>([]);
  const [teamsToDelete, setTeamsToDelete] = createStore<string[]>([]);

  createRenderEffect(() => {
    const teamSeasons = managerTeamsInSeasons();
    if (teamSeasons) {
      setTeamSeasons((curr) => [...curr, ...teamSeasons]);
    }
  });

  const [_, { Form }] = createServerAction$(async (formData: FormData) => {
    const data = schema.parse(formData);
    return saveManagerTeams(data);
  });

  const loading = () => managerTeamsInSeasons.loading;

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
      <Show when={managerData()} keyed>
        {(manager) => (
          <>
            <Title>Edit teams per season of {manager.lastName}</Title>
            <BasicPlayerDetail
              id={manager.id}
              firstName={manager.firstName}
              lastName={manager.lastName}
              imageSlug={manager.imageSlug ?? undefined}
              currentTeam={manager.currentTeam ?? undefined}
            />

            <Form class="mx-auto flex w-[90%] flex-col space-y-4 border-2 border-black p-4 md:w-[50%]">
              <input type="hidden" name="managerId" value={managerId} />
              <For each={teamsToDelete}>
                {(team, index) => (
                  <input
                    type="hidden"
                    name={`teamsToDelete[${index()}]`}
                    value={team}
                  />
                )}
              </For>
              <For each={teamSeasons}>
                {(team, index) => (
                  <div class="grid grid-cols-3 items-end gap-2">
                    <input
                      type="hidden"
                      name={`team[${index()}].id`}
                      value={team.id ?? ""}
                    />

                    <Select
                      name={`team[${index()}].teamId`}
                      label="Team"
                      required
                      disabled={loading()}
                      options={teams() ?? []}
                      control={{
                        value: team.teamId,
                        setValue: (val) =>
                          setTeamSeasons(index(), "teamId", val),
                      }}
                    />

                    <Select
                      name={`team[${index()}].seasonId`}
                      label="Season"
                      required
                      disabled={loading()}
                      options={seasons() ?? []}
                      control={{
                        value: team.seasonId,
                        setValue: (val) =>
                          setTeamSeasons(index(), "seasonId", val),
                      }}
                    />

                    <button
                      type="button"
                      class="btn-error btn"
                      disabled={managerTeamsInSeasons.state === "pending"}
                      onClick={() => {
                        const id = team.id;
                        if (id) {
                          setTeamsToDelete((curr) => [...curr, id]);
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
                      { id: undefined, teamId: "", seasonId: "" },
                    ]);
                  }}
                >
                  Add new team
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
