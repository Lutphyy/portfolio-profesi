import type { Route } from "./+types/home";
import { Navbar } from "~/components/sections/Navbar";
import { HeroSection } from "~/components/sections/HeroSection";
import { ProjectCard } from "~/components/sections/ProjectCard";
import { Footer } from "~/components/sections/Footer";
import { Section } from "~/components/ui/Container";
import { FadeInOnScroll } from "~/components/animations/FadeInOnScroll";
import { InfiniteScroll } from "~/components/animations/InfiniteScroll";
import { Badge } from "~/components/ui/Badge";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getSiteConfig } from "~/services/config.service";
import { getFeaturedProjects } from "~/services/project.service";
import { techStack } from "~/data/techStack";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Home — Luthfi Portfolio" },
    {
      name: "description",
      content:
        "Portfolio profesional Luthfi — full-stack developer. Lihat project dan karya terbaik saya.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const [config, featuredProjects] = await Promise.all([
    getSiteConfig(supabase),
    getFeaturedProjects(supabase),
  ]);
  return { config, featuredProjects };
}

// Client-side cache to speed up navigation
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // Use server data for initial load, then cache it
  return serverLoader();
}
clientLoader.hydrate = true as const;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { config, featuredProjects } = loaderData;

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection config={config} />

      {/* Skills & Expertise */}
      <Section>
        <FadeInOnScroll>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Skills and Expertise
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore some skills I'm proficient in to deliver high-quality solutions.
            </p>
          </div>
        </FadeInOnScroll>

        {/* 4 Main Categories */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
          <FadeInOnScroll delay={0}>
            <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
              {/* Web Development Icon */}
              <div className="flex justify-center">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white leading-tight">Web Dev</h3>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={100}>
            <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
              {/* REST API Icon */}
              <div className="flex justify-center">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white leading-tight">REST API</h3>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200}>
            <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
              {/* Machine Learning Icon */}
              <div className="flex justify-center">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white leading-tight">ML</h3>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={300}>
            <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
              {/* Mobile Development Icon */}
              <div className="flex justify-center">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white leading-tight">Mobile</h3>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Infinite Scroll Tech Stack */}
        <FadeInOnScroll delay={400}>
          <InfiniteScroll
            items={techStack.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex-shrink-0 glass rounded-xl p-4 sm:p-5 hover:bg-white/[0.08] hover:border-white/20 hover:scale-110 transition-all duration-300 cursor-default group"
                style={{ minWidth: '90px' }}
              >
                <span className={`${tech.color} block group-hover:scale-110 transition-transform duration-200`}>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center mx-auto">
                    {tech.icon}
                  </div>
                </span>
              </div>
            ))}
            speed={60}
            direction="left"
            pauseOnHover={true}
          />
        </FadeInOnScroll>
      </Section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <Section className="bg-white/[0.02]">
          <FadeInOnScroll>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Featured Project
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Some of the best projects I've worked on.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <FadeInOnScroll key={project.id} delay={i * 150}>
                <ProjectCard project={project} />
              </FadeInOnScroll>
            ))}
          </div>
        </Section>
      )}

      <Footer />
    </div>
  );
}
