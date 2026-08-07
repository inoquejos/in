import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-nx-bg px-4 text-center">
      <span className="text-2xl font-black tracking-tight text-nx-red">NFLIX</span>
      <h1 className="text-3xl font-bold text-white sm:text-5xl">Lost your way?</h1>
      <p className="max-w-md text-nx-text-muted">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/browse"
        className="mt-2 rounded bg-white px-6 py-2.5 font-semibold text-black hover:bg-white/80"
      >
        Netflix Home
      </Link>
    </div>
  );
}
