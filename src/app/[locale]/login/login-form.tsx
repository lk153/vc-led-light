"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { login, register } from "@/actions/auth";
import type { Dictionary } from "@/i18n/get-dictionary";

type Props = {
  locale: string;
  dict: Dictionary;
};

export default function LoginForm({ locale, dict }: Props) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const router = useRouter();
  const t = dict.login;

  const [loginState, loginAction, loginPending] = useActionState(login, null);
  const [registerState, registerAction, registerPending] = useActionState(
    register,
    null
  );

  useEffect(() => {
    if (loginState?.success || registerState?.success) {
      router.push(`/${locale}/account`);
      router.refresh();
    }
  }, [loginState, registerState, locale, router]);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.welcomeTitle}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t.welcomeSubtitle}</p>
      </div>

      {/* Toggle */}
      <div className="mb-8 flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={
            activeTab === "login"
              ? "flex h-full grow items-center justify-center rounded-lg bg-white dark:bg-slate-700 px-2 text-sm font-semibold text-primary shadow-sm"
              : "flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
          }
        >
          {t.loginTab}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("signup")}
          className={
            activeTab === "signup"
              ? "flex h-full grow items-center justify-center rounded-lg bg-white dark:bg-slate-700 px-2 text-sm font-semibold text-primary shadow-sm"
              : "flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
          }
        >
          {t.signUpTab}
        </button>
      </div>

      {/* Error message */}
      {(activeTab === "login" ? loginState?.error : registerState?.error) && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 font-medium">
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">
            error
          </span>
          {activeTab === "login" ? loginState?.error : registerState?.error}
        </div>
      )}

      {activeTab === "login" ? (
        /* Login Form */
        <form action={loginAction} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.emailLabel}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                mail
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.passwordLabel}
              </label>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                {t.forgotPassword}
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                lock
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3.5 pl-12 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="text-sm text-slate-500 dark:text-slate-400">
              {t.keepLoggedIn}
            </label>
          </div>

          <button
            type="submit"
            disabled={loginPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {loginPending ? (
              dict.common.loading
            ) : (
              <>
                {t.signInButton}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Register Form */
        <form action={registerAction} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.fullNameLabel}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                person
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder={t.fullNamePlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.emailLabel}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                mail
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                lock
              </span>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3.5 pl-12 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {registerPending ? (
              dict.common.loading
            ) : (
              <>
                {t.signUpButton}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">
            {t.orContinueWith}
          </span>
        </div>
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.google}
          </span>
        </button>
        <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.apple}
          </span>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t.enterpriseText}
          <a
            href="#"
            className="ml-1 font-bold text-primary hover:underline"
          >
            {t.enterpriseLink}
          </a>
        </p>
      </div>
    </div>
  );
}
