import { Suspense } from "solid-js";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { prisma } from "~/util/prisma";
import { Select, type Option, Date, Checkbox } from "./form-helpers";
import { createStore } from "solid-js/store";

export default (props: { competitions: Option[] }) => {
  const [enrolling, { Form }] = createServerAction$(
    async (formData: FormData) => {
      const data = Object.fromEntries(formData.entries());
      console.log(data);
    }
  );

  const [gameFormGroup, gameFormGroupControls] = createStore({
    competition: "",
    season: "",
    homeTeam: "",
    awayTeam: "",
    kickoffTime: "",
    isGameOver: true,
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
      key: () => ["seasons-for-competition", gameFormGroup.competition],
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
        gameFormGroup.competition,
        gameFormGroup.season,
      ],
      initialValue: [],
    }
  );

  const homeTeamPlayers = createServerData$(
    ([, seasonId, teamId]) => getPlayersInTeamAndSeason(teamId, seasonId),
    {
      key: () => [
        "player-in-hometeam",
        gameFormGroup.season,
        gameFormGroup.homeTeam,
      ],
      initialValue: [],
    }
  );

  const awayTeamPlayers = createServerData$(
    ([, seasonId, teamId]) => getPlayersInTeamAndSeason(teamId, seasonId),
    {
      key: () => [
        "player-in-awayteam",
        gameFormGroup.season,
        gameFormGroup.awayTeam,
      ],
      initialValue: [],
    }
  );

  const values = () => JSON.stringify(gameFormGroup);

  return (
    <Form class="mx-auto flex max-w-lg flex-col space-y-4">
      <Suspense fallback={<p>Čekamo</p>}>
        <Select
          label="Competition"
          name="competition"
          control={{
            setValue: (val) => gameFormGroupControls({ competition: val }),
            value: gameFormGroup.competition,
          }}
          options={props.competitions}
        />
      </Suspense>

      <Suspense fallback={<p>Čekamo</p>}>
        <Select
          label="Season"
          disabled={gameFormGroup.competition === ""}
          name="season"
          control={{
            setValue: (val) => gameFormGroupControls({ season: val }),
            value: gameFormGroup.season,
          }}
          options={seasons() ?? []}
        />
      </Suspense>

      <span class="flex justify-around">
        <Suspense fallback={<p>Čekamo</p>}>
          <Select
            label="Home team"
            disabled={gameFormGroup.season === ""}
            name="homeTeam"
            control={{
              setValue: (val) => gameFormGroupControls({ homeTeam: val }),
              value: gameFormGroup.homeTeam,
            }}
            options={teams() ?? []}
          />
        </Suspense>

        <Suspense>
          <Select
            label="Away team"
            disabled={gameFormGroup.season === ""}
            name="awayTeam"
            control={{
              setValue: (val) => gameFormGroupControls({ awayTeam: val }),
              value: gameFormGroup.awayTeam,
            }}
            options={teams() ?? []}
          />
        </Suspense>
      </span>

      <Date
        label="Kickoff time"
        name="kickoffTime"
        type="datetime-local"
        control={{
          setValue: (val) => gameFormGroupControls({ kickoffTime: val }),
          value: gameFormGroup.awayTeam,
        }}
      />

      <Checkbox
        label="Is game over"
        name="isGameOver"
        control={{
          setValue: (val) => gameFormGroupControls({ isGameOver: val }),
          value: gameFormGroup.isGameOver,
        }}
      />

      <button class="btn" type="submit">
        Save
      </button>
    </Form>
  );
};
