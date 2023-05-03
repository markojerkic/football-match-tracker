import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

export type OptionWithImage = Option & { imageSlug: string | undefined };
export const getCountries = async (): Promise<OptionWithImage[]> => {
  return prisma.country
    .findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        imageSlug: true,
      },
    })
    .then((countries) =>
      countries.map(
        (c) =>
          ({
            value: c.id,
            label: c.name,
            imageSlug: c.imageSlug ?? undefined,
          } satisfies OptionWithImage)
      )
    );
};
