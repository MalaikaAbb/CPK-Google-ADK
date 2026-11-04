// Harness-authored. The Adopt from A2UI page registers `Airport` and `Arrow`
// and never defines them. Plain React components with the props the "After"
// catalog declares.
export function Airport({ code, city }: { code: string; city: string }) {
  return (
    <div className="inline-flex flex-col items-center rounded-lg border px-3 py-2">
      <span className="text-xl font-bold tracking-wider">{code}</span>
      <span className="text-xs text-slate-500">{city}</span>
    </div>
  );
}

export function Arrow() {
  return <span className="mx-2 text-xl">→</span>;
}
