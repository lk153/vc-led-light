import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Login & Registration" };

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Redirect to account if already logged in
  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/account`);
  }

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
        <LoginForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
