import { createSupabaseServerClient } from "../lib/supabase/server";
import Link from "next/link";

type ListingImage = {
  id: number;
  url: string;
};

type Listing = {
  id: number;
  title: string;
  description: string | null;
  price_cents: number;
  category: string | null;
  condition: string | null;
  status: string;
  created_at: string;
  listing_images: ListingImage[];
};

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id,title,description,price_cents,category,condition,status,created_at,listing_images(id,url)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Listings</h1>
          <Link className="rounded-xl border px-3 py-1.5 text-sm" href="/sell">
            + Sell something
          </Link>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            Failed to load listings: {error.message}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {(listings as Listing[] | null)?.map((l) => (
            <div key={l.id} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{l.title}</h2>
                  {l.description && <p className="mt-1 text-sm text-gray-700">{l.description}</p>}
                  <p className="mt-2 text-sm">
                    <span className="font-medium">${(l.price_cents / 100).toFixed(2)}</span>
                    {l.category ? <span className="text-gray-600"> • {l.category}</span> : null}
                    {l.condition ? <span className="text-gray-600"> • {l.condition}</span> : null}
                  </p>
                </div>

                {l.listing_images?.[0]?.url ? (
                  // using img to keep it simple; we can switch to next/image later
                  <img
                    src={l.listing_images[0].url}
                    alt={l.title}
                    className="h-20 w-20 rounded-xl object-cover border"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl border flex items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          ))}

          {!error && (!listings || listings.length === 0) && (
            <p className="text-sm text-gray-600">No listings yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
