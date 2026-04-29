import { NextResponse } from "next/server";
import { isUnauthorizedError, requireSessionUser } from "@/lib/auth";
import {
  getChatSummariesForUser,
  isProductionPersistenceMisconfigured,
  PERSISTENCE_REQUIRED_MESSAGE,
} from "@/lib/store";

export async function GET() {
  try {
    if (isProductionPersistenceMisconfigured()) {
      return NextResponse.json({ error: PERSISTENCE_REQUIRED_MESSAGE }, { status: 503 });
    }

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
