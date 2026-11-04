// Harness-authored. The Catalogs page registers a `Hero` component it never
// defines. A plain React component with the one prop the snippet declares.
export function Hero({ title }: { title: string }) {
  return (
    <header className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 p-6 text-white">
      <h2 className="text-2xl font-bold">{title}</h2>
    </header>
  );
}
