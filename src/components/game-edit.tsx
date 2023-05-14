import { Resource, Show, Suspense, createEffect, createMemo } from "solid-js";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { Select, type Option, DateSelector } from "./form-helpers";
import { createStore } from "solid-js/store";
import { EditLieneupWrapper, type Formation } from "./lineup";
import {
  AddCardEvent,
  AddGoalEvent,
  AddSubstitutionEvent,
  CardEvent,
  Goal,
  SubstitutionEvent,
} from "./events";
import GameDetail from "./game-detail";
import { GoalsInGame, updateOrSaveGame } from "~/server/games";
import {
  StatisticEditor,
  StatisticsForm,
  defaultStatisticsFrom,
} from "./statistic";
import { PlayerInTeamLineup } from "~/server/lineups";
import { getMappedGoals } from "~/server/goals";
import { getSeasonsFromCompetition } from "~/server/seasons";
import { getTeamsInSeasonAndCompetition } from "~/server/teams";
import { getManagersForTeamInSeason } from "~/server/managers";

export const ColorPicker = (props: {
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

export type GameForm = {
  id: string | undefined;
  homeTeamManager: string;
  awayTeamManager: string;
  competition: string;
  season: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  status: string;
  homeTeamShirtsColor: string;
  awayTeamShirtsColor: string;
  homeTeamGoalkeeperShirtsColor: string;
  awayTeamGoalkeeperShirtsColor: string;
  homeTeamLineup: PlayerInTeamLineup[];
  awayTeamLineup: PlayerInTeamLineup[];
  homeTeamFormation: Formation;
  awayTeamFormation: Formation;
  goals: Goal[];
  cards: CardEvent[];
  substitutions: SubstitutionEvent[];
};
export const [gameFormGroup, gameFormGroupControls] = createStore<GameForm>({
  id: undefined,
  homeTeamManager: "",
  awayTeamManager: "",
  competition: "",
  season: "",
  homeTeam: "",
  awayTeam: "",
  kickoffTime: "",
  status: "",
  homeTeamShirtsColor: "#FF5733",
  awayTeamShirtsColor: "#3386FF",
  homeTeamGoalkeeperShirtsColor: "#581845",
  awayTeamGoalkeeperShirtsColor: "#DAF7A6",
  homeTeamLineup: [],
  awayTeamLineup: [],
  homeTeamFormation: "442",
  awayTeamFormation: "433",
  goals: [],
  cards: [],
  substitutions: [],
});

const noDuplicatePlayers = (players: PlayerInTeamLineup[]) => {
  const unique = new Set(players.map((p) => p.playerId));
  return unique.size === players.length;
};

const formationOptions: Option[] = [
  { label: "442", value: "442" },
  { label: "433", value: "433" },
  { label: "4231", value: "4231" },
  { label: "352", value: "352" },
  { label: "3511", value: "3511" },
  { label: "343", value: "343" },
  { label: "532", value: "532" },
];

const GoalsDisplay = () => {
  const goals: Resource<GoalsInGame | undefined> = createServerData$(
    async ([, fg]) => getMappedGoals(fg as Goal[]),
    { key: () => ["goal-info", gameFormGroup.goals] }
  );

  return (
    <Suspense fallback="Loading player data">
      <GameDetail
        goals={goals()}
        cards={gameFormGroup.cards}
        substitutions={gameFormGroup.substitutions}
        onRemoveSubstitution={(index) => {
          gameFormGroupControls("substitutions", (subs) =>
            [...subs].filter((_, i) => i !== index)
          );
        }}
        onRemoveCard={(index) => {
          gameFormGroupControls("cards", (crds) =>
            [...crds].filter((_, i) => i !== index)
          );
        }}
        onRemoveGoal={(index) => {
          gameFormGroupControls("goals", (gls) =>
            [...gls].filter((_, i) => i !== index)
          );
        }}
      />
    </Suspense>
  );
};

const gameStatusOptions: Option[] = [
  { label: "Not started", value: "NOT_STARTED" },
  { label: "Started", value: "STARTED" },
  { label: "Halftime", value: "HALFTIME" },
  { label: "Over", value: "OVER" },
];

export default (props: {
  competitions: Option[];
  gameData?: GameForm;
  statisticsData?: StatisticsForm;
}) => {
  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const game = JSON.parse(formData.get("gameStore") as string) as GameForm;
    const statistics = JSON.parse(
      formData.get("statisticsStore") as string
    ) as StatisticsForm;

    console.log("game", game);
    console.log("statistics", statistics);

    const gameId = await updateOrSaveGame(game, statistics);
    return redirect(`/game/${gameId}/goals`);
  });

  const [statistics, setStatistics] = createStore<StatisticsForm>(
    defaultStatisticsFrom()
  );

  createEffect(() => {
    const gameData = props.gameData;
    const stats = props.statisticsData;

    if (gameData) {
      console.log(gameData);
      gameFormGroupControls(gameData);
    }

    if (stats) {
      setStatistics(stats);
    }
  });

  createEffect(() => {
    if (gameFormGroup.status === "NOT_STARTED") {
      setStatistics(defaultStatisticsFrom());
    }
  });

  const seasons = createServerData$(
    async ([, competition]) => getSeasonsFromCompetition(competition),
    {
      key: () => ["seasons-for-competition", gameFormGroup.competition],
      initialValue: [],
    }
  );

  const teams = createServerData$(
    ([, competitionId, seasonId]) =>
      getTeamsInSeasonAndCompetition(seasonId, competitionId),
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

  const homeTeamManagers = createServerData$(
    ([, seasonId, teamId]) => getManagersForTeamInSeason(teamId, seasonId),
    {
      key: () => [
        "managers-in-hometeam",
        gameFormGroup.season,
        gameFormGroup.homeTeam,
      ],
      initialValue: [],
    }
  );

  const awayTeamManagers = createServerData$(
    ([, seasonId, teamId]) => getManagersForTeamInSeason(teamId, seasonId),
    {
      key: () => [
        "managers-in-awayteam",
        gameFormGroup.season,
        gameFormGroup.awayTeam,
      ],
      initialValue: [],
    }
  );

  const isFormValid = createMemo(() => {
    return (
      gameFormGroup.homeTeam !== gameFormGroup.awayTeam &&
      gameFormGroup.homeTeamLineup.length === 11 &&
      gameFormGroup.awayTeamLineup.length === 11 &&
      noDuplicatePlayers(gameFormGroup.homeTeamLineup) &&
      noDuplicatePlayers(gameFormGroup.awayTeamLineup)
      /*
      lineupPlayerSchema.array().safeParse(gameFormGroup.homeTeamLineup.length).success &&
      lineupPlayerSchema.array().safeParse(gameFormGroup.awayTeamLineup.length).success &&
      */
    );
  });

  return (
    <Form class="group mx-auto flex w-[70%] max-w-2xl flex-col space-y-4">
      <div class="flex flex-col">
        <input
          type="hidden"
          name="gameStore"
          value={JSON.stringify(gameFormGroup)}
        />
        <input
          type="hidden"
          name="statisticsStore"
          value={JSON.stringify(statistics)}
        />

        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Competition"
            name="competition"
            required
            control={{
              setValue: (val) => gameFormGroupControls({ competition: val }),
              value: gameFormGroup.competition,
            }}
            options={props.competitions}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Season"
            disabled={gameFormGroup.competition === ""}
            name="season"
            required
            control={{
              setValue: (val) => gameFormGroupControls({ season: val }),
              value: gameFormGroup.season,
            }}
            options={seasons() ?? []}
          />
        </Suspense>
      </div>

      <span class="grid grid-flow-col justify-stretch gap-2">
        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Home team"
            disabled={gameFormGroup.season === ""}
            name="homeTeam"
            required
            control={{
              setValue: (val) => {
                if (val !== gameFormGroup.homeTeam) {
                  gameFormGroupControls("homeTeamLineup", []);
                }
                gameFormGroupControls({ season: val });
              },
              value: "clfqiqdjh0025uvwm2vi0pp6r",
            }}
            options={teams() ?? []}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Away team"
            disabled={gameFormGroup.season === ""}
            name="awayTeam"
            required
            control={{
              setValue: (val) => {
                if (val !== gameFormGroup.awayTeam) {
                  gameFormGroupControls("awayTeamLineup", []);
                }
                gameFormGroupControls({ awayTeam: val });
              },
              value: gameFormGroup.awayTeam,
            }}
            options={teams() ?? []}
          />
        </Suspense>
      </span>

      <span class="grid grid-cols-2 justify-stretch gap-2">
        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Home team manager"
            disabled={gameFormGroup.homeTeam === ""}
            name="homeTeamManager"
            required
            control={{
              setValue: (val) =>
                gameFormGroupControls({ homeTeamManager: val }),
              value: gameFormGroup.homeTeamManager,
            }}
            options={homeTeamManagers() ?? []}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Select
            label="Away team manager"
            disabled={gameFormGroup.awayTeam === ""}
            name="awayTeam"
            required
            control={{
              setValue: (val) =>
                gameFormGroupControls({ awayTeamManager: val }),
              value: gameFormGroup.awayTeamManager,
            }}
            options={awayTeamManagers() ?? []}
          />
        </Suspense>
      </span>

      <DateSelector
        label="Kickoff time"
        name="kickoffTime"
        type="datetime-local"
        control={{
          setValue: (val) => gameFormGroupControls({ kickoffTime: val }),
          value: gameFormGroup.kickoffTime.split(".")[0],
        }}
      />

      <Select
        label="Game status"
        name="gameStatus"
        required
        control={{
          value: gameFormGroup.status,
          setValue: (val) => gameFormGroupControls({ status: val }),
        }}
        options={gameStatusOptions}
      />

      <Show when={import.meta.env.DEV}>
        <pre>{JSON.stringify(gameFormGroup, null, 2)}</pre>
      </Show>
      <div class="flex justify-start">
        <Suspense>
          <Show when={homeTeamPlayers() && awayTeamPlayers()}>
            <EditLieneupWrapper
              homeTeamPlayers={homeTeamPlayers() ?? []}
              awayTeamPlayers={awayTeamPlayers() ?? []}
              homeTeamShirtsColor={gameFormGroup.homeTeamShirtsColor}
              awayTeamShirtsColor={gameFormGroup.awayTeamShirtsColor}
              homeTeamFormation={gameFormGroup.homeTeamFormation}
              awayTeamFormation={gameFormGroup.awayTeamFormation}
              homeTeamGoalKeeperShirtsColor={
                gameFormGroup.homeTeamGoalkeeperShirtsColor
              }
              awayTeamGoalKeeperShirtsColor={
                gameFormGroup.awayTeamGoalkeeperShirtsColor
              }
              homeTeamLineup={gameFormGroup.homeTeamLineup}
              awayTeamLineup={gameFormGroup.awayTeamLineup}
            />
          </Show>
        </Suspense>

        <div class="flex shrink flex-col justify-between">
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

          <Select
            options={formationOptions}
            label="Home team formation"
            name="homeTeamFormation"
            required
            control={{
              setValue: (val) =>
                gameFormGroupControls({ homeTeamFormation: val as Formation }),
              value: gameFormGroup.homeTeamFormation,
            }}
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

          <Select
            options={formationOptions}
            label="Away team formation"
            name="awayTeamFormation"
            required
            control={{
              setValue: (val) =>
                gameFormGroupControls({ awayTeamFormation: val as Formation }),
              value: gameFormGroup.awayTeamFormation,
            }}
          />
        </div>
      </div>

      <div class="divider" />
      <pre class="text-xl font-bold">Events</pre>

      <div class="grid grid-flow-col justify-stretch gap-2">
        <AddGoalEvent
          homeTeamPlayers={homeTeamPlayers() ?? []}
          awayTeamPlayers={awayTeamPlayers() ?? []}
        />

        <AddCardEvent
          homeTeamPlayers={homeTeamPlayers() ?? []}
          awayTeamPlayers={awayTeamPlayers() ?? []}
        />

        <AddSubstitutionEvent
          homeTeamPlayers={homeTeamPlayers() ?? []}
          awayTeamPlayers={awayTeamPlayers() ?? []}
        />
      </div>

      <Suspense fallback="Loading player data">
        <GoalsDisplay />
      </Suspense>

      {/* Statistics */}
      <Show when={gameFormGroup.status !== "NOT_STARTED"}>
        <div class="divider" />
        <pre class="text-xl font-bold">Statistics</pre>

        <StatisticEditor value={statistics} control={setStatistics} />
      </Show>

      <button
        class="btn group-invalid:btn-disabled"
        type="submit"
        disabled={!isFormValid()}
      >
        Save
      </button>
    </Form>
  );
};
