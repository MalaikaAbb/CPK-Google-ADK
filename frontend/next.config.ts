import type { NextConfig } from "next";

/**
 * Keeping the Turbopack dev server inside this machine's memory.
 *
 * The dev server was being killed by the Linux OOM killer at 9–14 GB RSS, which
 * looks from the terminal like the app "crashing" on whichever route happened
 * to be compiling. The cause is not a route: it is Turbopack's persistent dev
 * cache. It is an append-only LSM store under `.next/dev/cache/turbopack`, it
 * is memory-mapped, and across a long run of restarts it had grown to 8.5 GB —
 * more than half the RAM on this box, which is already carrying ~6 GB of other
 * work before `next dev` starts.
 *
 * `turbopackMemoryEviction` defaults to `'auto'`, which evicts only when it
 * expects a large saving or detects pressure. On a harness this size that ran
 * too late to matter. `'full'` drops as much as possible after every snapshot:
 * the cache still lives on disk and still makes restarts fast, it just stops
 * being resident all at once.
 *
 * If the server still gets killed, the next step is
 * `experimental: { turbopackFileSystemCacheForDev: false }`, which turns the
 * persistent cache off entirely and trades every restart for a cold compile.
 */
const nextConfig: NextConfig = {
  experimental: {
    turbopackMemoryEviction: "full",
  },
};

export default nextConfig;
