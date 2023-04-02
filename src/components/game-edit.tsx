import { Show, Suspense } from "solid-js";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { prisma } from "~/util/prisma";
import { Select, type Option, Date, Checkbox } from "./form-helpers";
import { createStore } from "solid-js/store";
import { EditLieneupWrapper } from "./lineup";

const ColorPicker = (props: {
  control: (c: string) => void;
  value: string;
  name: string;
  label: string;
}) => {
  return (
    <span class="flex flex-col">
      {props.value}
      <label for={props.name}>{props.label}</label>
      <input
        type="color"
        name={props.name}
        value={props.value}
        onInput={(e) => props.control(e.currentTarget.value)}
      />
    </span>
  );
};
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
    homeTeamShirtsColor: "#FF5733",
    awayTeamShirtsColor: "#3386FF",
    homeTeamGoalkeeperShirtsColor: "#581845",
    awayTeamGoalkeeperShirtsColor: "#DAF7A6",
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

  return (
    <Form class="mx-auto flex w-[50%] max-w-lg flex-col space-y-4">
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

      <div class="flex justify-start">
        <Show when={homeTeamPlayers() && awayTeamPlayers()}>
          <EditLieneupWrapper
            homeTeamPlayers={homeTeamPlayers() ?? []}
            awayTeamPlayers={awayTeamPlayers() ?? []}
            homeTeamShirtsColor={gameFormGroup.homeTeamShirtsColor}
            awayTeamShirtsColor={gameFormGroup.awayTeamShirtsColor}
            homeTeamGoalKeeperShirtsColor={
              gameFormGroup.homeTeamGoalkeeperShirtsColor
            }
            awayTeamGoalKeeperShirtsColor={
              gameFormGroup.awayTeamGoalkeeperShirtsColor
            }
          />
        </Show>

        <div class="flex flex-col justify-between">
          <ColorPicker
            label="Home team goalkeeper shirt color"
            value={gameFormGroup.homeTeamGoalkeeperShirtsColor}
            control={(val) =>
              gameFormGroupControls({ homeTeamGoalkeeperShirtsColor: val })
            }
            name="homeTeamGoalkeeperShirtsColor"
          />
          <ColorPicker
            label="Home team shirt color"
            value={gameFormGroup.homeTeamShirtsColor}
            control={(val) =>
              gameFormGroupControls({ homeTeamShirtsColor: val })
            }
            name="homeTeamShirtsColor"
          />

          <ColorPicker
            label="Away team shirt color"
            value={gameFormGroup.awayTeamShirtsColor}
            control={(val) =>
              gameFormGroupControls({ awayTeamShirtsColor: val })
            }
            name="awayTeamShirtsColor"
          />
          <ColorPicker
            label="Away team goalkeeper shirt color"
            value={gameFormGroup.awayTeamGoalkeeperShirtsColor}
            control={(val) =>
              gameFormGroupControls({ awayTeamGoalkeeperShirtsColor: val })
            }
            name="awayTeamGoalkeeperShirtsColor"
          />
        </div>
      </div>

      <button class="btn" type="submit">
        Save
      </button>
    </Form>
  );
};
