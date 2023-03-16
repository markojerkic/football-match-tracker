import { A } from "@solidjs/router";
import { createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";

const Gradient = {
  RED: "from-rose-700 to-pink-600",
  SKY_BLUE: "from-blue-500 to-blue-600",
  ICE: "from-rose-100 to-teal-100",
} as const;

type Gradient = (typeof Gradient)[keyof typeof Gradient];

type Team = {
  name: string;
  imageSlug: string;
};

const HighlightedTeam = (props: {
  side: "right" | "left";
  gradient: Gradient;
  team: Team;
}) => {
  const noBorderOnSide = () => (props.side === "right" ? "l" : "r");

  const shouldContract = createMemo(() => props.gradient === Gradient.ICE);

  return (
    <div
      class={twMerge(
        "flex items-center border-t-2 ",
        props.side === "right" && "flex-row-reverse",
        "justify-around space-x-4",
        `border-${noBorderOnSide()}-2 `,
        "border-b-2 p-4 ",
        `rounded-${noBorderOnSide()}-xl `,
        "mx-4 w-[65%]",
        `self-${props.side === "right" ? "end" : "start"}`,
        "bg-gradient-to-r",
        props.gradient
      )}
    >
      <img
        class="h-32 w-32 object-contain"
        width={30}
        height={30}
        src={props.team.imageSlug}
        alt={props.team.name}
      />

      <div
        class={`flex flex-col ${
          shouldContract() ? "text-neutral-focus" : "text-base-100"
        }`}
      >
        <span class="text-3xl font-bold">{props.team.name}</span>
        <span class="text-xl font-bold">vs PSG</span>
        <span class="text-xl font-bold">23.03.2023.</span>
      </div>

      <A
        href="/nema-još"
        class={`btn-outline btn rounded-2xl border-2 border-${
          shouldContract() ? "black" : "white"
        }`}
      >
        <svg
          class={`h-6 w-6 stroke-2 text-${
            shouldContract() ? "black" : "white"
          } ${props.side === "right" && "rotate-180"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </A>
    </div>
  );
};

const Hero = () => {
  return (
    <div class="hero min-h-screen bg-accent-focus">
      <div class="hero-content text-start">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Football results tracker</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button class="btn-primary btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

const HighlightedCompetitions = () => {
  return (
    <div class="bg-accent-focus min-h-screen py-8 text-white">
      <p class="p-4 text-center text-5xl font-bold">Highlighted competitions</p>

      <div class="flex flex-col space-y-4 py-4">
        <HighlightedTeam
          side="right"
          gradient={Gradient.RED}
          team={{
            name: "FC Bayern",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
          }}
        />
        <HighlightedTeam
          side="left"
          gradient={Gradient.SKY_BLUE}
          team={{
            name: "Manchaster City",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
          }}
        />
        <HighlightedTeam
          side="right"
          gradient={Gradient.ICE}
          team={{
            name: "Real Madrid",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
          }}
        />
      </div>
    </div>
  );
};

const HighlightedTeams = () => {
  return (
    <div class="min-h-screen">
      <p class="p-4 text-center text-5xl font-bold">Highlighted teams</p>

      <div class="flex flex-col space-y-4 py-4">
        <HighlightedTeam
          side="right"
          gradient={Gradient.RED}
          team={{
            name: "FC Bayern",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
          }}
        />
        <HighlightedTeam
          side="left"
          gradient={Gradient.SKY_BLUE}
          team={{
            name: "Manchaster City",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
          }}
        />
        <HighlightedTeam
          side="right"
          gradient={Gradient.ICE}
          team={{
            name: "Real Madrid",
            imageSlug:
              "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
          }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main class="mx-auto w-full">
      <div class="min-h-screen bg-primary-content">
        <Hero />
        <HighlightedTeams />
        <HighlightedCompetitions />
      </div>
    </main>
  );
}
