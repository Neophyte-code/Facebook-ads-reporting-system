import { Sidebar } from "../components/Sidebar";

export default function LintfreePage() {
  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-[var(--font-geist-sans)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-50 sm:text-3xl">
              Lintfree report
            </h1>
            <p className="mt-1.5 text-sm text-stone-400">
              Facebook ads performance for Lintfree
            </p>
          </header>
          <div className="rounded-xl border border-stone-800 bg-stone-900/50 px-6 py-12 text-center text-stone-400 ring-1 ring-stone-800">
            Lintfree reporting content goes here.
          </div>
        </div>
      </main>
    </div>
  );
}
