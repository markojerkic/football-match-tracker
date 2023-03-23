import dayjs from "dayjs";
import { Tab, TabGroup, TabList, TabPanel } from "solid-headless";
import { For, Show, createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";
import { GameDataById, GoalsInGame } from "~/server/games";

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

export default (gameData: { goals?: GoalsInGame }) => {
  let homeTeamGoalCount = 0;
  let awayTeamGoalCount = 0;

  return (
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
              goal.isHomeTeamGoal ? ++homeTeamGoalCount : homeTeamGoalCount
            }
            awayTeamCurrentGoalCount={
              goal.isHomeTeamGoal ? awayTeamGoalCount : ++awayTeamGoalCount
            }
          />
        )}
      </For>
    </div>
  );
};
