import { IFormControl } from "solid-forms";
import { For } from "solid-js";

const HiddenOption = () => <option class="hidden" disabled selected />;
export type Option = { label: string; value: string | number };
export const Select = (props: {
  control: IFormControl<string>;
  name: string;
  options: Option[];
}) => {
  return (
    <span class="flex flex-col">
      <label for="competition">Competition</label>
      <select
        class="select-bordered select w-full max-w-xs"
        name={props.name}
        required
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
