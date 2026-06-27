export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string; // Legacy - kept for backward compatibility
  images: string[]; // New - multiple images support
  tech_stack: string[];
  live_url: string;
  github_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  image_url: string; // Legacy - kept for backward compatibility
  images: string[]; // New - multiple images support
  tech_stack: string[];
  live_url: string;
  github_url: string;
  is_featured: boolean;
}
