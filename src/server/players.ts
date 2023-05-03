import { Position } from "@prisma/client";
import { ServerError, redirect } from "solid-start";
import { z } from "zod";
import { prisma } from "~/util/prisma";

const optionalString = z
  .string()
  .optional()
  .transform((v) => {
    console.log("test", v);
    if (v === "") return undefined;
    return v;
  });

const playerFormSchema = z.object({
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
export type PlayerForm = z.infer<typeof playerFormSchema>;

export const saveOrUpdatePlayer = async (formData: any) => {
  const parsed = playerFormSchema.safeParse(formData);
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

export const getPlayerFormData = async (id: string): Promise<PlayerForm> => {
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
