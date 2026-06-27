import type { Route } from "./+types/about";
import { Navbar } from "~/components/sections/Navbar";
import { Footer } from "~/components/sections/Footer";
import { Section } from "~/components/ui/Container";
import { FadeInOnScroll } from "~/components/animations/FadeInOnScroll";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getSiteConfig } from "~/services/config.service";
import type { Experience } from "~/models/config.types";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "About — Luthfi Portfolio" },
    {
      name: "description",
      content: "Tentang Luthfi — seorang developer yang bersemangat membangun produk digital.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const config = await getSiteConfig(supabase);

  let experiences: Experience[] = [];
  try {
    experiences = JSON.parse(config.about_experiences || "[]");
  } catch {
    experiences = [];
  }

  return { 
    config, 
    experiences,
    ENV: {
      GITHUB_URL: process.env.GITHUB_URL ?? "https://github.com",
      LINKEDIN_URL: process.env.LINKEDIN_URL ?? "https://linkedin.com",
      EMAIL: process.env.EMAIL ?? "hello@example.com",
    }
  };
}

// Client-side cache to speed up navigation
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return serverLoader();
}
clientLoader.hydrate = true as const;

export default function About({ loaderData }: Route.ComponentProps) {
  const { config, experiences, ENV } = loaderData;
  const bio =
    config.about_bio ||
    "Saya adalah seorang developer yang fokus pada pembangunan aplikasi web dan mobile modern.";

  return (
    <div className="min-h-screen">
      <Navbar />

      <Section className="pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left — Profile */}
          <div className="lg:col-span-2">
            <FadeInOnScroll>
              <div className="sticky top-24 space-y-6">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto lg:mx-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-30" />
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 w-full h-full">
                    {config.profile_image ? (
                      <img src={config.profile_image} alt="Profile" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                        <svg className="h-20 w-20 text-indigo-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center lg:text-left space-y-4">
                  <h1 className="text-2xl font-bold text-white">
                    Luthfi Hesya Pratama
                  </h1>
                  <p className="text-indigo-400 text-sm font-medium">
                    {config.hero_title || "Developer"}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex flex-col gap-3 pt-2">
                    <a
                      href={ENV.GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm break-all">{ENV.GITHUB_URL.replace('https://', '')}</span>
                    </a>
                    <a
                      href={ENV.LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-xs sm:text-sm break-all">{ENV.LINKEDIN_URL.replace('https://', '').replace('www.', '')}</span>
                    </a>
                    <a
                      href={`mailto:${ENV.EMAIL}?subject=Hello%20from%20Portfolio&body=Hi%20Luthfi,%0D%0A%0D%0A`}
                      className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm break-all">{ENV.EMAIL}</span>
                    </a>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Right — Content */}
          <div className="lg:col-span-3 space-y-12">
            <FadeInOnScroll delay={100}>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">About Me</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{bio}</p>
              </div>
            </FadeInOnScroll>

            {/* Experience — loaded from admin config */}
            {experiences.length > 0 && (
              <FadeInOnScroll delay={200}>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Experience</h2>
                  <div className="space-y-1">
                    {experiences.map((exp, i) => (
                      <div key={i} className="relative pl-6 pb-8 last:pb-0 border-l border-white/10">
                        <div className="absolute left-0 top-1 -translate-x-1/2 h-3 w-3 rounded-full bg-indigo-500 border-2 border-gray-950" />
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-indigo-400">{exp.company}</span>
                          </div>
                          <p className="text-xs text-gray-500">{exp.period}</p>
                          <p className="text-sm text-gray-400 leading-relaxed">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            )}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
