import { For, Match, Show, Switch } from "solid-js";
import { ArrayElement, GoalsInGame } from "~/server/games";
import { CardEvent, SubstitutionEvent } from "./events";
import { A } from "solid-start";

const SubstitutionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="h-6 w-6 self-center"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
    />
  </svg>
);

const SubstitutionInTimeline = (props: { sub: SubstitutionEvent }) => {
  const extraTime = () => {
    if (!props.sub.extraTimeMinute) return "";
    return ` ${props.sub.minute}''`;
  };
  return (
    <div
      class="flex"
      classList={{
        "self-start": props.sub.isHomeTeam,
        "flex-row-reverse self-end": !props.sub.isHomeTeam,
      }}
    >
      <span
        class="flex w-72 justify-between"
        classList={{
          "flex-row-reverse": props.sub.isHomeTeam,
        }}
      >
        <SubstitutionIcon />
        <div
          class="grow px-4"
          classList={{
            "text-end": props.sub.isHomeTeam,
            "text-start": !props.sub.isHomeTeam,
          }}
        >
          <p
            classList={{
              "grow font-semibold": true,
            }}
          >
            <A href={`/player/${props.sub.playerInId}`} class="hover:link">
              {props.sub.playerInName}
            </A>
          </p>
          <A href={`/player/${props.sub.playerOutId}`} class="hover:link">
            {props.sub.playerOutName}
          </A>
        </div>
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
      class="flex"
      classList={{
        "self-start": props.card.isHomeTeam,
        "flex-row-reverse self-end": !props.card.isHomeTeam,
      }}
    >
      <span
        class="flex w-72 justify-between"
        classList={{
          "flex-row-reverse": props.card.isHomeTeam,
        }}
      >
        <Switch>
          <Match when={props.card.cardType === "YELLOW"}>
            <div class="border-1 mx-4 aspect-[9/16] h-full rounded-sm border border-black bg-yellow-400" />
          </Match>
          <Match when={props.card.cardType === "RED"}>
            <div class="border-1 mx-4 aspect-[9/16] h-full rounded-sm border border-black bg-red-600" />
          </Match>
          <Match when={props.card.cardType === "SECOND_YELLOW"}>
            <div class="border-1 mx-2 aspect-[9/16] h-full rounded-sm border border-black bg-red-600" />
            <div class="border-1 mx-2 aspect-[9/16] h-full rounded-sm border border-black bg-yellow-400" />
          </Match>
        </Switch>
        <A
          href={`/player/${props.card.playerId}`}
          class="hover:link"
          classList={{
            "grow font-semibold": true,
            "text-end": props.card.isHomeTeam,
            "text-start": !props.card.isHomeTeam,
          }}
        >
          {props.card.playerLastName}
        </A>
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
  scorer: { firstName: string; lastName: string; id: string };
  assistent: { firstName: string; lastName: string; id: string } | null;
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
      class="flex"
      classList={{
        "self-start": goal.isHomeTeamGoal,
        "flex-row-reverse self-end": !goal.isHomeTeamGoal,
      }}
    >
      <span
        class="flex min-w-[18rem] justify-between"
        classList={{
          "flex-row-reverse": goal.isHomeTeamGoal,
        }}
      >
        <span class="mx-4">
          {goal.homeTeamCurrentGoalCount} - {goal.awayTeamCurrentGoalCount}
        </span>

        <span
          class="grow font-semibold"
          classList={{
            "text-end": goal.isHomeTeamGoal,
            "text-start": !goal.isHomeTeamGoal,
          }}
        >
          <p>
            <A href={`/player/${goal.scorer.id}`} class="hover:link">
              {`${goal.scorer.firstName} ${goal.scorer.lastName}`}
            </A>
          </p>
          <Show when={goal.assistent}>
            <A
              href={`/player/${goal.assistent?.id}`}
              class="font-thin hover:link"
            >
              {`${goal.assistent?.firstName} ${goal.assistent?.lastName}`}
            </A>
          </Show>
        </span>

        <span
          class=""
          classList={{
            "text-end mr-2": goal.isHomeTeamGoal,
            "text-start ml-2": !goal.isHomeTeamGoal,
          }}
        >
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
  goal: {
    goal: ArrayElement<GoalsInGame> & {
      homeTeamGoalCount: number;
      awayTeamGoalCount: number;
    };
    index: number;
  } | null;
  substitution: { substitution: SubstitutionEvent; index: number } | null;
};

export default (gameData: GameDetailProps) => {
  const events = (): Event[] => {
    const e: Event[] = [];

    let homeTeamGoalCount = 0;
    let awayTeamGoalCount = 0;
    // Add all goals
    e.push(
      ...(gameData.goals ?? []).map((g, i) => {
        const event: Event = {
          minute: g.scoredInMinute,
          extraTimeMinute: g.scoredInExtraMinute ?? undefined,
          goal: {
            goal: {
              ...g,
              homeTeamGoalCount: g.isHomeTeamGoal
                ? ++homeTeamGoalCount
                : homeTeamGoalCount,

              awayTeamGoalCount: g.isHomeTeamGoal
                ? awayTeamGoalCount
                : ++awayTeamGoalCount,
            },
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
    <div class="flex flex-col-reverse space-y-4">
      <Show when={events().length === 0}>
        <p class="w-full text-center">No events</p>
      </Show>

      <For each={events()}>
        {(event) => (
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
                      homeTeamCurrentGoalCount={goal.goal.homeTeamGoalCount}
                      awayTeamCurrentGoalCount={goal.goal.awayTeamGoalCount}
                    />
                  </div>
                  <Show when={gameData.onRemoveGoal} keyed>
                    {(callback) => (
                      <button
                        class="btn-outline btn-error btn-square btn mx-2 gap-2"
                        type="button"
                        onClick={() => {
                          callback(goal.index);
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
                          callback(card.index);
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
                          callback(substitution.index);
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
