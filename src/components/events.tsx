import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import { createEffect, createMemo, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { z } from "zod";
import { type Option, Select, Checkbox } from "~/components/form-helpers";
import { gameFormGroupControls } from "./game-edit";

const goalSchema = z.object({
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
        control={{
          setValue: (val) => setGoal({ scorerId: val }),
          value: goal.scorerId,
        }}
        options={playersOptions()}
      />

      <Select
        label="Assisted by"
        name="assistentId"
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
          onClick={props.onClose}
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
    gameFormGroupControls("goals", (g) => {
      const ng = [...g, { ...goal }];
      return ng;
    });
    setGoal(defaultGoal());
  };

  return (
    <>
      <button
        type="button"
        class="btn-outline btn gap-2"
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
