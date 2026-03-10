import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Login & Registration" };

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col lg:flex-row">
      {/* Left: Atmospheric Image */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center bg-background-dark">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdTyw7AwChq8obJCMo6Q2RD6Uly1JyhJwKfJl0J6b_xQ-VSOkLJwnMDxXzvUj2S-L9MwVb2CMZ73v-y36iCdUFiOIrXNFIuSbYa50IWjB5l9YFrs3XoEsMxaH2V9sB7yo5T10XBjODcByPiwQDoYFwlunM4YNHLLO_2qUA_gJgseOybqp04sHtF-p-ZrzsDuWhhlOIJnig9Zk08KXApX93oGhJVneYQ6o6DD_2x7iaQgdc-jfHkq0jlYGPasvN8ci5zlESdMy07lKV")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent" />
        <div className="relative z-10 max-w-2xl p-12">
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-primary">
              lightbulb
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {dict.common.siteName}
            </h1>
          </div>
          <h2 className="mb-6 text-5xl font-extrabold leading-tight text-white">
            {dict.login.brandTagline}
          </h2>
          <p className="max-w-md text-lg font-medium text-slate-300">
            {dict.login.brandDescription}
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {dict.login.welcomeTitle}
            </h1>
            <p className="mt-2 text-slate-500">
              {dict.login.welcomeSubtitle}
            </p>
          </div>

          {/* Toggle */}
          <div className="mb-8 flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 p-1">
            <button className="flex h-full grow items-center justify-center rounded-lg bg-white px-2 text-sm font-semibold text-primary shadow-sm">
              {dict.login.loginTab}
            </button>
            <button className="flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold text-slate-500">
              {dict.login.signUpTab}
            </button>
          </div>

          <form className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                {dict.login.emailLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
                <input
                  type="email"
                  placeholder={dict.login.emailPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  {dict.login.passwordLabel}
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">
                  {dict.login.forgotPassword}
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-sm text-slate-500">
                {dict.login.keepLoggedIn}
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              {dict.login.signInButton}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                {dict.login.orContinueWith}
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors">
              <span className="text-sm font-semibold text-slate-700">
                {dict.login.google}
              </span>
            </button>
            <button className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition-colors">
              <span className="text-sm font-semibold text-slate-700">
                {dict.login.apple}
              </span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              {dict.login.enterpriseText}
              <a href="#" className="ml-1 font-bold text-primary hover:underline">
                {dict.login.enterpriseLink}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
