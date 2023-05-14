import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";
import { PlayersTeamInSeason } from "~/routes/admin/player-season/[id]";
import { optionalString } from "./players";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { redirect } from "solid-start";

export const findTeams = async (
  q: string
): Promise<{ id: string; name: string; imageSlug: string | null }[]> => {
  return await prisma.$queryRaw`
  select "name", "id", "imageSlug"
from "Team"
where lower("name") like ${`%${q.toLowerCase()}%`}
order by "name" asc
limit 30;
  `;
};

export const teamInSeasonSchema = z.object({
  id: zfd.text(z.string().optional()),
  competitionSeasonId: zfd.text(),
});

export type TeamInSeasonFormElement = z.infer<typeof teamInSeasonSchema>;

export const teamInSeasonFormSchema = zfd.formData(
  z.object({
    season: teamInSeasonSchema.array().optional().default([]),
    seasonsToDelete: zfd.text().array().optional().default([]),
    teamId: zfd.text(),
  })
);

export const saveTeamInCompetitionSeasons = async (
  data: z.infer<typeof teamInSeasonFormSchema>
) => {
  if (data.seasonsToDelete.length > 0) {
    await prisma.teamInCompetition.deleteMany({
      where: {
        id: {
          in: data.seasonsToDelete,
        },
      },
    });
  }

  const update = data.season.filter((s) => s.id !== undefined);

  await Promise.all(
    update.map(async (u) =>
      prisma.teamInCompetition.update({
        where: {
          id: u.id,
        },
        data: {
          competitionInSeasonId: u.competitionSeasonId,
        },
      })
    )
  );

  const create = data.season.filter((s) => s.id === undefined);
  await prisma.teamInCompetition.createMany({
    data: create.map((c) => ({
      competitionInSeasonId: c.competitionSeasonId,
      teamId: data.teamId,
    })),
  });

  return redirect(`/team/${data.teamId}`);
};

export const getTeamForm = async (id: string): Promise<TeamForm> => {
  return prisma.team
    .findFirstOrThrow({
      where: {
        id,
      },

      select: {
        id: true,
        imageSlug: true,
        name: true,
        primaryShirtColor: true,
        countryId: true,
      },
    })
    .then(
      (team) =>
        ({
          id: team.id,
          imageSlug: team.imageSlug ?? undefined,
          name: team.name,
          primaryShirtColor: team.primaryShirtColor,
          country: team.countryId,
        } satisfies TeamForm)
    );
};

export const saveOrUpdateTeam = async (team: TeamForm) => {
  if (team.id) {
    await prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        countryId: team.country,
        imageSlug: team.imageSlug,
        name: team.name,
        primaryShirtColor: team.primaryShirtColor,
      },
    });

    return redirect(`/team/${team.id}`);
  }

  const savedTeam = await prisma.team.create({
    data: {
      countryId: team.country,
      imageSlug: team.imageSlug,
      name: team.name,
      primaryShirtColor: team.primaryShirtColor,
    },
  });

  return redirect(`/team/${savedTeam.id}`);
};

export const teamSchema = zfd.formData({
  id: optionalString,
  name: zfd.text(),
  country: zfd.text(),
  imageSlug: optionalString,
  primaryShirtColor: zfd.text(),
});
export type TeamForm = z.infer<typeof teamSchema>;

export const getLatestSeasonCompetitionForTeam = async (teamId: string) => {
  return prisma.teamInCompetition.findFirstOrThrow({
    where: {
      teamId,
    },

    orderBy: {
      competitionInSeason: {
        season: {
          title: "desc",
        },
      },
    },
  });
};

export const getTeamById = async (id: string) => {
  return prisma.team.findUniqueOrThrow({
    where: {
      id,
    },

    select: {
      name: true,
      imageSlug: true,

      currentManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageSlug: true,
        },
      },

      country: {
        select: {
          name: true,
          imageSlug: true,
        },
      },
    },
  });
};

export const getTeamsInCompetitionSeason = async (
  competitionId: string,
  seasonId: string
) => {
  return prisma.teamInCompetition.findMany({
    where: {
      competitionInSeason: {
        competitionId,
        seasonId,
      },
    },

    select: {
      team: {
        select: {
          id: true,
          name: true,
          imageSlug: true,
        },
      },
    },
  });
};

export const getTeamForManagerForm = async (managerId: string) => {
  return prisma.managerInTeamSeason.findMany({
    where: {
      managerId,
    },

    orderBy: {
      season: {
        title: "asc",
      },
    },

    select: {
      id: true,
      teamId: true,
      seasonId: true,
    },
  });
};

export const getTeamForPlayerForm = async (
  playerId: string
): Promise<PlayersTeamInSeason[]> => {
  return prisma.playersTeamInSeason.findMany({
    where: {
      playerId,
    },

    orderBy: {
      season: {
        title: "asc",
      },
    },

    select: {
      id: true,
      teamId: true,
      seasonId: true,
    },
  });
};

export const getTeamsForManager = async (managerId: string) => {
  const teams = await prisma.managerInTeamSeason
    .findMany({
      where: {
        managerId,
      },

      orderBy: {
        season: {
          title: "asc",
        },
      },

      select: {
        id: true,
        team: {
          select: {
            id: true,
            name: true,
            imageSlug: true,
          },
        },

        season: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .then((teams) =>
      teams.map((t) => ({
        teamId: t.team.id,
        teamName: t.team.name,
        teamImageSlug: t.team.imageSlug,
        seasonId: t.season.id,
        seasonName: t.season.title,
      }))
    );

  return teams;
};

export const getTeamsForPlayer = async (playerId: string) => {
  const teams = await prisma.playersTeamInSeason
    .findMany({
      where: {
        playerId,
      },

      orderBy: {
        season: {
          title: "asc",
        },
      },

      select: {
        id: true,
        team: {
          select: {
            id: true,
            name: true,
            imageSlug: true,
          },
        },

        season: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .then((teams) =>
      teams.map((t) => ({
        teamId: t.team.id,
        teamName: t.team.name,
        teamImageSlug: t.team.imageSlug,
        seasonId: t.season.id,
        seasonName: t.season.title,
      }))
    );

  return teams;
};

export const getAllTeams = async (): Promise<Option[]> => {
  return prisma.team
    .findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    })
    .then((teams) =>
      teams.map((t) => ({ value: t.id, label: t.name } satisfies Option))
    );
};

export const getTeamsInSeasonAndCompetition = async (
  seasonId: string,
  competitionId: string
) => {
  if (!competitionId || !seasonId) {
    return [];
  }

  return prisma.teamInCompetition
    .findMany({
      where: {
        competitionInSeason: {
          seasonId,
          competitionId,
        },
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .then((teams) =>
      teams.map((t) => ({ label: t.team.name, value: t.team.id }))
    );
};
