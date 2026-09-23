import { NextResponse } from "next/server";
import { getRecentAuditLogs } from "@/lib/audit";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const logs = await getRecentAuditLogs(limit);
    return NextResponse.json({ success: true, data: logs });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil audit logs" }, { status: 500 });
  }
}
