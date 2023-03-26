import { useSearchParams } from "solid-start";

export const Calendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
        onChange={(e) =>
          setSearchParams({ date: (e.target as HTMLInputElement).value })
        }
        value={searchParams.date ?? new Date().toISOString().split("T")[0]}
        name="date"
        max={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
};
