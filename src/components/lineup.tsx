import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "solid-headless";
import { type Option, Select } from "~/components/form-helpers";
import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { For, JSXElement } from "solid-js";
import { A } from "solid-start";
import { Lineups, PlayerInTeamLineup } from "~/server/lineups";
import { gameFormGroup, gameFormGroupControls } from "./game-edit";

const Divider = () => {
  return <span class="w-full border-t border-black" />;
};

const Shirt = (shirt: { shirtColor: string }) => (
  <>
    <svg
      fill={shirt.shirtColor}
      class={`h-10 stroke-black fill-[${shirt.shirtColor}]`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 295.526 295.526"
    >
      <g>
        <path
          d="M147.763,44.074c12.801,0,23.858-8.162,27.83-20.169c-7.578,2.086-17.237,3.345-27.83,3.345
		c-10.592,0-20.251-1.259-27.828-3.345C123.905,35.911,134.961,44.074,147.763,44.074z"
        />
        <path
          d="M295.158,58.839c-0.608-1.706-1.873-3.109-3.521-3.873l-56.343-26.01c-11.985-4.06-24.195-7.267-36.524-9.611
		c-0.434-0.085-0.866-0.126-1.292-0.126c-3.052,0-5.785,2.107-6.465,5.197c-4.502,19.82-22.047,34.659-43.251,34.659
		c-21.203,0-38.749-14.838-43.25-34.659c-0.688-3.09-3.416-5.197-6.466-5.197c-0.426,0-0.858,0.041-1.292,0.126
		c-12.328,2.344-24.538,5.551-36.542,9.611L3.889,54.965c-1.658,0.764-2.932,2.167-3.511,3.873
		c-0.599,1.726-0.491,3.589,0.353,5.217l24.46,48.272c1.145,2.291,3.474,3.666,5.938,3.666c0.636,0,1.281-0.092,1.917-0.283
		l27.167-8.052v161.97c0,3.678,3.001,6.678,6.689,6.678h161.723c3.678,0,6.67-3.001,6.67-6.678V107.66l27.186,8.052
		c0.636,0.191,1.28,0.283,1.915,0.283c2.459,0,4.779-1.375,5.94-3.666l24.469-48.272C295.629,62.428,295.747,60.565,295.158,58.839z
		"
        />
      </g>
    </svg>
  </>
);

const PlayerRepresentation = (player: PlayerRepresentation) => {
  return (
    <A
      href="/player/gigs"
      class="hover:z-1 group flex flex-col items-center justify-start p-2 hover:scale-125 hover:rounded-md hover:bg-green-700 md:max-w-md"
    >
      <span class="relative mx-auto flex flex-col justify-center">
        <Shirt shirtColor={player.shirtColor} />
        <span
          classList={{
            "absolute top-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-white":
              true,
            "left-[47%]": player.shirtNumber.toString().length > 1,
            "left-[50%]": player.shirtNumber.toString().length <= 1,
          }}
        >
          {player.shirtNumber}
        </span>
      </span>
      <span class="absolute translate-y-[175%] text-center text-sm text-white group-hover:relative group-hover:translate-y-0">
        {player.lastName}
      </span>
    </A>
  );
};

type PlayerRepresentation = {
  lastName: string;
  shirtNumber: number;
  shirtColor: string;
};
const PlayerRow = (props: { players: PlayerRepresentation[] }) => {
  return (
    <div class="flex justify-around">
      <For each={props.players}>
        {(player) => <PlayerRepresentation {...player} />}
      </For>
    </div>
  );
};

const Side = (sideInfo: {
  isHomeTeam: boolean;
  lineups: PlayerInLineup[][];
  shirtColor: string;
  goalkeeperShirtColor: string;
}) => {
  return (
    <div
      classList={{
        "flex h-full flex-col justify-around": true,
        "flex-col-reverse": !sideInfo.isHomeTeam,
      }}
    >
      <For each={sideInfo.lineups}>
        {(row, index) => (
          <PlayerRow
            players={row.map((player) => ({
              shirtColor:
                index() === 0
                  ? sideInfo.goalkeeperShirtColor
                  : sideInfo.shirtColor,
              lastName: player.lastName,
              shirtNumber: player.shirtNumber,
            }))}
          />
        )}
      </For>
    </div>
  );
};

const FieldGrassLine = (props: { isEvenRow: boolean }) => {
  return (
    <div
      classList={{
        "h-[12.5%] w-full": true,
        "bg-green-400": props.isEvenRow,
        "bg-green-500": !props.isEvenRow,
      }}
    />
  );
};

const HalfFieldGrassPattern = (props: { isHomeTeam: boolean }) => (
  <div class="flex h-full flex-col">
    <FieldGrassLine isEvenRow={true} />
    <FieldGrassLine isEvenRow={false} />
    <FieldGrassLine isEvenRow={true} />
    <FieldGrassLine isEvenRow={false} />
    <FieldGrassLine isEvenRow={true} />
    <FieldGrassLine isEvenRow={false} />
    <FieldGrassLine isEvenRow={true} />
    <FieldGrassLine isEvenRow={false} />
  </div>
);

const AbstractFieldWrapper = (props: {
  sideA: JSXElement;
  sideB: JSXElement;
}) => {
  return (
    <div class="mx-auto flex aspect-[10/20] w-full min-w-[50%] flex-col justify-around border border-black bg-green-400 md:w-fit lg:h-full lg:max-h-screen">
      <div class="h-[50%]">
        <HalfFieldGrassPattern isHomeTeam />

        <div class="mt-[-100%] h-full py-2">{props.sideA}</div>
      </div>

      <Divider />

      <div class="h-[50%]">
        <HalfFieldGrassPattern isHomeTeam={false} />

        <div class="mt-[-100%] h-full py-2">{props.sideB}</div>
      </div>
    </div>
  );
};

export const FieldWrapper = (props: { lineups: Lineups }) => {
  return (
    <AbstractFieldWrapper
      sideA={
        <Side
          lineups={props.lineups.homeTeamLineup}
          shirtColor={props.lineups.homeTeamShirtColor}
          goalkeeperShirtColor={props.lineups.homeTeamGoalkeeperShirtColor}
          isHomeTeam
        />
      }
      sideB={
        <Side
          lineups={props.lineups.awayTeamLineup}
          shirtColor={props.lineups.awayTeamShirtColor}
          goalkeeperShirtColor={props.lineups.awayTeamGoalkeeperShirtColor}
          isHomeTeam={false}
        />
      }
    />
  );
};

export type Formation = "442" | "433" | "4231" | "352" | "3511" | "343" | "532";

const PlusIcon = () => (
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
);

const IEditablePlayerRepresentation = (info: { shirtColor: string }) => {
  const [selectedPlayer, setSelectedPlayer] = createSignal<{
    shirtNumber: number;
    name: string;
    id: string;
  }>();

  const isNumberTwoDigit = () =>
    (selectedPlayer()?.shirtNumber.toString().length ?? 0) > 1;

  return (
    <>
      <div class="hover:z-1 group flex flex-col items-center justify-start p-2 hover:scale-125 hover:rounded-md hover:bg-green-700 md:max-w-md">
        <span class="relative mx-auto flex flex-col justify-center">
          <Shirt shirtColor={info.shirtColor} />
          <span
            classList={{
              "absolute top-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-white":
                true,
              "left-[47%]": isNumberTwoDigit(),
              "left-[50%]": !isNumberTwoDigit(),
            }}
          >
            <Show when={selectedPlayer()} fallback={<PlusIcon />}>
              {selectedPlayer()?.shirtNumber}
            </Show>
          </span>
        </span>
        <span class="absolute translate-y-[175%] text-center text-sm text-white group-hover:relative group-hover:translate-y-0">
          <Show when={selectedPlayer()}>{selectedPlayer()?.name}</Show>
        </span>
      </div>
    </>
  );
};

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const BUTTON = classNames(
  "rounded-md px-4 py-2 text-sm font-medium transition duration-150",
  "focus:outline-none focus-visible:ring focus-visible:ring-opacity-75",
  "focus-visible:ring-gray-900",
  "dark:focus-visible:ring-gray-50",
  "border-2 border-gray-900 dark:border-gray-50",
  // Background
  "bg-gray-900 hover:bg-gray-700 active:bg-gray-800",
  // Foreground
  "text-gray-50 hover:text-gray-200 active:text-gray-100"
);

export const EditablePlayerRepresentation = (info: {
  shirtColor: string;
  choice: Option[];
  rowNumber: number;
  colNumber: number;
  isHomeTeamPlayer: boolean;
}) => {
  const [isOpen, setIsOpen] = createSignal(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  let lineup = () =>
    info.isHomeTeamPlayer
      ? gameFormGroup.homeTeamLineup
      : gameFormGroup.awayTeamLineup;

  const [shirtNumber, setShirtNumber] = createSignal<number>(0);
  const [selectedPlayer, setSelectedPlayer] = createSignal<string | null>();

  const updateForm = () => {
    let player = selectedPlayer();
    if (player) {
      let l = lineup();
      l = l.filter(
        (p) =>
          p.lineupRow !== info.rowNumber && p.lineupColumn !== info.colNumber
      );
      l.push({
        playerId: player,
        lineupRow: info.rowNumber,
        lineupColumn: info.colNumber,
        shirtNumber: shirtNumber(),
      });

      if (info.isHomeTeamPlayer) {
        gameFormGroupControls((curr) => ({ ...curr, homeTeamLineup: l }));
      } else {
        gameFormGroupControls((curr) => ({ ...curr, awayTeamLineup: l }));
      }
    }
  };

  const playerName = () => {
    let player = selectedPlayer();
    if (player) {
      for (let p of info.choice) {
        if (p.value === player) {
          return p.label;
        }
      }
    }
    return "";
  };

  const isNumberTwoDigit = () => (shirtNumber().toString().length ?? 0) > 1;

  return (
    <>
      <button
        type="button"
        class="hover:z-1 group flex flex-col items-center justify-start p-2 hover:scale-125 hover:rounded-md hover:bg-green-700 md:max-w-md"
        onClick={openModal}
      >
        <span class="relative mx-auto flex flex-col justify-center">
          <Shirt shirtColor={info.shirtColor} />
          <span
            classList={{
              "absolute top-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-white":
                true,
              "left-[47%]": isNumberTwoDigit(),
              "left-[50%]": !isNumberTwoDigit(),
            }}
          >
            <Show when={shirtNumber() > 0} fallback={<PlusIcon />}>
              {shirtNumber()}
            </Show>
          </span>
        </span>
        <span class="absolute translate-y-[175%] text-center text-sm text-white group-hover:relative group-hover:translate-y-0">
          <Show when={playerName()}>{playerName()}</Show>
        </span>
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
              <DialogPanel class="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl border bg-base-300 p-6 text-left align-middle text-black shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                  Select a player
                </DialogTitle>
                <div class="mt-2">
                  <div class="flex flex-col text-sm">
                    <label for="shirtNumber">Shirt number</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      name="shirtNumber"
                      value={shirtNumber()}
                      onInput={(e) => {
                        setShirtNumber(
                          +(e.currentTarget as HTMLInputElement).value ?? 0
                        );
                        updateForm();
                      }}
                    />
                    <Select
                      label="Player"
                      name="player"
                      control={{
                        setValue: (val) => {
                          setSelectedPlayer(val);
                          updateForm();
                        },
                        value: selectedPlayer() ?? "",
                      }}
                      options={info.choice}
                    />
                  </div>
                </div>

                <div class="mt-4">
                  <button type="button" class={BUTTON} onClick={closeModal}>
                    Got it, thanks!
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

const SelectPlayerDialog = (props: { isOpen: boolean }) => {
  return (
    <Transition appear show={props.isOpen}>
      <Dialog isOpen={props.isOpen}>
        <DialogPanel>
          <DialogTitle>Select a player</DialogTitle>
        </DialogPanel>
      </Dialog>
    </Transition>
  );
};

const EditablePlayerRow = (props: {
  players: number;
  choice: Option[];
  shirtColor: string;
  rowNumber: number;
  isHomeTeam: boolean;
}) => {
  const players = Array(props.players).fill(undefined);

  return (
    <div class="flex justify-around">
      <For each={players}>
        {(_, index) => (
          <EditablePlayerRepresentation
            isHomeTeamPlayer={props.isHomeTeam}
            shirtColor={props.shirtColor}
            choice={props.choice}
            rowNumber={props.rowNumber}
            colNumber={index()}
          />
        )}
      </For>
    </div>
  );
};

const EditableSide = (sideInfo: {
  formation: Formation;
  isHomeTeam: boolean;
  players: Option[];
  shirtColor: string;
  goalkeeperShirtColor: string;
}) => {
  const playerNumInRow = () => {
    const playersInRow = sideInfo.formation.split("").map(Number);
    playersInRow.unshift(1);
    return playersInRow;
  };

  return (
    <div
      classList={{
        "flex h-full flex-col justify-around": true,
        "flex-col-reverse": !sideInfo.isHomeTeam,
      }}
    >
      <For each={playerNumInRow()}>
        {(playersInRow, index) => (
          <EditablePlayerRow
            isHomeTeam={sideInfo.isHomeTeam}
            players={playersInRow}
            choice={sideInfo.players}
            shirtColor={
              index() === 0
                ? sideInfo.goalkeeperShirtColor
                : sideInfo.shirtColor
            }
            rowNumber={index()}
          />
        )}
      </For>
    </div>
  );
};

export const EditLieneupWrapper = (props: {
  homeTeamPlayers: Option[];
  awayTeamPlayers: Option[];
  homeTeamShirtsColor: string;
  awayTeamShirtsColor: string;
  homeTeamGoalKeeperShirtsColor: string;
  awayTeamGoalKeeperShirtsColor: string;
}) => {
  return (
    <AbstractFieldWrapper
      sideA={
        <EditableSide
          shirtColor={props.homeTeamShirtsColor}
          goalkeeperShirtColor={props.homeTeamGoalKeeperShirtsColor}
          formation="442"
          players={props.homeTeamPlayers}
          isHomeTeam
        />
      }
      sideB={
        <EditableSide
          shirtColor={props.awayTeamShirtsColor}
          goalkeeperShirtColor={props.awayTeamGoalKeeperShirtsColor}
          formation="433"
          players={props.awayTeamPlayers}
          isHomeTeam={false}
        />
      }
    />
  );
};
