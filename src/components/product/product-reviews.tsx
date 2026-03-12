"use client";
import { useState, useTransition } from "react";
import { submitReview } from "@/actions/reviews";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

type ProductReviewsDict = {
  customerReviews: string;
  basedOn: string;
  writeReview: string;
  verifiedPurchaser: string;
  noReviews: string;
  viewAllReviews: string;
};

function StarRating({ rating, size = "text-sm" }: { rating: number; size?: string }) {
  return (
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined ${size}`}
          style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          {star <= rating ? "star" : star - 0.5 <= rating ? "star_half" : "star"}
        </span>
      ))}
    </div>
  );
}

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="text-amber-400 focus:outline-none"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProductReviews({
  reviews,
  rating,
  reviewCount,
  dict,
  productId,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  dict: ProductReviewsDict;
  productId: string;
}) {
  const anonymous = "Anonymous";
  const [showForm, setShowForm] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(starRating));
    startTransition(async () => {
      const result = await submitReview(productId, fd);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setShowForm(false);
        setStarRating(0);
      }
    });
  }

  return (
    <section className="mt-20">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h3 className="mb-2 text-2xl font-bold">{dict.customerReviews}</h3>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black">{rating.toFixed(1)}</span>
            <div>
              <StarRating rating={rating} size="text-base" />
              <p className="text-sm text-slate-500">
                {dict.basedOn.replace("{count}", reviewCount.toLocaleString())}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
            setSuccess(false);
          }}
          className="rounded-lg border-2 border-primary px-6 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white"
        >
          {dict.writeReview}
        </button>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h4 className="mb-4 text-lg font-bold text-slate-900">Write a Review</h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Rating
              </label>
              <InteractiveStarRating value={starRating} onChange={setStarRating} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Title
              </label>
              <input
                name="title"
                placeholder="Summarize your experience"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Review
              </label>
              <textarea
                name="body"
                rows={4}
                placeholder="Tell others what you think about this product..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? "Submitting…" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                  setStarRating(0);
                }}
                className="rounded-lg bg-slate-100 px-6 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Your review has been submitted. Thank you!
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="space-y-4 rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                    {getInitials(review.user.name)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold">
                      {review.user.name ?? anonymous}
                    </h5>
                    {review.verified && (
                      <p className="text-xs text-slate-500">{dict.verifiedPurchaser}</p>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.title && (
                <p className="text-sm font-bold">{review.title}</p>
              )}
              {review.body && (
                <p className="text-sm leading-relaxed text-slate-600">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-8">
          {dict.noReviews}
        </p>
      )}

      {reviewCount > reviews.length && (
        <button className="mt-8 w-full border-t border-slate-200 pt-4 text-sm font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary">
          {dict.viewAllReviews}
        </button>
      )}
    </section>
  );
}
