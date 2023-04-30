import { For, Match, Show, Switch } from "solid-js";
import { twMerge } from "tailwind-merge";
import { ArrayElement, GoalsInGame } from "~/server/games";
import { CardEvent, SubstitutionEvent } from "./events";

const SubstitutionInTimeline = (props: { sub: SubstitutionEvent }) => {
  const extraTime = () => {
    if (!props.sub.extraTimeMinute) return "";
    return ` ${props.sub.minute}''`;
  };
  return (
    <div
      class={`flex ${
        props.sub.isHomeTeam ? "self-start" : "flex-row-reverse self-end"
      }`}
    >
      <span
        classList={{
          "flex w-72 justify-between": true,
          "flex-row-reverse": props.sub.isHomeTeam,
        }}
      >
        {/*<span class="mx-4">{props.sub.cardType}</span>*/}
        <span
          classList={{
            "grow font-semibold": true,
            "text-end": props.sub.isHomeTeam,
            "text-start": !props.sub.isHomeTeam,
          }}
        >
          {props.sub.playerInName}
          {props.sub.playerOutName}
        </span>
        <span
          classList={{
            "text-end": props.sub.isHomeTeam,
            "text-start": !props.sub.isHomeTeam,
          }}
        >
          {`${props.sub.minute}\``}
          {extraTime()}
        </span>
      </span>
    </div>
  );
};

const CardInTimeline = (props: { card: CardEvent }) => {
  const extraTime = () => {
    if (!props.card.extraTimeMinute) return "";
    return ` ${props.card.minute}''`;
  };
  return (
    <div
      class={`flex ${
        props.card.isHomeTeam ? "self-start" : "flex-row-reverse self-end"
      }`}
    >
      <span
        class={twMerge(
          "flex w-72 justify-between",
          props.card.isHomeTeam && "flex-row-reverse"
        )}
      >
        <span class="mx-4">{props.card.cardType}</span>
        <span
          classList={{
            "grow font-semibold": true,
            "text-end": props.card.isHomeTeam,
            "text-start": !props.card.isHomeTeam,
          }}
        >
          {props.card.playerLastName}
        </span>
        <span
          classList={{
            "text-end": props.card.isHomeTeam,
            "text-start": !props.card.isHomeTeam,
          }}
        >
          {`${props.card.minute}\``}
          {extraTime()}
        </span>
      </span>
    </div>
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

type GameDetailProps = {
  goals: GoalsInGame | undefined;
  cards: CardEvent[] | undefined;
  substitutions: SubstitutionEvent[] | undefined;
  onRemoveGoal?: (index: number) => void;
  onRemoveCard?: (index: number) => void;
  onRemoveSubstitution?: (index: number) => void;
};

type Event = {
  minute: number;
  extraTimeMinute: number | undefined;
  card: { card: CardEvent; index: number } | null;
  goal: { goal: ArrayElement<GoalsInGame>; index: number } | null;
  substitution: { substitution: SubstitutionEvent; index: number } | null;
};

export default (gameData: GameDetailProps) => {
  let homeTeamGoalCount = 0;
  let awayTeamGoalCount = 0;

  const events = (): Event[] => {
    const e: Event[] = [];

    // Add all goals
    e.push(
      ...(gameData.goals ?? []).map((g, i) => {
        const event: Event = {
          minute: g.scoredInMinute,
          extraTimeMinute: g.scoredInExtraMinute ?? undefined,
          goal: {
            goal: g,
            index: i,
          },
          card: null,
          substitution: null,
        };
        return event;
      })
    );

    // Add all cards
    e.push(
      ...(gameData.cards ?? []).map((c, i) => {
        const event: Event = {
          minute: c.minute,
          extraTimeMinute: c.extraTimeMinute,
          goal: null,
          substitution: null,
          card: {
            card: c,
            index: i,
          },
        };
        return event;
      })
    );

    // Add all subs
    e.push(
      ...(gameData.substitutions ?? []).map((s, i) => {
        const event: Event = {
          minute: s.minute,
          extraTimeMinute: s.extraTimeMinute,
          goal: null,
          card: null,
          substitution: {
            substitution: s,
            index: i,
          },
        };
        return event;
      })
    );

    e.sort((a, b) => {
      if (a.minute < b.minute) {
        return -1;
      }
      if (a.minute < b.minute) {
        return 1;
      }

      if ((a.extraTimeMinute ?? 0) < (b.extraTimeMinute ?? 0)) {
        return -1;
      }
      if ((a.extraTimeMinute ?? 0) < (b.extraTimeMinute ?? 0)) {
        return 1;
      }

      return 0;
    });

    return e;
  };

  return (
    <div class="flex flex-col-reverse">
      <Show when={events().length === 0}>
        <p class="w-full text-center">No events</p>
      </Show>

      <For each={events()}>
        {(event, index) => (
          <Switch>
            <Match when={event.goal} keyed>
              {(goal) => (
                <div class="flex">
                  <div class="grow">
                    <GoalInTimeline
                      scoredInExtraMinute={goal.goal.scoredInExtraMinute}
                      scoredInMinute={goal.goal.scoredInMinute}
                      scorer={goal.goal.scoredBy}
                      assistent={goal.goal.assistedBy}
                      isHomeTeamGoal={goal.goal.isHomeTeamGoal}
                      homeTeamCurrentGoalCount={
                        goal.goal.isHomeTeamGoal
                          ? ++homeTeamGoalCount
                          : homeTeamGoalCount
                      }
                      awayTeamCurrentGoalCount={
                        goal.goal.isHomeTeamGoal
                          ? awayTeamGoalCount
                          : ++awayTeamGoalCount
                      }
                    />
                  </div>
                  <Show when={gameData.onRemoveGoal} keyed>
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
            </Match>

            {/* Cards */}

            <Match when={event.card} keyed>
              {(card) => (
                <div class="flex">
                  <div class="grow">
                    <CardInTimeline card={card.card} />
                  </div>
                  <Show when={gameData.onRemoveCard} keyed>
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
            </Match>

            {/* Subs */}

            <Match when={event.substitution} keyed>
              {(substitution) => (
                <div class="flex">
                  <div class="grow">
                    <SubstitutionInTimeline sub={substitution.substitution} />
                  </div>
                  {/*
                    TODO: extract delete into new component
                    */}
                  <Show when={gameData.onRemoveSubstitution} keyed>
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
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
};
