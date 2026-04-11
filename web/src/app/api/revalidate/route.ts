import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: string };
    slug = body.slug;
  } catch {
    /* empty body */
  }

  revalidateTag("containers");
  if (slug) {
    revalidateTag(`container-${slug}`);
  }
  revalidatePath("/reference/container");
  if (slug) {
    revalidatePath(`/reference/container/${slug}`);
  }

  return NextResponse.json({ ok: true, revalidated: true, slug: slug ?? null });
}
