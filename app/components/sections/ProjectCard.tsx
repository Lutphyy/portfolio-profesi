import { Link } from "react-router";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import type { Project } from "~/models/project.types";
import { truncate } from "~/utils/helpers";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Use images array if available, fallback to single image_url
  const thumbnailImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : project.image_url;

  return (
    <Card hover>
      <Link
        to={`/projects/${project.slug}`}
        prefetch="intent"
        className="block group"
        aria-label={`View project: ${project.title}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl aspect-video">
          {thumbnailImage ? (
            <>
              <img
                src={thumbnailImage}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Image count badge */}
              {project.images && project.images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs text-white font-medium flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {project.images.length}
                </div>
              )}
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-indigo-400/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed">
            {truncate(project.description.replace(/[#*`_\[\]]/g, ""), 120)}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
            {project.tech_stack.length > 4 && (
              <Badge variant="default">+{project.tech_stack.length - 4}</Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
