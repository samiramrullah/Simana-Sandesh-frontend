import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/api";

const API_URL = (process.env.API_URL || "http://localhost:8080").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const token = req.cookies.get("ss_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Cookie: `ss_token=${encodeURIComponent(token)}` },
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
