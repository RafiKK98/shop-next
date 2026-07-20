import { auth } from "@/lib/auth/config";
import { getAdminCategoryById } from "@/services/admin/categories";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { categoryId } = await params;
  const category = await getAdminCategoryById(categoryId);

  if (!category)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(category);
}
