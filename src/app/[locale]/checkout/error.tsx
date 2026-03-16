"use client";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">
          error
        </span>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Checkout Error
        </h2>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
          {error.message || "Something went wrong during checkout. Please try again."}
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
