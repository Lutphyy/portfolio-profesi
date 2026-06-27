import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project, ProjectFormData } from "~/models/project.types";

export async function getProjects(supabase: SupabaseClient): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return data ?? [];
}

export async function getFeaturedProjects(
  supabase: SupabaseClient
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(`Failed to fetch featured projects: ${error.message}`);
  return data ?? [];
}

export async function getProjectBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
  return data;
}

export async function createProject(
  supabase: SupabaseClient,
  formData: ProjectFormData
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert(formData)
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return data;
}

export async function updateProject(
  supabase: SupabaseClient,
  id: string,
  formData: Partial<ProjectFormData>
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project: ${error.message}`);
  return data;
}

export async function deleteProject(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete project: ${error.message}`);
}

export async function getProjectCount(
  supabase: SupabaseClient
): Promise<number> {
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(`Failed to count projects: ${error.message}`);
  return count ?? 0;
}
