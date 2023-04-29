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

type GameDetailProps = {
  goals: GoalsInGame | undefined;
  onRemove?: (index: number) => void;
};

export default (gameData: GameDetailProps) => {
  let homeTeamGoalCount = 0;
  let awayTeamGoalCount = 0;

  return (
    <div class="flex flex-col-reverse">
      <Show when={gameData.goals?.length === 0}>
        <p class="w-full text-center">No goals</p>
      </Show>
      <For each={gameData.goals}>
        {(goal, index) => (
          <div class="flex">
            <div class="grow">
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
            </div>
            <Show when={gameData.onRemove} keyed>
              {(callback) => (
                <button
                  class="btn-outline btn-error btn-square btn mx-2 gap-2"
                  type="button"
                  onClick={() => {
                    callback(index());
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
              )}
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};
