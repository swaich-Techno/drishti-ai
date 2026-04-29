import { NextResponse } from "next/server";
import { generateAstroResponse } from "@/lib/astro-engine";
import { isUnauthorizedError, requireSessionUser } from "@/lib/auth";
import {
  getChatSummariesForUser,
  isProductionPersistenceMisconfigured,
  PERSISTENCE_REQUIRED_MESSAGE,
  saveChatExchange,
} from "@/lib/store";

export async function POST(request) {
  try {
    if (isProductionPersistenceMisconfigured()) {
      return NextResponse.json({ error: PERSISTENCE_REQUIRED_MESSAGE }, { status: 503 });
    }

    const user = await requireSessionUser();
    const body = await request.json();
    const question = String(body.question || "").trim();
    const mode = String(body.mode || "astro").trim() || "astro";
    const chatId = body.chatId || null;
    const birthDate = String(body.birthDate || "").trim();
    const birthTime = String(body.birthTime || "").trim();
    const birthPlace = String(body.birthPlace || "").trim();

    if (question.length < 4) {
      return NextResponse.json({ error: "Please ask a slightly longer question." }, { status: 400 });
    }

    const answer = generateAstroResponse({
      name: user.name,
      mode,
      question,
      birthDate,
      birthTime,
      birthPlace,
    });

    const saved = await saveChatExchange({
      chatId,
      userId: user.id,
      mode,
      question,
      answer,
    });

    if (!saved) {
      return NextResponse.json({ error: "That chat could not be found." }, { status: 404 });
    }

    const chats = await getChatSummariesForUser(user.id);

    return NextResponse.json({
      created: saved.created,
      chat: saved.chat,
      chats,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    return NextResponse.json({ error: "Could not create the reading right now." }, { status: 500 });
  }
}
