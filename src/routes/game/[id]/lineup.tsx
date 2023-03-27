import { For, Show } from "solid-js";
import { A, RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { twMerge } from "tailwind-merge";
import { GameDetailWrapper } from "~/components/games";
import { Lineups, PlayerInLineup, getLineups } from "~/server/lineups";

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(([, id]) => getLineups({ gameId: id }), {
    key: () => ["lineups", params.id],
  });
};

const Divider = () => {
  return <span class="w-full border-t border-black" />;
};

const Shirt = (shirt: { shirtColor: string }) => (
  <>
    <svg
      fill={shirt.shirtColor}
      class={twMerge("h-10 stroke-black", `fill-[${shirt.shirtColor}]`)}
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
          class={twMerge(
            "absolute top-[50%] translate-y-[-50%] translate-x-[-50%] text-center text-white",
            player.shirtNumber.toString().length > 1
              ? "left-[47%]"
              : "left-[50%]"
          )}
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
      class={twMerge(
        "flex h-full flex-col justify-around",
        !sideInfo.isHomeTeam && "flex-col-reverse"
      )}
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
      class={twMerge(
        "h-[12.5%] w-full",
        props.isEvenRow ? "bg-green-400" : "bg-green-500"
      )}
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

const FieldWrapper = (props: { lineups: Lineups }) => {
  return (
    <div class="mx-auto flex aspect-[10/20] w-full min-w-[50%] flex-col justify-around border border-black bg-green-400 md:w-fit lg:h-full lg:max-h-screen">
      <div class="h-[50%]">
        <HalfFieldGrassPattern isHomeTeam />

        <div class="mt-[-100%] h-full py-2">
          <Side
            lineups={props.lineups.homeTeamLineup}
            shirtColor={props.lineups.homeTeamShirtColor}
            goalkeeperShirtColor={props.lineups.homeTeamGoalkeeperShirtColor}
            isHomeTeam
          />
        </div>
      </div>

      <Divider />

      <div class="h-[50%]">
        <HalfFieldGrassPattern isHomeTeam={false} />

        <div class="mt-[-100%] h-full py-2">
          <Side
            lineups={props.lineups.awayTeamLineup}
            shirtColor={props.lineups.awayTeamShirtColor}
            goalkeeperShirtColor={props.lineups.awayTeamGoalkeeperShirtColor}
            isHomeTeam={false}
          />
        </div>
      </div>
    </div>
  );
};

export default () => {
  const lineups = useRouteData<typeof routeData>();
  const params = useParams();
  const id = () => params.id;

  return (
    <Show when={lineups()} keyed>
      {(lineups) => (
        <GameDetailWrapper gameId={id()}>
          <FieldWrapper lineups={lineups} />
        </GameDetailWrapper>
      )}
    </Show>
  );
};
