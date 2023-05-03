import { Resource } from "solid-js";
import { createStore } from "solid-js/store";
import { Title } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import {
    DateSelector,
    TextInput,
    type Option,
    Select,
} from "~/components/form-helpers";
import { getAllTeams } from "~/server/teams";

type PlayerForm = {
    id: string | undefined;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    imageSlug: string | undefined;
    currentTeam: string | undefined;
};

export default () => {
    const [player, setPlayer] = createStore<PlayerForm>({
        id: undefined,
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        imageSlug: undefined,
        currentTeam: undefined,
    });

    const [, { Form }] = createServerAction$(async (formData: FormData) => {
        const playerInfo = Object.fromEntries(formData.entries());
        console.log(playerInfo);
    });

    const teams: Resource<Option[]> = createServerData$(() => getAllTeams(), {
        key: () => ["teams"],
        initialValue: [],
    });

    const formSafeDateOfBirth = () => player.dateOfBirth.toJSON().split("T")[0];

    return (
        <>
            <Title>Add player </Title>

            <div class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">
                <span> Novi igrač </span>

                {JSON.stringify(player)}
                <span class="divider" />

                <Form class="flex flex-col group justify-center space-y-4">
                    <span class="grid grid-cols-2 gap-2">
                        <TextInput
                            required
                            name="firstName"
                            label="First name"
                            control={{
                                value: player.firstName,
                                setValue: (val) =>
                                    setPlayer({ firstName: val }),
                            }}
                        />

                        <TextInput
                            required
                            name="lastName"
                            label="Last name"
                            control={{
                                value: player.lastName,
                                setValue: (val) => setPlayer({ lastName: val }),
                            }}
                        />

                        <TextInput
                            required
                            name="imageSlug"
                            label="Image URL"
                            type="url"
                            control={{
                                value: player.imageSlug ?? "",
                                setValue: (val) =>
                                    setPlayer({ imageSlug: val }),
                            }}
                        />
                    </span>

                    <DateSelector
                        name="dateOfBirth"
                        label="Date of birth"
                        control={{
                            setValue: (val) =>
                                setPlayer({
                                    dateOfBirth: new Date(val as string),
                                }),
                            value: formSafeDateOfBirth(),
                        }}
                        type="date"
                    />

                    <Select
                        name="currentTeam"
                        label="Current team"
                        options={teams() ?? []}
                        required={false}
                        control={{
                            value: player.currentTeam ?? "",
                            setValue: (val) => setPlayer({ currentTeam: val }),
                        }}
                    />

                    <button class="btn group-invalid:btn-disabled" type="submit">Save</button>
                </Form>
            </div>
        </>
    );
};
