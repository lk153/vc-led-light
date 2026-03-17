"use client";
import { useState } from "react";

export default function NewsletterForm({
  placeholder,
  successMessage,
}: {
  placeholder: string;
  successMessage: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <p className="text-sm text-green-600 font-medium flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">check_circle</span>
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 rounded-lg border-none bg-slate-100 px-4 text-sm focus:ring-primary dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
      />
      <button type="submit" className="rounded-lg bg-primary p-2 text-white">
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
}
