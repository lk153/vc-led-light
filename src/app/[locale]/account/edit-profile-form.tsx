"use client";
import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profile";

export default function EditProfileForm({
  name,
  email,
  phone,
  accountType,
  emailVerified,
  dict,
}: {
  name: string;
  email: string;
  phone: string;
  accountType: string;
  emailVerified: boolean;
  dict: {
    save: string;
    cancel: string;
    edit: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    accountType: string;
    personalDetails: string;
    verified: string;
  };
}) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result.error) setError(result.error);
      else {
        setEditing(false);
        setError("");
      }
    });
  }

  const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest";
  const valueClass = "text-slate-900 dark:text-white font-medium text-lg";
  const inputClass =
    "w-full px-3 py-2 border border-slate-200 rounded-lg text-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {dict.personalDetails}
        </h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            {dict.edit}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="submit"
              form="edit-profile-form"
              disabled={isPending}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {isPending ? "..." : dict.save}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300"
            >
              {dict.cancel}
            </button>
          </div>
        )}
      </div>
      <form id="edit-profile-form" onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-1">
            <label className={labelClass}>{dict.fullName}</label>
            {editing ? (
              <input
                name="name"
                defaultValue={name}
                required
                className={inputClass}
              />
            ) : (
              <p className={valueClass}>{name || "—"}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className={labelClass}>{dict.emailAddress}</label>
            <p className={valueClass}>{email}</p>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>{dict.phoneNumber}</label>
            {editing ? (
              <input
                name="phone"
                defaultValue={phone}
                type="tel"
                className={inputClass}
              />
            ) : (
              <p className={valueClass}>{phone || "—"}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className={labelClass}>{dict.accountType}</label>
            <div className="flex items-center gap-2">
              <p className={`${valueClass} capitalize`}>{accountType}</p>
              {emailVerified && (
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded uppercase">
                  {dict.verified}
                </span>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}
