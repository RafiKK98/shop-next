"use client";

export function ReviewSortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      id="review-sort"
      className="select select-bordered select-sm"
      defaultValue={defaultValue}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set("reviewSort", e.target.value);
        url.searchParams.set("reviewPage", "1");
        window.location.href = url.toString();
      }}
    >
      <option value="newest">Newest</option>
      <option value="highest">Highest Rated</option>
      <option value="lowest">Lowest Rated</option>
    </select>
  );
}
