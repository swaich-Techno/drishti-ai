"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/");
      router.refresh();
      setIsSubmitting(false);
    }
  }

  return (
    <button className="ghost-button" disabled={isSubmitting} onClick={handleLogout} type="button">
      {isSubmitting ? "Logging out..." : "Logout"}
    </button>
  );
}
