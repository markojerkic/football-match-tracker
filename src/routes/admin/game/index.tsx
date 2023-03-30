// @refresh reload
import { IFormControl, createFormControl, createFormGroup } from "solid-forms";
import { For, Suspense } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { prisma } from "~/util/prisma";

export const routeData = () => {
  return createServerData$(
    async () => {
      return prisma.competition
        .findMany({
          select: {
            id: true,
            name: true,
            country: {
              select: {
                name: true,
              },
            },
          },
        })
        .then((competitions) =>
          competitions.map((c) => ({
            label: `${c.country.name} - ${c.name}`,
            value: c.id,
          }))
        );
    },
    { key: () => ["admin-competitions"], initialValue: [] }
  );
};

type Option = { label: string; value: string | number };
const Select = (props: {
  control: IFormControl<string>;
  name: string;
  options: Option[];
}) => {
  return (
    <span class="flex flex-col">
      <label for="competition">Competition</label>
      <select
        class="select-bordered select w-full max-w-xs"
        name={props.name}
        required
        value={props.control.value}
        onInput={(e) => {
          props.control.setValue(e.currentTarget.value);
        }}
      >
        <HiddenOption />
        <For each={props.options}>
          {(option) => <option label={option.label} value={option.value} />}
        </For>
      </select>
    </span>
  );
};

const HiddenOption = () => <option class="hidden" disabled selected />;
export default () => {
  const competitions = useRouteData<typeof routeData>();
  const [enrolling, { Form }] = createServerAction$(
    async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
    }
  );

  const gameFormGroup = createFormGroup({
    competition: createFormControl("", { required: true }),
    season: createFormControl("", { required: true }),
    homeTeam: createFormControl("", { required: true }),
    awayTeam: createFormControl("", { required: true }),
  });

  const seasons = createServerData$(
    async ([, competition]) => {
      if (!competition) {
        return [];
      }

      return prisma.competitionInSeason
        .findMany({
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
        })
        .then((seasons) =>
          seasons.map((s) => ({ label: s.season.title, value: s.season.id }))
        );
    },
    {
      key: () => ["seasons-for-competition", gameFormGroup.value.competition],
      initialValue: [],
    }
  );

  const teams = createServerData$(
    ([, competitionId, seasonId]) => {
      if (!competitionId || !seasonId) {
        return [];
      }

      return prisma.teamInCompetition
        .findMany({
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
        })
        .then((teams) =>
          teams.map((t) => ({ label: t.team.name, value: t.team.id }))
        );
    },
    {
      key: () => [
        "teams-in-season-competition",
        gameFormGroup.value.competition,
        gameFormGroup.value.season,
      ],
      initialValue: [],
    }
  );

  const homeTeamPlayers = createServerData$(
    ([, seasonId, teamId]) => getPlayersInTeamAndSeason(teamId, seasonId),
    {
      key: () => [
        "player-in-hometeam",
        gameFormGroup.value.season,
        gameFormGroup.value.homeTeam,
      ],
      initialValue: [],
    }
  );

  const awayTeamPlayers = createServerData$(
    ([, seasonId, teamId]) => getPlayersInTeamAndSeason(teamId, seasonId),
    {
      key: () => [
        "player-in-awayteam",
        gameFormGroup.value.season,
        gameFormGroup.value.awayTeam,
      ],
      initialValue: [],
    }
  );

  return (
    <Form class="mx-auto flex max-w-lg flex-col space-y-4">
      <Suspense>
        <Select
          name="competition"
          control={gameFormGroup.controls.competition}
          options={competitions() ?? []}
        />
      </Suspense>

      <Suspense>
        <Select
          name="season"
          control={gameFormGroup.controls.season}
          options={seasons() ?? []}
        />
      </Suspense>

      <span class="flex justify-around">
        <Suspense>
          <Select
            name="homeTeam"
            control={gameFormGroup.controls.homeTeam}
            options={teams() ?? []}
          />
        </Suspense>

        <Suspense>
          <Select
            name="awayTeam"
            control={gameFormGroup.controls.homeTeam}
            options={teams() ?? []}
          />
        </Suspense>
      </span>

      <span class="flex flex-col">
        <label for="kickoffTime">Kickoff time</label>
        <input id="kickoffTime" type="datetime-local" />
      </span>

      <span class="flex flex-col">
        <label for="kickoffTime">Is game over</label>
        <input type="checkbox" class="toggle" checked />
      </span>

      <button class="btn" type="submit">
        Save
      </button>
    </Form>
  );
};
