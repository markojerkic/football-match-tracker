import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import { z } from "zod";
import { type Option, Select, Checkbox } from "~/components/form-helpers";
import { gameFormGroupControls } from "./game-edit";

const goalSchema = z.object({
  id: z.string().optional(),
  isHomeTeamGoal: z.boolean(),
  scorerId: z.string(),
  assistentId: z.string().optional(),
  isOwnGoal: z.boolean(),
  isPenalty: z.boolean(),
  scoredInMinute: z.number().min(1).max(120),
  scoredInExtraMinute: z.number().min(1).max(15).optional(),
});
export type Goal = z.infer<typeof goalSchema>;

const defaultGoal = (): Goal => ({
  isHomeTeamGoal: false,
  scorerId: "",
  isPenalty: false,
  isOwnGoal: false,
  scoredInMinute: 0,
  assistentId: undefined,
  scoredInExtraMinute: undefined,
});

const [goal, setGoal] = createStore<Goal>(defaultGoal());
const AddGoal = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
  onClose: () => void;
}) => {
  const [isHomeTeam, setIsHomeTeam] = createSignal(true);

  createEffect(() => {
    setGoal({ isHomeTeamGoal: isHomeTeam() });
  });

  const playersOptions = createMemo(() => {
    if (isHomeTeam()) {
      return props.homeTeamPlayers;
    }
    return props.awayTeamPlayers;
  });

  const [isGoalValid] = createResource(
    () => goal,
    (g) => goalSchema.safeParseAsync(g).then((v) => v.success),
    // (g) => goalSchema.safeParse(g).success,
    { initialValue: false }
  );

  return (
    <div>
      <Checkbox
        label="Is home team goal"
        name="isHomeTeamGoal"
        control={{
          setValue: setIsHomeTeam,
          value: isHomeTeam(),
        }}
      />

      <Checkbox
        label="Is own goal"
        name="isOwnGoal"
        control={{
          setValue: (val) => setGoal({ isOwnGoal: val }),
          value: goal.isOwnGoal,
        }}
      />

      <Checkbox
        label="Goal is from a penalty"
        name="isPenalty"
        control={{
          setValue: (val) => setGoal({ isPenalty: val }),
          value: goal.isPenalty,
        }}
      />

      <Select
        label="Scored by"
        name="scorerId"
        required
        control={{
          setValue: (val) => setGoal({ scorerId: val }),
          value: goal.scorerId,
        }}
        options={playersOptions()}
      />

      <Select
        label="Assisted by"
        name="assistentId"
        required
        control={{
          setValue: (val) => setGoal({ assistentId: val }),
          value: goal.assistentId ?? "",
        }}
        options={playersOptions()}
      />

      <div class="my-4 flex flex-col space-y-2">
        <label for="scoredInMinute">Scored in minute</label>
        <input
          class="h-12 w-12 text-center invalid:input-error invalid:border"
          type="number"
          name="scoredInMinute"
          min="1"
          max="120"
          onChange={(e) => setGoal({ scoredInMinute: +e.currentTarget.value })}
          value={goal.scoredInMinute}
        />
        {/* TODO: add invalid text */}

        <label for="scoredInMinute">Scored in extra time minute</label>
        <input
          class="h-12 w-12 text-center invalid:input-error invalid:border"
          type="number"
          name="scoredInExtraMinute"
          min="1"
          max="15"
          onChange={(e) =>
            setGoal({ scoredInExtraMinute: +e.currentTarget.value })
          }
          value={goal.scoredInExtraMinute}
        />
      </div>
      <div class="mt-4">
        <button
          type="button"
          class="btn"
          disabled={isGoalValid()}
          onClick={() => {
            gameFormGroupControls("goals", (g) => {
              const ng = [...g, { ...goal }];
              return ng;
            });
            props.onClose();
          }}
        >
          Save goal
        </button>
      </div>
    </div>
  );
};

