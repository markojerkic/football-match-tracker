import { Position } from "@prisma/client";
import { ServerError, redirect } from "solid-start";
import { z } from "zod";
import { PlayerTeamsForm } from "~/routes/admin/player-season/[id]";
import { prisma } from "~/util/prisma";

export const findPlayers = async (
  q: string
): Promise<
  {
    id: string;
    firstName: string;
    lastName: string;
    imageSlug: string | null;
  }[]
> => {
  return prisma.$queryRaw`
  select "firstName", "lastName", "id", "imageSlug"
from "Player"
where lower("firstName") like ${`%${q.toLowerCase()}%`}
   or lower("lastName") like ${`%${q.toLowerCase()}%`}
order by "lastName" asc, "firstName" asc
limit 30;
  `;
};

export const optionalString = z
  .string()
  .optional()
  .transform((v) => {
    if (v === "") return undefined;
    return v;
  });

export const playerManagerFormSchema = z.object({
  id: optionalString,
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z
    .string()
    .transform((v) => {
      return new Date(v);
    })
    .pipe(z.date()),
  nationality: z.string(),
  imageSlug: optionalString,
  currentTeam: optionalString,
});
export type PlayerManagerForm = z.infer<typeof playerManagerFormSchema>;

export const saveOrUpdatePlayer = async (formData: any) => {
  const parsed = playerManagerFormSchema.safeParse(formData);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new ServerError("Player data not valid", {
      status: 400,
      stack: parsed.error.stack,
    });
  }
  const player = parsed.data;
  console.log(player);

  if (!player.id) {
    const savedPlayer = await prisma.player.create({
      data: {
        firstName: player.firstName,
        lastName: player.lastName,
        teamId: player.currentTeam,
        countryId: player.nationality,
        imageSlug: player.imageSlug,
        dateOfBirth: player.dateOfBirth,
        primaryPosition: Position.LEFT_BACK,
      },
    });

    return redirect(`/player/${savedPlayer.id}`);
  }

  const savedPlayer = await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      firstName: player.firstName,
      lastName: player.lastName,
      teamId: player.currentTeam,
      countryId: player.nationality,
      imageSlug: player.imageSlug,
      dateOfBirth: player.dateOfBirth,
      primaryPosition: Position.LEFT_BACK,
    },
  });

  return redirect(`/player/${savedPlayer.id}`);
};

export const getPlayerFormData = async (
  id: string
): Promise<PlayerManagerForm> => {
  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      countryId: true,
      imageSlug: true,
      teamId: true,
    },
  });

  if (player === null) {
    throw new ServerError("Player not found");
  }

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    dateOfBirth: player.dateOfBirth,
    nationality: player.countryId,
    imageSlug: player.imageSlug ?? undefined,
    currentTeam: player.teamId ?? undefined,
  };
};

export const getPlayerById = async (id: string) => {
  return prisma.player
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageSlug: true,

        currentTeam: {
          select: {
            id: true,
            name: true,
            imageSlug: true,
          },
        },
      },
    })
    .then((player) => {
      if (!player) {
        throw new ServerError("Player not found");
      }
      return player;
    });
};

export const getPlayersInTeamAndSeason = async (
  teamId: string | undefined,
  seasonId: string | undefined
) => {
  if (!teamId || !seasonId) {
    return [];
  }

  return prisma.playersTeamInSeason
    .findMany({
      where: {
        seasonId,
        teamId,
      },
      select: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    .then((players) =>
      players.map((p) => ({
        label: `${p.player.firstName} ${p.player.lastName}`,
        value: p.player.id,
      }))
    );
};

export const savePlayerTeams = async (teams: PlayerTeamsForm) => {
  if (teams.teamsToDelete.length > 0) {
    await prisma.playersTeamInSeason.deleteMany({
      where: {
        id: {
          in: teams.teamsToDelete,
        },
      },
    });
  }

  const update = teams.team.filter((team) => team.id !== undefined);

  await Promise.all(
    update.map(async (teamToUpdate) => {
      return prisma.playersTeamInSeason.update({
        where: {
          id: teamToUpdate.id,
        },
        data: teamToUpdate,
      });
    })
  );

  const create = teams.team.filter((team) => team.id === undefined);
  await prisma.playersTeamInSeason.createMany({
    data: create.map((team) => ({
      ...team,
      playerId: teams.playerId,
    })),
  });

  return redirect(`/player/${teams.playerId}`);
};
