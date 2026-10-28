import { Link, redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { Card, CardBody } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import { getProjectCount } from "~/services/project.service";
import { getUnreadCount, getUnreadMessages } from "~/services/message.service";
import { timeAgo } from "~/utils/helpers";
import type { Message } from "~/models/message.types";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Dashboard — Admin" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  const [projectCount, unreadCount, recentMessages] = await Promise.all([
    getProjectCount(supabase),
    getUnreadCount(supabase),
    getUnreadMessages(supabase, 5),
  ]);

  return { projectCount, unreadCount, recentMessages };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.signOut();
    
    // Force clear all auth cookies
    const responseHeaders = new Headers(headers);
    responseHeaders.append('Set-Cookie', 'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    responseHeaders.append('Set-Cookie', 'sb-refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    
    return redirect("/login", { headers: responseHeaders });
  }

  return null;
}

interface StatCardProps {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, href, icon, accent }: StatCardProps) {
  return (
    <Link to={href}>
      <Card hover className="p-5">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
          <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { projectCount, unreadCount, recentMessages } = loaderData;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview portfolio kamu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Projects"
          value={projectCount}
          href="/admin/projects"
          accent="bg-indigo-500/15 text-indigo-400"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          }
        />
        <StatCard
          label="Unread Messages"
          value={unreadCount}
          href="/admin/messages"
          accent="bg-emerald-500/15 text-emerald-400"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />
      </div>

      {/* Recent Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Pesan Terbaru
          </h2>
          <Link
            to="/admin/messages"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Lihat semua →
          </Link>
        </div>

        {recentMessages.length > 0 ? (
          <div className="space-y-3">
            {recentMessages.map((msg: Message) => (
              <Card key={msg.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {msg.name}
                      </p>
                      <Badge variant="primary">New</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{msg.email}</p>
                    <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-sm">Belum ada pesan baru.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
