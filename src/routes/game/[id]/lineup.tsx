import { For } from "solid-js";
import { useParams } from "solid-start";
import { twMerge } from "tailwind-merge";
import { GameDetailWrapper } from "~/components/games";

const Divider = () => {
  return <span class="w-full border-t border-black" />;
};

const Shirt = () => (
  <svg
    fill="#000000"
    class="h-10 fill-base-100 stroke-black"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 230.057 230.057"
  >
    <g>
      <path
        d="M228.579,83.315l-32.147-41.258c-7.817-10.032-19.594-15.785-32.312-15.785h-21.204c-2.939,0-5.565,1.836-6.574,4.597
		c-3.257,8.909-11.822,14.895-21.313,14.895s-18.055-5.986-21.313-14.895c-1.009-2.761-3.635-4.597-6.574-4.597H65.937
		c-12.717,0-24.495,5.753-32.312,15.786L1.479,83.315c-1.397,1.793-1.837,4.152-1.179,6.328c0.658,2.176,2.331,3.897,4.488,4.615
		l44.558,14.845v87.682c0,3.866,3.134,7,7,7h117.366c3.866,0,7-3.134,7-7v-87.682l44.558-14.845c2.157-0.718,3.83-2.439,4.488-4.615
		C230.416,87.467,229.976,85.108,228.579,83.315z M180.712,94.347V84.057c0-3.866-3.134-7-7-7s-7,3.134-7,7v105.728H63.345V84.057
		c0-3.866-3.134-7-7-7s-7,3.134-7,7v10.29l-30.736-10.24l26.059-33.444c5.146-6.604,12.897-10.391,21.269-10.391h16.681
		c6.295,11.832,18.761,19.491,32.41,19.491c13.649,0,26.115-7.66,32.411-19.491h16.681c8.371,0,16.123,3.787,21.269,10.39
		l26.06,33.445L180.712,94.347z"
      />
    </g>
  </svg>
);

const PlayerRepresentation = () => {
  return <Shirt />;
};

const PlayerRow = (props: { players: string[] }) => {
  return (
    <div class="flex justify-around">
      <For each={props.players}>{() => <PlayerRepresentation />}</For>
    </div>
  );
};

const Side = (sideInfo: { isHomeTeam: boolean }) => {
  return (
    <div
      class={twMerge(
        "flex h-full flex-col justify-around",
        !sideInfo.isHomeTeam && "flex-col-reverse"
      )}
    >
      <PlayerRow players={["golman"]} />
      <PlayerRow players={["bek", "stoper", "stoper", "bek"]} />
      <PlayerRow players={["vezni", "vezni", "vezni", "vezni"]} />
      <PlayerRow players={["napadac", "napadac"]} />
    </div>
  );
};

const FieldGrassLine = (props: { isEvenRow: boolean }) => {
  return (
    <div
      class={twMerge(
        "h-[20%] w-full",
        props.isEvenRow ? "bg-green-400" : "bg-green-500"
      )}
    />
  );
};

const FieldWrapper = () => {
  return (
    <div class="mx-auto flex aspect-[10/20] h-fit w-fit min-w-[50%] flex-col justify-around border border-black bg-green-400">
      <div class="h-[50%]">
        <div class="h-full">
          <FieldGrassLine isEvenRow={false} />
          <FieldGrassLine isEvenRow />
          <FieldGrassLine isEvenRow={false} />
          <FieldGrassLine isEvenRow />
          <FieldGrassLine isEvenRow={false} />
        </div>

        <div class="mt-[-100%] h-full py-2">
          <Side isHomeTeam />
        </div>
      </div>

      <Divider />

      <div class="h-[50%]">
        <div class="h-full">
          <FieldGrassLine isEvenRow />
          <FieldGrassLine isEvenRow={false} />
          <FieldGrassLine isEvenRow />
          <FieldGrassLine isEvenRow={false} />
          <FieldGrassLine isEvenRow />
        </div>

        <div class="mt-[-100%] h-full py-2">
          <Side isHomeTeam={false} />
        </div>
      </div>
    </div>
  );
};

export default () => {
  const id = useParams().id;
  return (
    <GameDetailWrapper tab="timeline" gameId={id}>
      <FieldWrapper />
    </GameDetailWrapper>
  );
};
