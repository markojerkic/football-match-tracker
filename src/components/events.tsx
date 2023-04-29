import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import {
  Match,
  Switch,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isValid, z } from "zod";
import { type Option, Select, Checkbox } from "~/components/form-helpers";

const goalSchema = z.object({
  scorerId: z.string(),
  assistentId: z.string().optional(),
  isOwnGoal: z.boolean(),
  isPenalty: z.boolean(),
  scoredInMinute: z.number().min(1).max(120),
  scoredInExtraMinute: z.number().min(1).max(15).optional(),
});
type Goal = z.infer<typeof goalSchema>;

const defaultGoal: Goal = {
  scorerId: "",
  isPenalty: false,
  isOwnGoal: false,
  scoredInMinute: 0,
  assistentId: undefined,
  scoredInExtraMinute: undefined,
};

const AddGoal = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
  isValid: (valid: boolean) => void;
}) => {
  const [goal, setGoal] = createStore<Goal>(defaultGoal);
  const [isHomeTeam, setIsHomeTeam] = createSignal(true);

  const playersOptions = createMemo(() => {
    if (isHomeTeam()) {
      return props.homeTeamPlayers;
    }
    return props.awayTeamPlayers;
  });

  const [isGoalValid, { refetch }] = createResource(
    () => goal,
    (g) => goalSchema.safeParseAsync(g).then((v) => v.success),
    // (g) => goalSchema.safeParse(g).success,
    { initialValue: false }
  );

  createEffect(() => {
    props.isValid(isGoalValid());
  });

  const v = () => isGoalValid() ? 'valid' : 'falc';
  const b = () => JSON.stringify(goal);

  return (
    <div>
      {isGoalValid.state}
      {v()}
      {b()}
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
    </div>
  );
};

export const AddEvent = (props: {
  awayTeamPlayers: Option[];
  homeTeamPlayers: Option[];
}) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const [selectedEventType, setSelectedEventType] = createSignal<
    "goal" | "card" | "sub"
  >("goal");

  const [isFormValid, setIsFormValid] = createSignal(false);

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

        <pre>Add event</pre>
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
                    <div class="tabs">
                      <div
                        onClick={() => setSelectedEventType("goal")}
                        class="tab-bordered tab"
                        classList={{
                          "tab-active": selectedEventType() === "goal",
                        }}
                      >
                        Goal
                      </div>
                      <div
                        onClick={() => setSelectedEventType("card")}
                        class="tab-bordered tab"
                        classList={{
                          "tab-active": selectedEventType() === "card",
                        }}
                      >
                        Card
                      </div>
                      <div
                        onClick={() => setSelectedEventType("sub")}
                        class="tab-bordered tab"
                        classList={{
                          "tab-active": selectedEventType() === "sub",
                        }}
                      >
                        Substitution
                      </div>
                    </div>

                    <Switch>
                      <Match when={selectedEventType() === "goal"}>
                        <AddGoal
                          homeTeamPlayers={props.homeTeamPlayers}
                          awayTeamPlayers={props.awayTeamPlayers}
                          isValid={setIsFormValid}
                        />
                      </Match>
                      <Match when={selectedEventType() === "card"}>
                        <pre>card</pre>
                      </Match>
                      <Match when={selectedEventType() === "sub"}>
                        <pre>sub</pre>
                      </Match>
                    </Switch>
                  </div>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="btn"
                    disabled={isFormValid()}
                    onClick={closeModal}
                  >
                    OK
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
