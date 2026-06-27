import { redirect, useNavigate } from "react-router";
import type { Route } from "./+types/projects.new";
import { Button } from "~/components/ui/Button";
import { Input, Textarea } from "~/components/ui/Input";
import { Card, CardBody } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { createProject } from "~/services/project.service";
import { uploadMultipleImages } from "~/lib/storage.server";
import { slugify } from "~/utils/helpers";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Add Project — Admin" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { headers } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const techStackRaw = String(formData.get("tech_stack") ?? "").trim();
  const github_url = String(formData.get("github_url") ?? "").trim();
  const live_url = String(formData.get("live_url") ?? "").trim();
  const is_featured = formData.get("is_featured") === "on";

  const tech_stack = techStackRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) {
    return { error: "Title wajib diisi." };
  }

  let images: string[] = [];
  let image_url = ""; // Legacy field

  // Get all uploaded image files
  const imageFiles = formData.getAll("image_files") as File[];
  const validFiles = imageFiles.filter((file) => file && file.size > 0);

  // Upload multiple images if provided
  if (validFiles.length > 0) {
    try {
      images = await uploadMultipleImages(supabase, "projects", validFiles);
      image_url = images[0] || ""; // Set first image as primary for backward compatibility
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to upload images." };
    }
  }

  try {
    await createProject(supabase, {
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
      error: err instanceof Error ? err.message : "Failed to create project.",
    };
  }
}

export default function NewProject({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Add Project</h1>
        <p className="text-gray-400 text-sm mt-1">
          Add a new project to your portfolio.
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
            <Input
              name="title"
              label="Title"
              placeholder="My Awesome Project"
              required
            />

            <Textarea
              name="description"
              label="Description (Markdown)"
              placeholder="## Overview&#10;&#10;Deskripsi project kamu..."
              rows={8}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Project Images (Multiple)
              </label>
              <div>
                <input
                  type="file"
                  name="image_files"
                  accept="image/*"
                  multiple
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-sm file:text-gray-300 hover:file:bg-white/10 file:cursor-pointer file:transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Upload multiple gambar untuk gallery project (max 10MB per file)</p>
              </div>
            </div>

            <Input
              name="tech_stack"
              label="Tech Stack"
              placeholder="React, TypeScript, Supabase"
              helperText="Pisahkan dengan koma"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                name="github_url"
                label="GitHub URL"
                placeholder="https://github.com/user/repo"
                type="url"
              />
              <Input
                name="live_url"
                label="Live URL (Opsional)"
                placeholder="https://myproject.com"
                type="url"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-gray-900"
              />
              <span className="text-sm text-gray-300">Display on Homepage (Featured)</span>
            </label>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <Button type="submit">Create Project</Button>
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
