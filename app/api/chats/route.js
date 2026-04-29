import { NextResponse } from "next/server";
import { isUnauthorizedError, requireSessionUser } from "@/lib/auth";
import { getChatSummariesForUser } from "@/lib/store";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const chats = await getChatSummariesForUser(user.id);
    return NextResponse.json({ chats });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    return NextResponse.json({ error: "Could not load chats right now." }, { status: 500 });
  }
}
