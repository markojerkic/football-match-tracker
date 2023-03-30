import { Toggle } from "solid-headless";
import { For } from "solid-js";

const HiddenOption = () => <option class="hidden" disabled selected />;
export type Option = { label: string; value: string | number };
export const Select = (props: {
  control: { setValue: (value: string) => void; value: string };
  disabled?: boolean;
  name: string;
  label: string;
  options: Option[];
}) => {
  return (
    <span class="flex flex-col">
      <label for="competition">{props.label}</label>
      <select
        class="select-bordered select w-full max-w-xs"
        name={props.name}
        required
        disabled={props.disabled ?? false}
        value={props.control.value}
        onInput={(e) => {
          props.control.setValue(e.currentTarget.value);
        }}
      >
        <HiddenOption />
        <For each={props.options}>
          {(option) => <option label={option.label} value={option.value} />}
        </For>
      </select>
    </span>
  );
};

export const Date = (props: {
  control: { setValue: (value: string) => void; value: string };
  disabled?: boolean;
  name: string;
  label: string;
  type: "date" | "datetime-local";
}) => {
  return (
    <span class="flex flex-col">
      <label for="kickoffTime">{props.label}</label>
      <input
        name={props.name}
        type={props.type}
        required
        disabled={props.disabled ?? false}
        value={props.control.value}
        onInput={(e) => {
          props.control.setValue(e.currentTarget.value);
        }}
      />
    </span>
  );
};

export const Checkbox = (props: {
  control: { setValue: (value: boolean) => void; value: boolean };
  disabled?: boolean;
  name: string;
  label: string;
}) => {
  /*
  return (
    <span class="flex flex-col">
      <label for={props.name}>{props.label}</label>
      <Toggle
        class="toggle"
        classList={{
          "text-color-600 bg-purple-200": props.control.value,
          "flex h-6 w-6 items-center justify-center rounded transition focus:outline-none focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75":
            true,
        }}
        defaultPressed
        pressed={props.control.value}
        name={props.name}
        onChange={(e) => props.control.setValue(e)}
      />
    </span>
  );
  */
  return (
    <span class="flex flex-col">
      <label for={props.name}>{props.label}</label>
      <input
        type="checkbox"
        name={props.name}
        class="toggle"
        checked={props.control.value}
        onInput={() => {
          props.control.setValue(!props.control.value);
        }}
      />
    </span>
  );
};