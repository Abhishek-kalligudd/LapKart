import React from 'react';

/**
 * Single Shimmering Product Card Skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm border p-5 flex flex-col select-none">
      {/* Laptop Image Placeholder with Shimmer */}
      <div className="aspect-[4/3] rounded-2xl shimmer-box mb-4 relative" />

      {/* Card Content Skeleton */}
      <div className="flex-1 flex flex-col space-y-3">
        {/* Title */}
        <div className="h-5 w-4/5 rounded-lg shimmer-box" />

        {/* Specs Lines */}
        <div className="space-y-1.5">
          <div className="h-3 w-3/5 rounded-md shimmer-box" />
          <div className="h-3 w-1/2 rounded-md shimmer-box" />
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <div className="h-6 w-20 rounded-md shimmer-box" />
            <div className="h-3 w-12 rounded-sm shimmer-box" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl shimmer-box" />
            <div className="w-16 h-8 rounded-xl shimmer-box" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Shimmering Product Cards
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

/**
 * Product Detail Page Shimmer Skeleton
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen py-10 bg-background select-none">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 rounded-md shimmer-box mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery Showcase Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[16/10] rounded-3xl shimmer-box w-full" />
            <div className="flex gap-3">
              <div className="w-20 h-16 rounded-xl shimmer-box" />
              <div className="w-20 h-16 rounded-xl shimmer-box" />
              <div className="w-20 h-16 rounded-xl shimmer-box" />
            </div>
          </div>

          {/* Right: Product Details Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-28 rounded-full shimmer-box" />
            <div className="h-8 w-4/5 rounded-xl shimmer-box" />
            <div className="h-4 w-3/5 rounded-lg shimmer-box" />

            <div className="h-10 w-36 rounded-lg shimmer-box" />

            {/* Spec Pills Grid Skeleton */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y">
              <div className="h-14 rounded-2xl shimmer-box" />
              <div className="h-14 rounded-2xl shimmer-box" />
              <div className="h-14 rounded-2xl shimmer-box" />
              <div className="h-14 rounded-2xl shimmer-box" />
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-14 rounded-2xl shimmer-box w-full" />
              <div className="h-12 rounded-2xl shimmer-box w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Page Shimmer Skeleton
 */
export function CartSkeleton() {
  return (
    <div className="min-h-screen py-12 bg-background select-none">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="h-8 w-48 rounded-xl shimmer-box mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-5 rounded-2xl border bg-card flex gap-4 items-center">
                <div className="w-24 h-20 rounded-xl shimmer-box flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/5 rounded-md shimmer-box" />
                  <div className="h-3 w-2/5 rounded-md shimmer-box" />
                  <div className="h-4 w-24 rounded-md shimmer-box" />
                </div>
                <div className="w-24 h-9 rounded-xl shimmer-box" />
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl border bg-card space-y-4">
              <div className="h-6 w-36 rounded-md shimmer-box" />
              <div className="h-4 w-full rounded-md shimmer-box" />
              <div className="h-4 w-full rounded-md shimmer-box" />
              <div className="h-6 w-24 rounded-md shimmer-box pt-4 border-t" />
              <div className="h-12 w-full rounded-xl shimmer-box mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Orders History Shimmer Skeleton
 */
export function OrdersSkeleton() {
  return (
    <div className="min-h-screen py-12 bg-background select-none">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="h-8 w-48 rounded-xl shimmer-box mb-6" />

        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-3xl border bg-card space-y-5">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="space-y-1.5">
                <div className="h-5 w-40 rounded-md shimmer-box" />
                <div className="h-3 w-28 rounded-md shimmer-box" />
              </div>
              <div className="h-7 w-24 rounded-full shimmer-box" />
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-16 rounded-xl shimmer-box" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded-md shimmer-box" />
                <div className="h-3 w-1/4 rounded-md shimmer-box" />
              </div>
              <div className="h-5 w-20 rounded-md shimmer-box" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
