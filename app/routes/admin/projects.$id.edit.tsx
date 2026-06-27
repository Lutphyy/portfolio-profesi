import { redirect, useNavigate, data } from "react-router";
import type { Route } from "./+types/projects.$id.edit";
import { Button } from "~/components/ui/Button";
import { Input, Textarea } from "~/components/ui/Input";
import { Card, CardBody } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { updateProject } from "~/services/project.service";
import { uploadMultipleImages } from "~/lib/storage.server";
import { slugify } from "~/utils/helpers";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.project
        ? `Edit: ${loaderData.project.title} — Admin`
        : "Edit Project — Admin",
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !project) {
    throw data(null, { status: 404, statusText: "Project tidak ditemukan" });
  }

  return { project };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { headers } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const techStackRaw = String(formData.get("tech_stack") ?? "").trim();
  const github_url = String(formData.get("github_url") ?? "").trim();
  const live_url = String(formData.get("live_url") ?? "").trim();
  const is_featured = formData.get("is_featured") === "on";
  const keepExistingImages = formData.get("keep_images") === "on";

  const tech_stack = techStackRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) {
    return { error: "Title wajib diisi." };
  }

  // Fetch existing project to get current images
  const { data: existingProject } = await supabase
    .from("projects")
    .select("images, image_url")
    .eq("id", params.id)
    .single();

  let images: string[] = keepExistingImages && existingProject?.images ? existingProject.images : [];
  let image_url = existingProject?.image_url || "";

  // Get all uploaded image files
  const imageFiles = formData.getAll("image_files") as File[];
  const validFiles = imageFiles.filter((file) => file && file.size > 0);

  // Upload new images if provided
  if (validFiles.length > 0) {
    try {
      const newImages = await uploadMultipleImages(supabase, "projects", validFiles);
      images = keepExistingImages ? [...images, ...newImages] : newImages;
      image_url = images[0] || ""; // Set first image as primary
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to upload images." };
    }
  }

  try {
    await updateProject(supabase, params.id, {
      title,
      slug: slugify(title),
      description,
      image_url,
      images,
      tech_stack,
      live_url,
      github_url,
      is_featured,
    });
    return redirect("/admin/projects", { headers });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update project.",
    };
  }
}

export default function EditProject({ loaderData, actionData }: Route.ComponentProps) {
  const { project } = loaderData;
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Project</h1>
        <p className="text-gray-400 text-sm mt-1">
          Update detail project &ldquo;{project.title}&rdquo;.
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {actionData?.error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {actionData.error}
            </div>
          )}

          <form method="post" encType="multipart/form-data" className="space-y-5">
            <Input name="title" label="Title" defaultValue={project.title} required />

            <Textarea
              name="description"
              label="Description (Markdown)"
              defaultValue={project.description}
              rows={8}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Project Images
              </label>
              {project.images && project.images.length > 0 ? (
                <div className="mb-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {project.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="h-24 w-full rounded-lg border border-white/10 object-cover" loading="lazy" />
                    ))}
                  </div>
                </div>
              ) : project.image_url ? (
                <div className="mb-3">
                  <img src={project.image_url} alt="" className="h-32 rounded-lg border border-white/10 object-cover" loading="lazy" />
                </div>
              ) : null}
              <div>
                <input
                  type="file"
                  name="image_files"
                  accept="image/*"
                  multiple
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-sm file:text-gray-300 hover:file:bg-white/10 file:cursor-pointer file:transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Upload gambar baru (multiple)</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  name="keep_images"
                  defaultChecked={true}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500"
                />
                <span className="text-xs text-gray-400">Keep old images (add to new ones)</span>
              </label>
            </div>

            <Input
              name="tech_stack"
              label="Tech Stack"
              defaultValue={project.tech_stack.join(", ")}
              helperText="Pisahkan dengan koma"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input name="github_url" label="GitHub URL" defaultValue={project.github_url} type="url" />
              <Input name="live_url" label="Live URL (Opsional)" defaultValue={project.live_url} type="url" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={project.is_featured}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-gray-900"
              />
              <span className="text-sm text-gray-300">Tampilkan di Homepage (Featured)</span>
            </label>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <Button type="submit">Update Project</Button>
              <Button type="button" variant="ghost" onClick={() => navigate("/admin/projects")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
