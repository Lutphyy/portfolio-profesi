export interface SiteConfig {
  id: string;
  key: string;
  value: string;
}

export type SiteConfigKey =
  | "hero_title"
  | "hero_subtitle"
  | "about_bio"
  | "profile_image"
  | "about_experiences";

export interface SiteConfigMap {
  hero_title: string;
  hero_subtitle: string;
  about_bio: string;
  profile_image: string;
  about_experiences: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}
