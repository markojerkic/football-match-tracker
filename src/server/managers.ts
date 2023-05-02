import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

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
