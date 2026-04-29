import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const PERSISTENCE_REQUIRED_MESSAGE =
  "Database is not configured. Add MONGODB_URI in Vercel, redeploy, then create your account again.";

export function hasMongo() {
  return Boolean(process.env.MONGODB_URI);
}

export function isProductionPersistenceMisconfigured() {
  return process.env.NODE_ENV === "production" && !hasMongo();
}

function getMemoryStore() {
  if (!globalThis.__drishtiMemoryStore) {
    globalThis.__drishtiMemoryStore = {
      users: [],
      sessions: [],
      chats: [],
    };
  }

  return globalThis.__drishtiMemoryStore;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function toIso(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toIdString(value) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.toString();
}

function toObjectId(value) {
  if (!ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
}

function buildTitle(question) {
  const cleaned = String(question || "").trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return "New reading";
  }

  if (cleaned.length <= 52) {
    return cleaned;
  }

  return `${cleaned.slice(0, 49)}...`;
}

function buildPreview(messages = []) {
  const lastMessage = [...messages].reverse().find((message) => message.role === "assistant") || messages[messages.length - 1];
  const content = String(lastMessage?.content || "No messages yet.").replace(/\s+/g, " ").trim();
  return content.length > 92 ? `${content.slice(0, 89)}...` : content;
}

function mapUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: toIdString(user._id || user.id),
    name: user.name,
    email: user.email,
    plan: user.plan || "free",
    createdAt: toIso(user.createdAt),
  };
}

function mapUserForAuth(user) {
  if (!user) {
    return null;
  }

  return {
    ...mapUser(user),
    passwordHash: user.passwordHash,
  };
}

function mapMessage(message) {
  return {
    id: message.id || toIdString(message._id) || randomUUID(),
    role: message.role,
    content: message.content,
    createdAt: toIso(message.createdAt) || new Date().toISOString(),
    mode: message.mode || "astro",
  };
}

function mapChat(chat) {
  const messages = (chat.messages || []).map(mapMessage);

  return {
    id: toIdString(chat._id || chat.id),
    userId: toIdString(chat.userId),
    title: chat.title,
    mode: chat.mode || "astro",
    plan: chat.plan || "free",
    createdAt: toIso(chat.createdAt),
    updatedAt: toIso(chat.updatedAt),
    preview: buildPreview(messages),
    messageCount: messages.length,
    messages,
  };
}

function mapChatSummary(chat) {
  const mapped = mapChat(chat);

  return {
    id: mapped.id,
    title: mapped.title,
    mode: mapped.mode,
    updatedAt: mapped.updatedAt,
    preview: mapped.preview,
    messageCount: mapped.messageCount,
  };
}

async function ensureIndexes() {
  if (!hasMongo()) {
    return;
  }

  if (!globalThis.__drishtiMongoIndexPromise) {
    globalThis.__drishtiMongoIndexPromise = (async () => {
      const database = await getDatabase();

      await Promise.all([
        database.collection("users").createIndex({ email: 1 }, { unique: true }),
        database.collection("sessions").createIndex({ token: 1 }, { unique: true }),
        database.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        database.collection("chats").createIndex({ userId: 1, updatedAt: -1 }),
      ]);
    })();
  }

  await globalThis.__drishtiMongoIndexPromise;
}

export async function findUserForAuthByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  if (!hasMongo()) {
    const user = getMemoryStore().users.find((entry) => entry.email === normalizedEmail);
    return mapUserForAuth(user);
  }

  await ensureIndexes();
  const database = await getDatabase();
  const user = await database.collection("users").findOne({ email: normalizedEmail });
  return mapUserForAuth(user);
}

export async function createUser({ name, email, passwordHash }) {
  const trimmedName = String(name || "").trim();
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();

  if (!hasMongo()) {
    const memory = getMemoryStore();
    const user = {
      id: randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      plan: "free",
      createdAt: now,
    };

    memory.users.push(user);
    return mapUser(user);
  }

  await ensureIndexes();
  const database = await getDatabase();
  const users = database.collection("users");
  const document = {
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
    plan: "free",
    createdAt: now,
  };

  const result = await users.insertOne(document);
  return mapUser({ ...document, _id: result.insertedId });
}

export async function findUserById(userId) {
  if (!userId) {
    return null;
  }

  if (!hasMongo()) {
    const user = getMemoryStore().users.find((entry) => entry.id === userId);
    return mapUser(user);
  }

  const database = await getDatabase();
  const objectId = toObjectId(userId);

  if (!objectId) {
    return null;
  }

  const user = await database.collection("users").findOne({ _id: objectId });
  return mapUser(user);
}

