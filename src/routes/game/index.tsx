export default () => {
  return (
    <a
      href="#"
      class="group relative block rounded-3xl border-4 border-black bg-white pt-12 transition hover:bg-yellow-50 sm:pt-16 lg:pt-24"
    >
      <span class="absolute inset-0 -z-10 -translate-x-2 -translate-y-2 rounded-3xl bg-white ring-4 ring-black"></span>

      <span class="absolute inset-0 -z-20 -translate-x-4 -translate-y-4 rounded-3xl bg-white ring-4 ring-black"></span>

      <div class="p-4 sm:p-6 lg:p-8">
        <p class="text-lg font-bold">Alert Components</p>

        <p class="mt-1 font-mono text-xs">7 Components</p>
      </div>
    </a>
  );
};
