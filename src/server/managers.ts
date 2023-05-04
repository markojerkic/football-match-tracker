import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";
import { ServerError, redirect } from "solid-start";
import { playerManagerFormSchema } from "./players";

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
  console.log(manager);

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
