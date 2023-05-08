import { createStore } from "solid-js/store";
import { createServerAction$ } from "solid-start/server";
import { TextInput } from "~/components/form-helpers";

export default () => {
  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    console.log(Object.fromEntries(formData.entries()));
  });

  const [user, setUser] = createStore<{
    username: string;
    password: string;
    password2: string;
  }>({
    username: "",
    password: "",
    password2: "",
  });

  const isPasswordNotEqual = () => {
    return user.password !== user.password2;
  }


  return (
    <div class="mx-auto flex w-[90%] flex-col space-y-4 border-2 border-black p-4 md:w-[30%]">
      <span class="text-3xl font-bold">Register</span>

      <Form class="grid grid-cols-1 gap-2">

        <TextInput
          label="Username"
          type="text"
          required
          name="username"
          control={{
            value: user.username,
            setValue: (val) => setUser({ username: val }),
          }}
        />

        <span />

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
