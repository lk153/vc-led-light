"use client";

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
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  dict: ProductReviewsDict;
}) {
  const anonymous = "Anonymous";

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
        <button className="rounded-lg border-2 border-primary px-6 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white">
          {dict.writeReview}
        </button>
      </div>

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
