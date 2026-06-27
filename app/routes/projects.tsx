import type { Route } from "./+types/projects";
import { Navbar } from "~/components/sections/Navbar";
import { Footer } from "~/components/sections/Footer";
import { ProjectCard } from "~/components/sections/ProjectCard";
import { Section } from "~/components/ui/Container";
import { FadeInOnScroll } from "~/components/animations/FadeInOnScroll";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getProjects } from "~/services/project.service";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Projects — Luthfi Portfolio" },
    {
      name: "description",
      content: "Koleksi project yang telah saya kerjakan.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const projects = await getProjects(supabase);
  return { projects };
}

// Client-side cache to speed up navigation
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return serverLoader();
}
clientLoader.hydrate = true as const;

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <div className="min-h-screen">
      <Navbar />

      <Section className="pt-32">
        <FadeInOnScroll>
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              All Projects
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Explore all the projects I've worked on.
            </p>
          </div>
        </FadeInOnScroll>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <FadeInOnScroll key={project.id} delay={i * 100}>
                <ProjectCard project={project} />
              </FadeInOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No projects yet.</p>
          </div>
        )}
      </Section>

      <Footer />
    </div>
  );
}
