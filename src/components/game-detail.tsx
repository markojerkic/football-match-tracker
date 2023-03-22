import dayjs from "dayjs";
import { Tab, TabGroup, TabList, TabPanel } from "solid-headless";
import { For, Match, Show, Switch, createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";
import { SingleGameInfo } from "~/routes/game/[id]";

const tabs = [
  { value: 0, label: "Goals" },
  { value: 1, label: "Lineups" },
  { value: 2, label: "Statistics" },
];

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
      class={`flex ${goal.isHomeTeamGoal ? "self-start" : "flex-row-reverse self-end"
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

const inactiveStyle = "block p-4 text-sm font-medium text-black";
const activeStyle =
  "relative block border-t border-l border-r border-gray-400 bg-white p-4 text-sm font-medium";

export default (gameData: SingleGameInfo) => {
  const calendarDate = createMemo(() =>
    dayjs(gameData.kickoffTime).format("DD.MM.YYYY.")
  );
  const kickoffTime = createMemo(() =>
    dayjs(gameData.kickoffTime).format("HH:mm")
  );

  const result = () => {
    let homeTeamGoalCount = 0;
    let awayTeamGoalCount = 0;

    for (let goal of gameData.goals) {
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
    <>
      <div class="relative h-full w-full transform border-2 border-black bg-white">
        <div class="flex flex-col p-4 space-y-6">
          {/* Content */}
          <span class="flex space-x-4 text-sm">
            <span>{calendarDate()}</span>
            <span>{kickoffTime()}</span>
          </span>
          <span class="flex w-full flex-col">
            <span class="flex w-full justify-center space-x-4">
              <span class="text-lg font-bold">{gameData.homeTeam.name}</span>
              <span>{result()}</span>
              <span class="text-lg font-bold">{gameData.awayTeam.name}</span>
            </span>
          </span>
        </div>
      </div>
      <TabGroup class="my-4" defaultValue={1} horizontal={false}>
        {({ isSelected, isActive }) => (
          <div class="flex flex-col space-y-4">

            <TabList class="flex border-b border-gray-400 text-center">
              <For each={tabs}>
                {(tab) => (
                  <Tab class="flex-1" value={tab.value} >
                    <span class={isSelected(tab.value) ? activeStyle : inactiveStyle} >
                      <Show when={isSelected(tab.value)}>
                        <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
                      </Show>
                      {tab.label}
                    </span>
                  </Tab>
                )}
              </For>
            </TabList>
            <div>
              <For each={tabs}>
                {(tab) => (
                  <TabPanel value={tab.value}>

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
                                goal.isHomeTeamGoal ? ++homeTeamGoalCount : homeTeamGoalCount
                              }
                              awayTeamCurrentGoalCount={
                                goal.isHomeTeamGoal ? awayTeamGoalCount : ++awayTeamGoalCount
                              }
                            />
                          )}
                        </For>
                      </div>
                    </div>
                  </TabPanel>
                )}
              </For>
            </div>
          </div>
        )}
      </TabGroup>
    </>
  );
};
