import dayjs from "dayjs";
import { For, Show, createMemo } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { prisma } from "~/util/prisma";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(
    ([, id]) => {
      return prisma.game.findUniqueOrThrow({
        where: { id },
        select: {
          kickoffTime: true,
          homeTeam: {
            select: {
              name: true,
            },
          },
          awayTeam: {
            select: {
              name: true,
            },
          },
          goals: {
            orderBy: {
              scoredInMinute: "asc",
            },
            select: {
              isOwnGoal: true,
              isPenalty: true,
              isHomeTeamGoal: true,
              scoredBy: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              assistedBy: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              scoredInMinute: true,
              scoredInExtraMinute: true,
            },
          },
        },
      });
    },
    { key: () => ["game-data", params.id] }
  );
};

const GoalInTimeline = (goal: {
  scorer: { firstName: string; lastName: string };
  assistent: { firstName: string; lastName: string } | null;
  scoredInMinute: number;
  scoredInExtraMinute: number | null;
  isHomeTeamGoal: boolean;
  homeTeamCurrentGoalCount: number;
  awayTeamCurrentGoalCount: number;
}) => {
  const extraTime = () => {
    if (!goal.scoredInExtraMinute) return "";
    return ` ${goal.scoredInExtraMinute}''`;
  };
  return (
    <div
      class={`flex ${
        goal.isHomeTeamGoal ? "self-start" : "flex-row-reverse self-end"
      }`}
    >
      <span
        class={twMerge(
          "flex w-72 justify-between",
          goal.isHomeTeamGoal && "flex-row-reverse"
        )}
      >
        <span class="mx-4">
          {goal.homeTeamCurrentGoalCount} - {goal.awayTeamCurrentGoalCount}
        </span>
        <span
          class={twMerge(
            "grow font-semibold",
            goal.isHomeTeamGoal ? "text-end" : "text-start"
          )}
        >{`${goal.scorer.firstName} ${goal.scorer.lastName}`}</span>
        <span class={twMerge(goal.isHomeTeamGoal ? "text-end" : "text-start")}>
          {`${goal.scoredInMinute}'`}
          {extraTime()}
        </span>
      </span>
    </div>
  );
};

export default () => {
  const gameData = useRouteData<typeof routeData>();

  const calendarDate = createMemo(() =>
    dayjs(gameData()?.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() =>
    dayjs(gameData()?.kickoffTime).format("HH:mm")
  );

  const result = () => {
    let homeTeamGoalCount = 0;
    let awayTeamGoalCount = 0;

    for (let goal of gameData()?.goals ?? []) {
      if (goal.isHomeTeamGoal) {
        homeTeamGoalCount++;
        continue;
      }
      awayTeamGoalCount++;
    }

    return `${homeTeamGoalCount} - ${awayTeamGoalCount}`;
  };

  let homeTeamGoalCount = 0;
  let awayTeamGoalCount = 0;

  return (
    <div class="flex flex-col space-y-4">
      <Show when={gameData()} keyed>
        {(gameData) => (
          <>
            <div class="relative h-full w-full transform border-2 border-black bg-white">
              <div class="flex flex-col p-4">
                {/* Content */}
                <span class="flex space-x-4 text-sm">
                  <span>{calendarDate()}</span>
                  <span>{kickoffTime()}</span>
                </span>
                <span class="flex w-full flex-col">
                  <span class="flex w-full justify-center space-x-4">
                    <span class="text-lg font-bold">
                      {gameData.homeTeam.name}
                    </span>
                    <span>{result()}</span>
                    <span class="text-lg font-bold">
                      {gameData.awayTeam.name}
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div class="relative h-full w-full transform border-2 border-black bg-white p-4">
              <div class="flex flex-col-reverse">
                <For each={gameData.goals}>
                  {(goal) => (
                    <GoalInTimeline
                      scoredInExtraMinute={goal.scoredInExtraMinute}
                      scoredInMinute={goal.scoredInMinute}
                      scorer={goal.scoredBy}
                      assistent={goal.assistedBy}
                      isHomeTeamGoal={goal.isHomeTeamGoal}
                      homeTeamCurrentGoalCount={
                        goal.isHomeTeamGoal
                          ? ++homeTeamGoalCount
                          : homeTeamGoalCount
                      }
                      awayTeamCurrentGoalCount={
                        goal.isHomeTeamGoal
                          ? awayTeamGoalCount
                          : ++awayTeamGoalCount
                      }
                    />
                  )}
                </For>
              </div>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};
