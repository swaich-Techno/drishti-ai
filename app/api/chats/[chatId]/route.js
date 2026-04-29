import { NextResponse } from "next/server";
import { isUnauthorizedError, requireSessionUser } from "@/lib/auth";
import {
  getChatByIdForUser,
  isProductionPersistenceMisconfigured,
  PERSISTENCE_REQUIRED_MESSAGE,
} from "@/lib/store";

export async function GET(_request, { params }) {
  try {
    if (isProductionPersistenceMisconfigured()) {
      return NextResponse.json({ error: PERSISTENCE_REQUIRED_MESSAGE }, { status: 503 });
    }

    const user = await requireSessionUser();
    const chat = await getChatByIdForUser(params.chatId, user.id);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    return NextResponse.json({ error: "Could not load that chat." }, { status: 500 });
  }
}
