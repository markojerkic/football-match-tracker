import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { prisma } from "~/util/prisma";

export const routeData = () => {
  return createServerData$(
    () => {
      return prisma.competition.findMany({
        select: {
          id: true,
          name: true,
          country: {
            select: {
              name: true,
            },
          },
        },
      });
    },
    { key: () => ["admin-competitions"], initialValue: [] }
  );
};

type GameForm = {
  competition: string;
  homeTeam: string;
  awayTeam: string;
  season: string;
};
type PartialGameForm = Partial<GameForm>;

const HiddenOption = () => <option class="hidden" disabled selected />;
export default () => {
  const competitions = useRouteData<typeof routeData>();
  const [enrolling, { Form }] = createServerAction$(
    async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      console.log(data);
    }
  );

  //const firstCompetition = () => competitions()?.at(0)?.id ?? "";
  const [formValue, setFormValue] = createStore<PartialGameForm>({
    competition: "",
    season: "",
    homeTeam: "",
    awayTeam: "",
  });

  const seasons = createServerData$(
    ([, competition]) => {
      if (!competition) {
        return [];
      }

      return prisma.competitionInSeason.findMany({
        where: {
          competitionId: competition,
        },
        select: {
          season: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    },
    {
      key: () => ["seasons-for-competition", formValue.competition],
      initialValue: [],
    }
  );

  const teams = createServerData$(
    ([, competitionId, seasonId]) => {
      if (!competitionId || !seasonId) {
        return [];
      }

      return prisma.teamInCompetition.findMany({
        where: {
          seasonId,
          competitionId,
        },
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
    {
      key: () => [
        "teams-in-season-competition",
        formValue.competition,
        formValue.season,
      ],
      initialValue: [],
    }
  );

  return (
    <Form class="mx-auto flex max-w-md flex-col space-y-4">
      <span class="flex flex-col">
        <label for="competition">Competition</label>
        <select
          class="select-bordered select w-full max-w-xs"
          id="competition"
          name="competition"
          required
          value={formValue.competition}
          onInput={(e) => {
            const inputValue = (e.target as HTMLInputElement).value;
            setFormValue({ competition: inputValue });
          }}
        >
          <HiddenOption />
          <For each={competitions() ?? []}>
            {(competition) => (
              <option
                selected={false}
                label={`${competition.name} - ${competition.country.name}`}
                value={competition.id}
              />
            )}
          </For>
        </select>
      </span>

      <span class="flex flex-col">
        <label for="season">Season</label>
        <select
          class="select-bordered select w-full max-w-xs"
          id="season"
          name="season"
          value={formValue.season}
          disabled={seasons()?.length === 0}
          required
          onInput={(e) => {
            const inputValue = (e.target as HTMLInputElement).value;
            setFormValue({ season: inputValue });
          }}
        >
          <HiddenOption />
          <For each={seasons()}>
            {(season) => (
              <option
                selected={false}
                label={season.season.title}
                value={season.season.id}
              />
            )}
          </For>
        </select>
      </span>

      <span class="flex justify-around">
        <span class="flex grow flex-col">
          <label for="homeTeam">Home team</label>
          <select
            class="select-bordered select w-full max-w-xs"
            id="homeTeam"
            name="homeTeam"
            disabled={teams()?.length === 0}
            value={formValue.homeTeam}
            required
            onInput={(e) => {
              const inputValue = (e.target as HTMLInputElement).value;
              setFormValue({ homeTeam: inputValue });
            }}
          >
            <HiddenOption />
            <For each={teams()}>
              {(team) => <option label={team.team.name} value={team.team.id} />}
            </For>
          </select>
        </span>

        <span class="flex grow flex-col">
          <label for="awayTeam">Away team</label>
          <select
            class="select-bordered select w-full max-w-xs"
            id="awayTeam"
            name="awayTeam"
            disabled={teams()?.length === 0}
            value={formValue.awayTeam}
            required
            onInput={(e) => {
              const inputValue = (e.target as HTMLInputElement).value;
              setFormValue({ awayTeam: inputValue });
            }}
          >
            <HiddenOption />
            <For each={teams()}>
              {(team) => (
                <option
                  selected={false}
                  label={team.team.name}
                  value={team.team.id}
                />
              )}
            </For>
          </select>
        </span>
      </span>

      <span class="flex flex-col">
        <label for="kickoffTime">Kickoff time</label>
        <input id="kickoffTime" type="datetime-local" />
      </span>

      <button class="btn" type="submit">
        Save
      </button>
    </Form>
  );
};
