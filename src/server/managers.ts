import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";
import { ServerError, redirect } from "solid-start";
import { playerManagerFormSchema } from "./players";
import { ManagerTeamsForm } from "~/routes/admin/manager-season/[id]";


export const getManagerById = async (id: string) => {
  return prisma.manager
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
    .then((manager) => {
      if (!manager) {
        throw new ServerError("Player not found");
      }
      return manager;
    });
};

export const saveOrUpdateManager = async (formData: any) => {
  const parsed = playerManagerFormSchema.safeParse(formData);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new ServerError("Manager data not valid", {
      status: 400,
      stack: parsed.error.stack,
    });
  }
  const manager = parsed.data;

  if (!manager.id) {
    const savedManager = await prisma.manager.create({
      data: {
        firstName: manager.firstName,
        lastName: manager.lastName,
        teamId: manager.currentTeam,
        countryId: manager.nationality,
        imageSlug: manager.imageSlug,
        dateOfBirth: manager.dateOfBirth,
      },
    });

    return redirect(`/manager/${savedManager.id}`);
  }

  const savedManager = await prisma.manager.update({
    where: {
      id: manager.id,
    },
    data: {
      firstName: manager.firstName,
      lastName: manager.lastName,
      teamId: manager.currentTeam,
      countryId: manager.nationality,
      imageSlug: manager.imageSlug,
      dateOfBirth: manager.dateOfBirth,
    },
  });

  return redirect(`/manager/${savedManager.id}`);
};

export const getManagersForTeamInSeason = async (
  teamId: string,
  seasonId: string
): Promise<Option[]> => {
  return prisma.managerInTeamSeason
    .findMany({
      where: {
        teamId,
        seasonId,
      },

      select: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    .then((ms) =>
      ms.map((m) => ({
        label: `${m.manager.firstName} ${m.manager.lastName}`,
        value: m.manager.id,
      }))
    );
};

export const saveManagerTeams = async (teams: ManagerTeamsForm) => {
  if (teams.teamsToDelete.length > 0) {
    await prisma.managerInTeamSeason.deleteMany({
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
      return prisma.managerInTeamSeason.update({
        where: {
          id: teamToUpdate.id,
        },
        data: teamToUpdate,
      });
    })
  );

  const create = teams.team.filter((team) => team.id === undefined);
  await prisma.managerInTeamSeason.createMany({
    data: create.map((team) => ({
      ...team,
      managerId: teams.managerId,
    })),
  });

  return redirect(`/manager/${teams.managerId}`);
};
