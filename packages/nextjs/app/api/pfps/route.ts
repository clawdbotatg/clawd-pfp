import { NextResponse } from "next/server";
import pfps from "~~/data/pfps.json";

export const runtime = "nodejs";
// The CLAWD PFP mint window is closed — the list is frozen forever, so
// there's no reason to hit the chain on each request. Serve the static
// snapshot and let the edge cache do the rest.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(pfps, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
