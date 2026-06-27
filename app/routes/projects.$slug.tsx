import { useState } from "react";
import Markdown from "react-markdown";
import { data } from "react-router";
import type { Route } from "./+types/projects.$slug";
import { Navbar } from "~/components/sections/Navbar";
import { Footer } from "~/components/sections/Footer";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { FadeInOnScroll } from "~/components/animations/FadeInOnScroll";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getProjectBySlug } from "~/services/project.service";
import { formatDate } from "~/utils/helpers";

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.project) {
    return [{ title: "Project Not Found — Luthfi Portfolio" }];
  }
  return [
    { title: `${loaderData.project.title} — Luthfi Portfolio` },
    {
      name: "description",
      content: loaderData.project.description.slice(0, 160),
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const project = await getProjectBySlug(supabase, params.slug);

  if (!project) {
    throw data(null, { status: 404, statusText: "Project tidak ditemukan" });
  }

  return { project };
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Use images array if available, fallback to single image_url
  const projectImages = project.images && project.images.length > 0 
    ? project.images 
    : project.image_url 
    ? [project.image_url] 
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-28 pb-20">
        <Container>
          <FadeInOnScroll>
            <div className="max-w-3xl mx-auto space-y-6 mb-12">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-500">
                  {formatDate(project.created_at)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </Button>
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      Source Code
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </FadeInOnScroll>

          {projectImages.length > 0 && (
            <FadeInOnScroll delay={150}>
              <div className="max-w-4xl mx-auto mb-12 space-y-4">
                {/* Main Image */}
                <div 
                  className="rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img 
                    src={projectImages[selectedImage]} 
                    alt={`${project.title} - Image ${selectedImage + 1}`}
                    className="w-full h-auto" 
                    loading="lazy" 
                  />
                </div>

                {/* Thumbnail Gallery */}
                {projectImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {projectImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                          selectedImage === idx 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50' 
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-20 object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FadeInOnScroll>
          )}

          {/* Lightbox */}
          {lightboxOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl leading-none"
                onClick={() => setLightboxOpen(false)}
              >
                &times;
              </button>
              
              {projectImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 text-white/70 hover:text-white text-4xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
                    }}
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-4 text-white/70 hover:text-white text-4xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1));
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              <img 
                src={projectImages[selectedImage]} 
                alt={project.title}
                className="max-h-[90vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {selectedImage + 1} / {projectImages.length}
              </div>
            </div>
          )}

          <FadeInOnScroll delay={200}>
            <article className="max-w-3xl mx-auto prose prose-invert prose-indigo prose-headings:text-white prose-p:text-gray-300 prose-a:text-indigo-400 prose-strong:text-white prose-code:text-indigo-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
              <Markdown>{project.description}</Markdown>
            </article>
          </FadeInOnScroll>
        </Container>
      </div>

      <Footer />
    </div>
  );
}
