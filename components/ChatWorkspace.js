"use client";

import { useState } from "react";

const readingModes = [
  { value: "astro", label: "Astrology guidance" },
  { value: "numerology", label: "Numerology reading" },
  { value: "tarot", label: "Tarot message" },
  { value: "kundli", label: "Kundli-style advice" },
];

const initialDraft = {
  mode: "astro",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  question: "",
};

function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function titleFromChats(chats, activeChatId) {
  return chats.find((chat) => chat.id === activeChatId)?.title || "Ask your first question";
}

export default function ChatWorkspace({ user, initialChats, initialChat }) {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChat?.id || null);
  const [messages, setMessages] = useState(initialChat?.messages || []);
  const [draft, setDraft] = useState(initialDraft);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setError("");
    setStatus("New conversation ready. Ask your question when you are ready.");
  }

  async function handleOpenChat(chatId) {
    if (!chatId || chatId === activeChatId) {
      return;
    }

    setIsLoadingChat(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load that conversation.");
        return;
      }

      setActiveChatId(data.chat.id);
      setMessages(data.chat.messages);
      setStatus("Conversation loaded from your history.");
    } catch (requestError) {
      setError("Could not load that conversation.");
    } finally {
      setIsLoadingChat(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!draft.question.trim()) {
      setError("Please enter a question before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: activeChatId,
          ...draft,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not send your question.");
        return;
      }

      setChats(data.chats);
      setActiveChatId(data.chat.id);
      setMessages(data.chat.messages);
      setDraft((current) => ({
        ...current,
        question: "",
      }));
      setStatus(data.created ? "New chat saved to your history." : "Your conversation has been updated.");
    } catch (requestError) {
      setError("Could not send your question.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeTitle = titleFromChats(chats, activeChatId);

  return (
    <div className="workspace-shell">
      <aside className="panel sidebar-panel">
        <div className="sidebar-top">
          <div>
            <span className="eyebrow">Free beta</span>
            <h2>{user.name.split(" ")[0]}'s space</h2>
          </div>

          <button className="secondary-button" onClick={handleNewChat} type="button">
            New chat
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="detail-label">Plan</p>
            <strong className="stat-value">Free</strong>
            <p className="helper-copy">Premium can be added later.</p>
          </div>

          <div className="stat-card">
            <p className="detail-label">Saved chats</p>
            <strong className="stat-value">{chats.length}</strong>
            <p className="helper-copy">Private history per account.</p>
          </div>
        </div>

        <div className="plan-panel">
          <span className="eyebrow">Next phase</span>
          <p className="workspace-note">
            Premium later can unlock deeper reports, paid AI, voice readings,
            or stronger usage controls.
          </p>
        </div>

        <div className="history-row">
          <h3>Chat history</h3>
          <span className="helper-copy">{chats.length} saved</span>
        </div>

        <div className="chat-list">
          {chats.length ? (
            chats.map((chat) => (
              <button
                className={`chat-item ${activeChatId === chat.id ? "active" : ""}`}
                key={chat.id}
                onClick={() => handleOpenChat(chat.id)}
                type="button"
              >
                <div className="chat-title">{chat.title}</div>
                <div className="chat-preview">{chat.preview}</div>
                <div className="chat-meta">
                  <span>{chat.mode}</span>
                  <span>{formatDate(chat.updatedAt)}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="empty-state">
              <strong>No chats yet</strong>
              <p className="helper-copy">
                Your first question will create a saved conversation here.
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className="panel workspace-panel">
        <div className="workspace-header">
          <div>
            <span className="eyebrow">{activeChatId ? "Saved conversation" : "New reading"}</span>
            <h2>{activeTitle}</h2>
            <p className="muted-copy">
              Ask about love, career, timing, focus, or spiritual direction.
              Birth details are optional but can shape the response.
            </p>
          </div>

          <span className={`status-pill ${activeChatId ? "success" : ""}`}>
            {activeChatId ? "History enabled" : "Ready for first chat"}
          </span>
        </div>

        {error ? <div className="form-message error">{error}</div> : null}
        {status ? <div className="form-message success">{status}</div> : null}

        <div className="message-feed">
          {messages.length ? (
            messages.map((message) => (
              <article className={`message-bubble ${message.role}`} key={message.id}>
                <div className="message-head">
                  <span className="message-role">
                    {message.role === "assistant" ? "Drishti AI" : user.name}
                  </span>
                  <span className="helper-copy">{formatDate(message.createdAt)}</span>
                </div>

                <p className="message-text">{message.content}</p>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>Start a new astrology conversation</strong>
              <p className="helper-copy">
                Choose a reading style, add optional birth details, and ask
                anything you want guidance on.
              </p>
            </div>
          )}
        </div>

        <form className="composer-shell" onSubmit={handleSubmit}>
          <div className="composer-grid">
            <label>
              Reading style
              <select name="mode" onChange={handleDraftChange} value={draft.mode}>
                {readingModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Birth date
              <input name="birthDate" onChange={handleDraftChange} type="date" value={draft.birthDate} />
            </label>

            <label>
              Birth time
              <input name="birthTime" onChange={handleDraftChange} type="time" value={draft.birthTime} />
            </label>

            <label>
              Birth place
              <input
                name="birthPlace"
                onChange={handleDraftChange}
                placeholder="City, country"
                value={draft.birthPlace}
              />
            </label>

            <label className="full">
              Your question
              <textarea
                name="question"
                onChange={handleDraftChange}
                placeholder="What should I focus on in love, career, timing, money, or life direction right now?"
                value={draft.question}
              />
            </label>
          </div>

          <div className="composer-row">
            <p className="tiny-note">
              Free beta note: answers are guidance-style, not exact astrological
              calculations.
            </p>

            <button className="primary-button" disabled={isSubmitting || isLoadingChat} type="submit">
              {isSubmitting ? "Reading..." : "Send question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
