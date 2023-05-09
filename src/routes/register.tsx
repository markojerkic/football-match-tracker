import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createServerAction$ } from "solid-start/server";
import { TextInput } from "~/components/form-helpers";
import { RegisterForm, register, registerSchema } from "~/server/auth";

export default () => {
  const [status, { Form }] = createServerAction$(async (formData: FormData, { request }) => {
    const data = registerSchema.parse(formData);

    return register(data, request);
  });

  const [user, setUser] = createStore<RegisterForm>({
    userName: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: ""
  });

  const isPasswordNotEqual = () => {
    return user.password !== user.password2;
  }


  return (
    <div class="mx-auto flex w-[90%] flex-col space-y-4 border-2 border-black p-4 md:w-[30%]">
      <span class="text-3xl font-bold">Register</span>

      <Form class="grid grid-cols-1 gap-2">

        <TextInput
          label="User name"
          type="text"
          class={status.error && "input-error"}
          required
          name="userName"
          control={{
            value: user.userName,
            setValue: (val) => setUser({ userName: val }),
          }}
        />
        <Show when={status.error?.message === "user-exists"}>
          <small class="text-error">
            User with given user name already exists.
          </small>
        </Show>

        <span />

        <TextInput
          label="First name"
          type="text"
          required
          name="firstName"
          control={{
            value: user.firstName,
            setValue: (val) => setUser({ firstName: val }),
          }}
        />

        <TextInput
          label="Last name"
          type="text"
          required
          name="lastName"
          control={{
            value: user.lastName,
            setValue: (val) => setUser({ lastName: val }),
          }}
        />


        <TextInput
          label="Password"
          type="password"
          required
          name="password"
          control={{
            value: user.password,
            setValue: (val) => setUser({ password: val }),
          }}
        />

        <TextInput
          label="Password repeated"
          type="password"
          required
          name="password2"
          control={{
            value: user.password2,
            setValue: (val) => setUser({ password2: val }),
          }}
        />

        <button type="submit" class="btn" disabled={isPasswordNotEqual()}>
          Register
        </button>
      </Form>
    </div>
  );
};
