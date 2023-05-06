import { A } from "solid-start";

export const TeamPreview = (team: {
  name: string;
  id: string;
  imageSlug: string | null;
  seasonName: string;
  seasonId: string;
}) => {
  return (
    <div class="flex w-full flex-col space-y-4">
      <span class="flex items-center space-x-4">
        <A href={`/team/${team.id}`}>
          <img
            src={team.imageSlug ?? "/shield.svg"}
            class="avatar h-12 object-cover"
          />
        </A>
        <span class="flex flex-col justify-around">
          <A class="font-semibold" href={`/team/${team.id}`}>
            {team.name}
          </A>

          {/* TODO: go to games  */}
          <A class="font-thin hover:link" href={`/season/${team.seasonId}`}>
            {team.seasonName}
          </A>
        </span>
      </span>

      <span class="divider" />
    </div>
  );
};
