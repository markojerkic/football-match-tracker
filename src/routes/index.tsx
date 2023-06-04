import { Competition, Team } from "@prisma/client";
import { A, useRouteData } from "@solidjs/router";
import { For, Show } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { getHighlightedCompetitions } from "~/server/competitions";
import { getHighlightedTeams } from "~/server/teams";
import { Flag } from "./competition/[id]";

const Hero = () => {
  return (
    <div class="hero bg-accent-focus py-20">
      <div class="hero-content text-start">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Football results tracker</h1>
          <p class="py-6">
            Check results, statistics, starting lineups. Follow favourite player
            and teams.
          </p>
          <A href="/game" class="btn-primary btn">
            Get Started
          </A>
        </div>
      </div>
    </div>
  );
};

const HighlightedCompetitions = (props: {
  competitions: Competition[] | undefined;
}) => {
  return (
    <div class="h-full bg-accent-focus py-20">
      <p class="p-4 text-center text-5xl font-bold">Highlighted competitions</p>

      <div class="mx-auto flex max-w-lg flex-col space-y-4 py-4">
        <For each={props.competitions}>
          {(competition) => (
            <A
              href={`/competition/${competition.id}`}
              class="group relative block"
            >
              <span class="absolute inset-0 border-2 border-dashed border-black"></span>

              <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex flex-col p-4">
                  {/* Content */}
                  <span class="flex space-x-4 text-sm font-bold">
                    <Show
                      when={competition.imageSlug}
                      fallback={<Flag small />}
                    >
                      <img
                        src={competition.imageSlug ?? undefined}
                        class="avatar h-12 object-cover"
                      />
                    </Show>
                    <span class="self-center">{competition.name}</span>
                  </span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
};

const HighlightedTeams = (props: { teams: Team[] | undefined }) => {
  return (
    <div class="h-full py-20">
      <p class="p-4 text-center text-5xl font-bold">Highlighted teams</p>

      <div class="mx-auto flex max-w-lg flex-col space-y-4 py-4">
        <For each={props.teams}>
          {(team) => (
            <A href={`/team/${team.id}`} class="group relative block">
              <span class="absolute inset-0 border-2 border-dashed border-black"></span>

              <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex flex-col p-4">
                  {/* Content */}
                  <span class="flex space-x-4 text-sm font-bold">
                    <img
                      src={team.imageSlug ?? "/shield.svg"}
                      class="avatar h-12 object-cover"
                    />
                    <span class="self-center">{team.name}</span>
                  </span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
};

export const routeData = () => {
  const highlightedTeams = createServerData$(() => getHighlightedTeams(), {
    key: ["highlighted-teams"],
  });
  const highlightedCompetitions = createServerData$(
    () => getHighlightedCompetitions(),
    {
      key: ["highlighted-competitions"],
    }
  );

  return {
    highlightedCompetitions,
    highlightedTeams,
  };
};

export default function Home() {
  const { highlightedTeams, highlightedCompetitions } =
    useRouteData<typeof routeData>();

  return (
    <main class="mx-auto w-full">
      <div class="min-h-screen bg-primary-content">
        <Hero />
        <HighlightedTeams teams={highlightedTeams()} />
        <HighlightedCompetitions competitions={highlightedCompetitions()} />
      </div>
    </main>
  );
}
