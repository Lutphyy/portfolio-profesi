import { useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/profile";
import { Button } from "~/components/ui/Button";
import { Input, Textarea } from "~/components/ui/Input";
import { Card, CardBody } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { getSiteConfig, updateSiteConfigBatch } from "~/services/config.service";
import { uploadImage } from "~/lib/storage.server";
import type { Experience } from "~/models/config.types";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Profile Settings — Admin" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const config = await getSiteConfig(supabase);

  let experiences: Experience[] = [];
  try {
    experiences = JSON.parse(config.about_experiences || "[]");
  } catch {
    experiences = [];
  }

  return { config, experiences };
}

export async function action({ request }: Route.ActionArgs) {
  const { headers } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "save_profile");

  if (intent === "save_profile") {
    const hero_title = String(formData.get("hero_title") ?? "").trim();
    const hero_subtitle = String(formData.get("hero_subtitle") ?? "").trim();
    const about_bio = String(formData.get("about_bio") ?? "").trim();
    const profile_image_url = String(formData.get("profile_image") ?? "").trim();
    const profileFile = formData.get("profile_file") as File | null;

    let profile_image = profile_image_url;

    if (profileFile && profileFile.size > 0) {
      try {
        profile_image = await uploadImage(supabase, "profiles", profileFile);
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Gagal upload foto." };
      }
    }

    try {
      await updateSiteConfigBatch(supabase, {
        hero_title,
        hero_subtitle,
        about_bio,
        profile_image,
      });
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json", ...Object.fromEntries(headers.entries()) } }
      );
    } catch {
      return { success: false, error: "Gagal menyimpan konfigurasi." };
    }
  }

  if (intent === "save_experiences") {
    const experiencesRaw = String(formData.get("experiences_json") ?? "[]");
    try {
      JSON.parse(experiencesRaw); // validate JSON
      await updateSiteConfigBatch(supabase, { about_experiences: experiencesRaw });
      return new Response(
        JSON.stringify({ success: true, tab: "experiences" }),
        { headers: { "Content-Type": "application/json", ...Object.fromEntries(headers.entries()) } }
      );
    } catch {
      return { success: false, error: "Format experience tidak valid." };
    }
  }

  return null;
}

function ExperienceEditor({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  const addExperience = () => {
    setExperiences([...experiences, { role: "", company: "", period: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  return (
    <div className="space-y-4">
      {fetcher.data?.success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          Experiences berhasil disimpan!
        </div>
      )}

      {experiences.map((exp, i) => (
        <Card key={i} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Experience #{i + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => removeExperience(i)}
            >
              Hapus
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Role / Posisi"
              value={exp.role}
              onChange={(e) => updateExperience(i, "role", e.target.value)}
              placeholder="Full-Stack Developer"
            />
            <Input
              label="Company / Organisasi"
              value={exp.company}
              onChange={(e) => updateExperience(i, "company", e.target.value)}
              placeholder="PT Example"
            />
          </div>
          <Input
            label="Periode"
            value={exp.period}
            onChange={(e) => updateExperience(i, "period", e.target.value)}
            placeholder="2023 — Sekarang"
          />
          <Textarea
            label="Deskripsi"
            value={exp.description}
            onChange={(e) => updateExperience(i, "description", e.target.value)}
            placeholder="Jelaskan apa yang kamu kerjakan..."
            rows={3}
          />
        </Card>
      ))}

      <Button type="button" variant="secondary" onClick={addExperience}>
        + Tambah Experience
      </Button>

      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="save_experiences" />
        <input type="hidden" name="experiences_json" value={JSON.stringify(experiences)} />
        <Button type="submit" isLoading={isSubmitting} className="mt-4">
          {isSubmitting ? "Saving..." : "Save Experiences"}
        </Button>
      </fetcher.Form>
    </div>
  );
}

export default function AdminProfile({ loaderData }: Route.ComponentProps) {
  const { config, experiences } = loaderData;
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Update konten yang tampil di halaman publik.
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Informasi Profil</h2>

          {fetcher.data?.success && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
              Konfigurasi berhasil disimpan!
            </div>
          )}
          {fetcher.data?.error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {fetcher.data.error}
            </div>
          )}

          <fetcher.Form method="post" encType="multipart/form-data" className="space-y-5">
            <input type="hidden" name="intent" value="save_profile" />

            <Input
              name="hero_title"
              label="Hero Title"
              defaultValue={config.hero_title}
              placeholder="Full-Stack Developer"
              helperText="Teks utama di hero section homepage"
            />
            <Input
              name="hero_subtitle"
              label="Hero Subtitle"
              defaultValue={config.hero_subtitle}
              placeholder="Crafting scalable web applications..."
            />
            <Textarea
              name="about_bio"
              label="About Bio"
              defaultValue={config.about_bio}
              placeholder="Tulis bio kamu di sini..."
              rows={5}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Profile Image</label>
              {config.profile_image && (
                <div className="mb-3">
                  <img src={config.profile_image} alt="Profile" className="h-24 w-24 rounded-xl border border-white/10 object-cover" loading="lazy" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="profile_image" defaultValue={config.profile_image} placeholder="https://example.com/photo.jpg" helperText="URL foto profil" />
                <div>
                  <input
                    type="file"
                    name="profile_file"
                    accept="image/*"
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-sm file:text-gray-300 hover:file:bg-white/10 file:cursor-pointer file:transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Atau upload foto langsung</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </fetcher.Form>
        </CardBody>
      </Card>

      {/* Experience Editor */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Pengalaman / Experience</h2>
          <p className="text-sm text-gray-400 mb-6">
            Kelola daftar pengalaman yang ditampilkan di halaman About.
          </p>
          <ExperienceEditor initialExperiences={experiences} />
        </CardBody>
      </Card>
    </div>
  );
}
