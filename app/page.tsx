import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-950">
      <section className="w-full max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                Survey Management
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Create, share, and review surveys from one clean workspace.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Build questionnaires, collect responses, and keep survey work
                organized for your team.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-md bg-teal-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Log in
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active survey
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Student Feedback Form
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-slate-100 p-4">
                  <p className="text-3xl font-semibold">128</p>
                  <p className="mt-1 text-sm text-slate-600">Responses</p>
                </div>
                <div className="rounded-md bg-teal-50 p-4">
                  <p className="text-3xl font-semibold text-teal-800">86%</p>
                  <p className="mt-1 text-sm text-teal-900">Completion</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 w-4/5 rounded-full bg-teal-700" />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Question 8 of 10</span>
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
