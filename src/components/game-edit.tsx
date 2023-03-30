import { createFormControl, createFormGroup } from "solid-forms";
import { Suspense } from "solid-js";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { prisma } from "~/util/prisma";
import { Select, type Option } from "./form-helpers";

export default (props: { competitions: Option[] }) => {
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
      <Suspense fallback={<p>Čekamo</p>}>
        <Select
          name="competition"
          control={gameFormGroup.controls.competition}
          options={props.competitions}
        />
      </Suspense>

      <Suspense fallback={<p>Čekamo</p>}>
        <Select
          name="season"
          control={gameFormGroup.controls.season}
          options={seasons() ?? []}
        />
      </Suspense>

      <span class="flex justify-around">
        <Suspense fallback={<p>Čekamo</p>}>
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
}
