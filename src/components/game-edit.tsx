import { Resource, Show, Suspense, createEffect, createMemo } from "solid-js";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getPlayersInTeamAndSeason } from "~/server/players";
import { prisma } from "~/util/prisma";
import { Select, type Option, Date } from "./form-helpers";
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
import { GameStatus } from "@prisma/client";
import { PlayerInTeamLineup } from "~/server/lineups";

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

export type GameForm = {
  id: string | undefined;
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
    async ([, fg]) => {
      const formGoals = fg as Goal[];

      const playerIds = formGoals
        .map((g) => [g.scorerId, g.assistentId])
        .flat()
        .filter((id) => id !== undefined);
      console.log("playerIds", playerIds);
      const players = await prisma.player.findMany({
        where: {
          id: {
            in: playerIds as string[],
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      console.log("players", players);

      const mappedGoals: GoalsInGame = formGoals.map((g) => {
        const scorer = players.find((p) => p.id === g.scorerId);
        const assistent = players.find((p) => p.id === g.assistentId);

        const goal: GetElementType<GoalsInGame> = {
          isOwnGoal: g.isOwnGoal,
          isPenalty: g.isPenalty,
          scoredInMinute: g.scoredInMinute,
          scoredInExtraMinute: g.scoredInExtraMinute ?? null,
          scoredBy: {
            firstName: scorer?.firstName ?? "",
            lastName: scorer?.lastName ?? "",
          },

          assistedBy: null,
          isHomeTeamGoal: g.isHomeTeamGoal,
        };
        if (assistent !== undefined) {
          goal.assistedBy = {
            firstName: assistent?.firstName ?? "",
            lastName: assistent?.lastName ?? "",
          };
        }
        return goal;
      });

      return mappedGoals;
    },
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

type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

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
    return redirect(`/game/${gameId}/lineup`);
  });

  const [statistics, setStatistics] = createStore<StatisticsForm>(
    defaultStatisticsFrom()
  );

  createEffect(() => {
    const gameData = props.gameData;
    const stats = props.statisticsData;

    if (gameData) {
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
    <Form class="group mx-auto flex w-[50%] max-w-lg flex-col space-y-4">
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
          value: gameFormGroup.kickoffTime.split(".")[0],
        }}
      />

      <Select
        label="Game status"
        name="gameStatus"
        control={{
          value: gameFormGroup.status,
          setValue: (val) =>
            gameFormGroupControls({ status: val as GameStatus }),
        }}
        options={gameStatusOptions}
      />

      <pre>
        {gameFormGroup.homeTeam}-{gameFormGroup.awayTeam}-
        {gameFormGroup.homeTeamLineup.length}-
        {gameFormGroup.awayTeamLineup.length}-
        {noDuplicatePlayers(gameFormGroup.homeTeamLineup) ? "tr" : "falc"}-
        {noDuplicatePlayers(gameFormGroup.awayTeamLineup) ? "tr" : "falc"}
      </pre>

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

          <Select
            options={formationOptions}
            label="Home team formation"
            name="homeTeamFormation"
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