export const AddGoalEvent = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
}) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const closeModal = () => {
    setIsOpen(false);
    setGoal(defaultGoal());
  };

  const cannotOpen = () =>
    props.awayTeamPlayers.length === 0 || props.homeTeamPlayers.length === 0;

  return (
    <>
      <button
        type="button"
        class="btn-outline btn gap-2"
        disabled={cannotOpen()}
        onClick={() => setIsOpen(true)}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        <pre>Add goal</pre>
      </button>

      <Transition appear show={isOpen()}>
        <Dialog
          isOpen
          class="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div class="flex min-h-screen items-center justify-center px-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel class="my-8 inline-block w-full min-w-[75vw] max-w-md transform overflow-hidden rounded-2xl border bg-base-300 p-6 text-left align-middle text-black shadow-xl transition-all md:min-w-[50rem]">
                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                  Select a player
                </DialogTitle>
                <div class="mt-2">
                  <div class="flex flex-col text-sm">
                    <AddGoal
                      homeTeamPlayers={props.homeTeamPlayers}
                      awayTeamPlayers={props.awayTeamPlayers}
                      onClose={closeModal}
                    />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export type CardEvent = {
  id?: string;
  playerId: string;
  minute: number;
  extraTimeMinute: number | undefined;
  cardType: string;
  playerLastName: string;
  isHomeTeam: boolean;
};
const defaultCardEvent = (): CardEvent => ({
  playerId: "",
  playerLastName: "",
  minute: 0,
  extraTimeMinute: undefined,
  cardType: "YELLOW",
  isHomeTeam: true,
});

const cardOptions: Option[] = [
  { label: "Yellow", value: "YELLOW" },
  { label: "Second yellow", value: "SECOND_YELLOW" },
  { label: "Red", value: "RED" },
];

export const AddCardEvent = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
}) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [card, setCard] = createStore<CardEvent>(defaultCardEvent());

  const [isHomeTeam, setIsHomeTeam] = createSignal(true);

  const playersOptions = createMemo(() => {
    if (isHomeTeam()) {
      return props.homeTeamPlayers;
    }
    return props.awayTeamPlayers;
  });

  const isCardInvalid = () => {
    return card.playerId === "" || card.minute <= 0;
  };

  createEffect(() => {
    setCard({ isHomeTeam: isHomeTeam() });
  });
  createEffect(() => {
    const playerId = card.playerId;
    if (playerId !== "") {
      const playerName = playersOptions().find(
        (p) => p.value === playerId
      )?.label;
      setCard({ playerLastName: playerName ?? "" });
    }
  });

  const closeModal = () => {
    setIsOpen(false);
    setCard(defaultCardEvent());
  };

  const cannotOpen = () =>
    props.awayTeamPlayers.length === 0 || props.homeTeamPlayers.length === 0;

  return (
    <>
      <button
        type="button"
        class="btn-outline btn gap-2"
        disabled={cannotOpen()}
        onClick={() => setIsOpen(true)}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        <pre>Add card</pre>
      </button>

      <Transition appear show={isOpen()}>
        <Dialog
          isOpen
          class="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div class="flex min-h-screen items-center justify-center px-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel class="my-8 inline-block w-full min-w-[75vw] max-w-md transform overflow-hidden rounded-2xl border bg-base-300 p-6 text-left align-middle text-black shadow-xl transition-all md:min-w-[50rem]">
                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                  Select a player
                </DialogTitle>
                <div class="mt-2">
                  <div class="flex flex-col text-sm">
                    <div>
                      <Checkbox
                        label="Is home team player"
                        name="isHomeTeamPlayer"
                        control={{
                          setValue: setIsHomeTeam,
                          value: isHomeTeam(),
                        }}
                      />

                      <Select
                        label="Awarded to player"
                        name="playerId"
                        required
                        control={{
                          setValue: (val) => setCard({ playerId: val }),
                          value: card.playerId,
                        }}
                        options={playersOptions()}
                      />

                      <Select
                        label="Card type"
                        name="cardType"
                        required
                        control={{
                          setValue: (val) => setCard({ cardType: val }),
                          value: card.cardType,
                        }}
                        options={cardOptions}
                      />

                      <div class="my-4 flex flex-col space-y-2">
                        <label for="minute">Awarded in minute</label>
                        <input
                          class="h-12 w-12 text-center invalid:input-error invalid:border"
                          type="number"
                          name="minute"
                          min="1"
                          max="120"
                          onChange={(e) =>
                            setCard({ minute: +e.currentTarget.value })
                          }
                          value={card.minute}
                        />
                        {/* TODO: add invalid text */}

                        <label for="extraTimeMinute">
                          Awarded in extra time minute
                        </label>
                        <input
                          class="h-12 w-12 text-center invalid:input-error invalid:border"
                          type="number"
                          name="extraTimeMinute"
                          min="1"
                          max="15"
                          onChange={(e) =>
                            setCard({ extraTimeMinute: +e.currentTarget.value })
                          }
                          value={card.extraTimeMinute}
                        />
                      </div>
                      <div class="mt-4">
                        <button
                          type="button"
                          class="btn"
                          disabled={isCardInvalid()}
                          onClick={() => {
                            console.log("zatvaramo");
                            gameFormGroupControls("cards", (currCards) => {
                              const newCards = [...currCards, { ...card }];
                              return newCards;
                            });
                            closeModal();
                          }}
                        >
                          Save card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export type SubstitutionEvent = {
  id?: string;
  playerInId: string;
  playerInName: string;
  playerOutId: string;
  playerOutName: string;
  minute: number;
  extraTimeMinute: number | undefined;
  isHomeTeam: boolean;
};

const defaultSubstitutionEvent = (): SubstitutionEvent => ({
  playerInId: "",
  playerInName: "",
  playerOutId: "",
  playerOutName: "",
  minute: 0,
  extraTimeMinute: undefined,
  isHomeTeam: true,
});

export const AddSubstitutionEvent = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
}) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [substitution, setSubstitution] = createStore<SubstitutionEvent>(
    defaultSubstitutionEvent()
  );

  const [isHomeTeam, setIsHomeTeam] = createSignal(true);

  const playersOptions = createMemo(() => {
    if (isHomeTeam()) {
      return props.homeTeamPlayers;
    }
    return props.awayTeamPlayers;
  });

  const isSubInvalid = () => {
    return (
      substitution.playerInId === "" ||
      substitution.playerInId === "" ||
      substitution.playerOutId === "" ||
      substitution.playerOutId === "" ||
      substitution.playerInId === substitution.playerOutId ||
      substitution.minute <= 0
    );
  };

  createEffect(() => {
    setSubstitution({ isHomeTeam: isHomeTeam() });
  });

  createEffect(() => {
    const playerInId = substitution.playerInId;
    if (playerInId !== "") {
      const playerInName = playersOptions().find(
        (p) => p.value === playerInId
      )?.label;
      setSubstitution({ playerInName: playerInName ?? "" });
    }

    const playerOutId = substitution.playerOutId;
    if (playerOutId !== "") {
      const playerOutName = playersOptions().find(
        (p) => p.value === playerOutId
      )?.label;
      setSubstitution({ playerOutName: playerOutName ?? "" });
    }
  });

  const closeModal = () => {
    setIsOpen(false);
    setSubstitution(defaultSubstitutionEvent());
  };

  const cannotOpen = () =>
    props.awayTeamPlayers.length === 0 || props.homeTeamPlayers.length === 0;

  return (
    <>
      <button
        type="button"
        class="btn-outline btn gap-2"
        disabled={cannotOpen()}
        onClick={() => setIsOpen(true)}
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        <pre>Add substitution</pre>
      </button>

      <Transition appear show={isOpen()}>
        <Dialog
          isOpen
          class="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div class="flex min-h-screen items-center justify-center px-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
            </TransitionChild>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span class="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel class="my-8 inline-block w-full min-w-[75vw] max-w-md transform overflow-hidden rounded-2xl border bg-base-300 p-6 text-left align-middle text-black shadow-xl transition-all md:min-w-[50rem]">
                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                  Select a player
                </DialogTitle>
                <div class="mt-2">
                  <div class="flex flex-col text-sm">
                    <div>
                      <Checkbox
                        label="Is home team player"
                        name="isHomeTeamPlayer"
                        control={{
                          setValue: setIsHomeTeam,
                          value: isHomeTeam(),
                        }}
                      />

                      <Select
                        label="Player goes in"
                        name="playerInId"
                        required
                        control={{
                          setValue: (val) =>
                            setSubstitution({ playerInId: val }),
                          value: substitution.playerInId,
                        }}
                        options={playersOptions()}
                      />

                      <Select
                        label="Player goes out"
                        name="playerOutId"
                        required
                        control={{
                          setValue: (val) =>
                            setSubstitution({ playerOutId: val }),
                          value: substitution.playerOutId,
                        }}
                        options={playersOptions()}
                      />

                      <div class="my-4 flex flex-col space-y-2">
                        <label for="minute">In minute</label>
                        <input
                          class="h-12 w-12 text-center invalid:input-error invalid:border"
                          type="number"
                          name="minute"
                          min="1"
                          max="120"
                          onChange={(e) =>
                            setSubstitution({ minute: +e.currentTarget.value })
                          }
                          value={substitution.minute}
                        />
                        {/* TODO: add invalid text */}

                        <label for="extraTimeMinute">
                          Awarded in extra time minute
                        </label>
                        <input
                          class="h-12 w-12 text-center invalid:input-error invalid:border"
                          type="number"
                          name="extraTimeMinute"
                          min="1"
                          max="15"
                          onChange={(e) =>
                            setSubstitution({
                              extraTimeMinute: +e.currentTarget.value,
                            })
                          }
                          value={substitution.extraTimeMinute}
                        />
                      </div>
                      <div class="mt-4">
                        <button
                          type="button"
                          class="btn"
                          disabled={isSubInvalid()}
                          onClick={() => {
                            gameFormGroupControls(
                              "substitutions",
                              (currSubs) => {
                                const newSubs = [
                                  ...currSubs,
                                  { ...substitution },
                                ];
                                return newSubs;
                              }
                            );
                            closeModal();
                          }}
                        >
                          Save substitution
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
