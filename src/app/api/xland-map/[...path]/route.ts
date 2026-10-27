import { NextRequest } from "next/server";
import { apiBase } from "@/features/user/server";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const path = (await ctx.params).path.join("/");
  const match =
    /^(?:tiles|planning\/[a-z0-9_-]{1,64}\/[a-zA-Z0-9_-][a-zA-Z0-9._-]{0,79})\/(\d{1,2})\/(\d{1,6})\/(\d{1,6})\.png$/.exec(
      path,
    );
  if (!match || req.nextUrl.search) return new Response(null, { status: 404 });
  const z = Number(match[1]),
    x = Number(match[2]),
    y = Number(match[3]);
  if (z < 0 || z > 20 || x >= 2 ** z || y >= 2 ** z)
    return new Response(null, { status: 400 });
  try {
    const base = new URL(apiBase());
    const result = await fetch(new URL("/maps/" + path, base.origin), {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!result.ok) return new Response(null, { status: result.status });
    if (!result.headers.get("content-type")?.startsWith("image/png"))
      return new Response(null, { status: 502 });
    const bytes = await result.arrayBuffer();
    if (bytes.byteLength > 2_000_000)
      return new Response(null, { status: 502 });
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
