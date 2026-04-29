import { redirect } from "next/navigation";
import ChatWorkspace from "@/components/ChatWorkspace";
import { getSessionUser } from "@/lib/auth";
import { getChatByIdForUser, getChatSummariesForUser } from "@/lib/store";

export default async function ChatPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const initialChats = await getChatSummariesForUser(user.id);
  const initialChat = initialChats.length
    ? await getChatByIdForUser(initialChats[0].id, user.id)
    : null;

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Private workspace</span>
          <h1>Your saved readings live here.</h1>
          <p>
            Ask new questions, continue older conversations, and keep your
            free-plan Astro AI experience organized in one place.
          </p>
        </div>

        <ChatWorkspace user={user} initialChats={initialChats} initialChat={initialChat} />
      </div>
    </section>
  );
}
