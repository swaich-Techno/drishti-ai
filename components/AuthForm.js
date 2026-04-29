"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = values.name.trim();
    const email = values.email.trim();
    const password = values.password;

    if (isSignup && name.length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(isSignup ? "Account created. Opening your workspace..." : "Login successful. Opening your workspace...");
      router.push("/chat");
      router.refresh();
    } catch (requestError) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel auth-card">
      <span className="eyebrow">{isSignup ? "Create account" : "Account login"}</span>
      <h2>{isSignup ? "Start your free workspace" : "Enter your workspace"}</h2>
      <p className="muted-copy">
        {isSignup
          ? "Create your free account to save chat history and return to old readings."
          : "Log back in to continue the conversations already saved to your account."}
      </p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field-group">
          {isSignup ? (
            <label>
              Full name
              <input
                autoComplete="name"
                name="name"
                onChange={updateField}
                placeholder="Your name"
                value={values.name}
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={updateField}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              name="password"
              onChange={updateField}
              placeholder="At least 6 characters"
              type="password"
              value={values.password}
            />
          </label>
        </div>

        {error ? <div className="form-message error">{error}</div> : null}
        {success ? <div className="form-message success">{success}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : isSignup ? "Create free account" : "Log in"}
        </button>
      </form>

      <div className="auth-links">
        <span>{isSignup ? "Already have an account?" : "New here?"}</span>
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in instead" : "Create a free account"}
        </Link>
      </div>
    </div>
  );
}