export async function createSessionRecord({ userId, token, expiresAt }) {
  const now = new Date();

  if (!hasMongo()) {
    getMemoryStore().sessions.push({
      id: randomUUID(),
      token,
      userId,
      createdAt: now,
      expiresAt,
    });

    return;
  }

  await ensureIndexes();
  const database = await getDatabase();
  await database.collection("sessions").insertOne({
    token,
    userId: new ObjectId(userId),
    createdAt: now,
    expiresAt,
  });
}

export async function deleteSessionRecord(token) {
  if (!token) {
    return;
  }

  if (!hasMongo()) {
    const memory = getMemoryStore();
    memory.sessions = memory.sessions.filter((session) => session.token !== token);
    return;
  }

  const database = await getDatabase();
  await database.collection("sessions").deleteOne({ token });
}

export async function findUserBySessionToken(token) {
  if (!token) {
    return null;
  }

  const now = new Date();

  if (!hasMongo()) {
    const memory = getMemoryStore();
    memory.sessions = memory.sessions.filter((session) => new Date(session.expiresAt) > now);
    const session = memory.sessions.find((entry) => entry.token === token);

    if (!session) {
      return null;
    }

    const user = memory.users.find((entry) => entry.id === session.userId);
    return mapUser(user);
  }

  const database = await getDatabase();
  const session = await database.collection("sessions").findOne({
    token,
    expiresAt: { $gt: now },
  });

  if (!session) {
    return null;
  }

  const user = await database.collection("users").findOne({ _id: session.userId });
  return mapUser(user);
}

export async function getChatSummariesForUser(userId) {
  if (!userId) {
    return [];
  }

  if (!hasMongo()) {
    const chats = getMemoryStore().chats
      .filter((chat) => chat.userId === userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return chats.map(mapChatSummary);
  }

  const database = await getDatabase();
  const chats = await database
    .collection("chats")
    .find({ userId: new ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .toArray();

  return chats.map(mapChatSummary);
}

export async function getChatByIdForUser(chatId, userId) {
  if (!chatId || !userId) {
    return null;
  }

  if (!hasMongo()) {
    const chat = getMemoryStore().chats.find((entry) => entry.id === chatId && entry.userId === userId);
    return mapChat(chat);
  }

  const database = await getDatabase();
  const chatObjectId = toObjectId(chatId);

  if (!chatObjectId) {
    return null;
  }

  const chat = await database.collection("chats").findOne({
    _id: chatObjectId,
    userId: new ObjectId(userId),
  });

  return mapChat(chat);
}

export async function saveChatExchange({ chatId, userId, mode, question, answer }) {
  const now = new Date();
  const userMessage = {
    id: randomUUID(),
    role: "user",
    content: question,
    mode,
    createdAt: now,
  };
  const assistantMessage = {
    id: randomUUID(),
    role: "assistant",
    content: answer,
    mode,
    createdAt: new Date(now.getTime() + 1000),
  };

  if (!hasMongo()) {
    const memory = getMemoryStore();
    let chat = null;
    let created = false;

    if (chatId) {
      chat = memory.chats.find((entry) => entry.id === chatId && entry.userId === userId);
      if (!chat) {
        return null;
      }
    } else {
      created = true;
      chat = {
        id: randomUUID(),
        userId,
        title: buildTitle(question),
        mode,
        plan: "free",
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      memory.chats.push(chat);
    }

    chat.updatedAt = now;
    if (!chat.title) {
      chat.title = buildTitle(question);
    }
    if (!chat.mode) {
      chat.mode = mode;
    }
    chat.messages.push(userMessage, assistantMessage);

    return {
      created,
      chat: mapChat(chat),
    };
  }

  const database = await getDatabase();
  const chats = database.collection("chats");
  const userObjectId = new ObjectId(userId);

  if (chatId) {
    const chatObjectId = toObjectId(chatId);

    if (!chatObjectId) {
      return null;
    }

    const existing = await chats.findOne({
      _id: chatObjectId,
      userId: userObjectId,
    });

    if (!existing) {
      return null;
    }

    await chats.updateOne(
      {
        _id: chatObjectId,
        userId: userObjectId,
      },
      {
        $set: {
          updatedAt: now,
        },
        $push: {
          messages: {
            $each: [userMessage, assistantMessage],
          },
        },
      },
    );

    const updatedChat = await chats.findOne({
      _id: chatObjectId,
      userId: userObjectId,
    });

    return {
      created: false,
      chat: mapChat(updatedChat),
    };
  }

  const document = {
    userId: userObjectId,
    title: buildTitle(question),
    mode,
    plan: "free",
    createdAt: now,
    updatedAt: now,
    messages: [userMessage, assistantMessage],
  };

  const result = await chats.insertOne(document);
  const createdChat = await chats.findOne({ _id: result.insertedId });

  return {
    created: true,
    chat: mapChat(createdChat),
  };
}
