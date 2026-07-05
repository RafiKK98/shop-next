// Proxy (replaces middleware.ts in Next.js 16)
// Authentication and request interception will be added in Phase 5.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}
