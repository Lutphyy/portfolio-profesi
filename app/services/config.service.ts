import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteConfig, SiteConfigMap } from "~/models/config.types";

/**
 * Fetches all site config rows and returns them as a typed key-value map.
 * Falls back to empty strings for any missing keys.
 */
export async function getSiteConfig(
  supabase: SupabaseClient
): Promise<SiteConfigMap> {
  const { data, error } = await supabase.from("site_config").select("*");

  if (error) throw new Error(`Failed to fetch site config: ${error.message}`);

  const defaults: SiteConfigMap = {
    hero_title: "",
    hero_subtitle: "",
    about_bio: "",
    profile_image: "",
    about_experiences: "[]",
  };

  if (!data) return defaults;

  return data.reduce<SiteConfigMap>((acc, row: SiteConfig) => {
    if (row.key in defaults) {
      acc[row.key as keyof SiteConfigMap] = row.value;
    }
    return acc;
  }, defaults);
}

/**
 * Upserts a single config key-value pair.
 */
export async function updateSiteConfig(
  supabase: SupabaseClient,
  key: string,
  value: string
): Promise<void> {
  const { error } = await supabase
    .from("site_config")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) throw new Error(`Failed to update config "${key}": ${error.message}`);
}

/**
 * Batch update multiple config values at once.
 */
export async function updateSiteConfigBatch(
  supabase: SupabaseClient,
  updates: Partial<SiteConfigMap>
): Promise<void> {
  const entries = Object.entries(updates).filter(
    ([, value]) => value !== undefined
  );

  const promises = entries.map(([key, value]) =>
    updateSiteConfig(supabase, key, value as string)
  );

  await Promise.all(promises);
}
