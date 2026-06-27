import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/projects";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { getProjects, deleteProject } from "~/services/project.service";
import { formatDate } from "~/utils/helpers";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Manage Projects — Admin" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const projects = await getProjects(supabase);
  return { projects };
}

export async function action({ request }: Route.ActionArgs) {
  const { headers } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const id = String(formData.get("id"));
    await deleteProject(supabase, id);
  }

  return new Response(JSON.stringify({ success: true }), { headers });
}

export default function AdminProjects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const fetcher = useFetcher();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all your portfolio projects.</p>
        </div>
        <Link to="/admin/projects/new">
          <Button>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Project
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Featured</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {project.image_url ? (
                          <img src={project.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-white/10" loading="lazy" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10" />
                        )}
                        <p className="text-sm font-medium text-white">{project.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {project.is_featured ? (
                        <Badge variant="success">Featured</Badge>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(project.created_at)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/projects/${project.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={project.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={(e) => {
                              if (!confirm(`Delete project "${project.title}"?`)) e.preventDefault();
                            }}
                          >
                            Delete
                          </Button>
                        </fetcher.Form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No projects yet.</p>
          <Link to="/admin/projects/new">
            <Button>Create First Project</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
