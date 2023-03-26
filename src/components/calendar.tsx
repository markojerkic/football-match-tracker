import { useSearchParams } from "solid-start";

export const Calendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div class="my-4">
      <label for="date" class="flex-grow  block font-medium text-sm text-gray-700 mb-1">Kickoff date</label>
      <input
        type="date"
        class="block w-full px-2 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-l-md shadow-sm"
        onChange={(e) =>
          setSearchParams({ date: (e.target as HTMLInputElement).value })
        }
        value={searchParams.date ??  new Date().toISOString().split("T")[0]}
        name="date"
        max={new Date().toISOString().split("T")[0]}
      />

    </div>
  );
};
