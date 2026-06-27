import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("about", "routes/about.tsx"),
  route("login", "routes/login.tsx"),

  // Admin routes — protected by auth guard in layout loader
  layout("routes/admin/layout.tsx", [
    route("admin", "routes/admin/dashboard.tsx"),
    route("admin/projects", "routes/admin/projects.tsx"),
    route("admin/projects/new", "routes/admin/projects.new.tsx"),
    route("admin/projects/:id/edit", "routes/admin/projects.$id.edit.tsx"),
    route("admin/messages", "routes/admin/messages.tsx"),
    route("admin/profile", "routes/admin/profile.tsx"),
  ]),
] satisfies RouteConfig;
