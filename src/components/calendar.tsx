import { debounce } from "@solid-primitives/scheduled";
import { createSignal } from "solid-js";
import { useSearchParams } from "solid-start";

export const Calendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = createSignal(
    searchParams.date ?? new Date().toISOString().split("T")[0]
  );

  const defferedDate = debounce((date: string) => {
    setSearchParams({ date: date });
    setSelectedDate(date);
  }, 500);

  return (
    <div class="my-4">
      <label
        for="date"
        class="mb-1  block flex-grow text-sm font-medium text-gray-700"
      >
        Kickoff date
      </label>
      <input
        type="date"
        class="block w-full rounded-l-md border-gray-300 px-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        onInput={(e) => {
          defferedDate((e.target as HTMLInputElement).value);
        }}
        value={selectedDate()}
        name="date"
        max={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
};
