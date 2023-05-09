import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { TextInput } from "~/components/form-helpers";
import { LogInForm, RegisterForm, logInAction, logInSchema, register, registerSchema } from "~/server/auth";

export default () => {
  const [status, { Form }] = createServerAction$(async (formData: FormData, { request }) => {
    const data = logInSchema.parse(formData);

    return logInAction(request, data);
  });

  const [user, setUser] = createStore<LogInForm>({
    userName: "",
    password: "",
  });


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
        <Show when={status.error?.message === "incorrect"}>
          <small class="text-error">
            User name or password not correct
          </small>
        </Show>

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

        <Show when={status.error?.message === "incorrect"}>
          <small class="text-error">
            User name or password not correct
          </small>
        </Show>


        <button type="submit" class="btn">
          Log in
        </button>
        <A href="/register" class="link">
          Register
        </A>
      </Form>
    </div>
  );
};
