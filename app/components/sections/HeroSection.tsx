import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Section } from "~/components/ui/Container";
import { SplashCursor } from "~/components/animations/SplashCursor";
import type { SiteConfigMap } from "~/models/config.types";

interface HeroSectionProps {
  config: SiteConfigMap;
}

export function HeroSection({ config }: HeroSectionProps) {
  const title = config.hero_title || "Full-Stack Developer";
  const subtitle =
    config.hero_subtitle ||
    "Create ideas and solutions to problems, with modern technology.";
  
  // Get email from root loader via useRouteLoaderData
  const rootData = typeof window !== 'undefined' 
    ? (window as any).__remixContext?.loaderData?.root
    : null;
  const email = rootData?.ENV?.EMAIL ?? "luthfihesyapratama@gmail.com";

  return (
    <Section className="relative overflow-hidden pt-32 sm:pt-40">
      {/* Splash Cursor Animation - Behind everything, only active in hero */}
      <div className="absolute inset-0 z-0">
        <SplashCursor RAINBOW_MODE={true} maxHeight={800} />
      </div>
      
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      <div className="relative text-center max-w-3xl mx-auto space-y-8">
        {/* Glowing Badge with Pulse Animation */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="text-sm font-medium text-indigo-300 animate-glow">
            Available for work
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          Hi, I'm a{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/projects" prefetch="intent">
            <Button size="lg">
              View Projects
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </Link>
          <a href={`mailto:${email}?subject=Hello%20from%20Portfolio&body=Hi%20Luthfi,%0D%0A%0D%0A`}>
            <Button variant="secondary" size="lg">
              Contact Me
            </Button>
          </a>
        </div>
      </div>
    </Section>
  );
}
