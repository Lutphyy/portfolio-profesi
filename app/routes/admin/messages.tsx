import { useFetcher } from "react-router";
import type { Route } from "./+types/messages";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { requireAuth } from "~/lib/auth.server";
import {
  getMessages,
  markMessageAsRead,
  deleteMessage,
} from "~/services/message.service";
import { formatDate, timeAgo } from "~/utils/helpers";
import type { Message } from "~/models/message.types";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Messages — Admin" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const messages = await getMessages(supabase);
  return { messages };
}

export async function action({ request }: Route.ActionArgs) {
  const { headers } = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = String(formData.get("id"));

  if (intent === "read") {
    await markMessageAsRead(supabase, id);
  } else if (intent === "delete") {
    await deleteMessage(supabase, id);
  }

  return new Response(JSON.stringify({ success: true }), { headers });
}

export default function AdminMessages({ loaderData }: Route.ComponentProps) {
  const { messages } = loaderData;
  const fetcher = useFetcher();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">
          Pesan dari pengunjung portfolio kamu.
        </p>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg: Message) => (
            <Card
              key={msg.id}
              className={msg.is_read ? "opacity-60" : ""}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">
                        {msg.name}
                      </h3>
                      {!msg.is_read && <Badge variant="primary">New</Badge>}
                      <span className="text-xs text-gray-600">
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-400">{msg.email}</p>
                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 flex-shrink-0">
                    {!msg.is_read && (
                      <fetcher.Form method="post">
                        <input type="hidden" name="intent" value="read" />
                        <input type="hidden" name="id" value={msg.id} />
                        <Button variant="ghost" size="sm" type="submit">
                          Mark Read
                        </Button>
                      </fetcher.Form>
                    )}
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={msg.id} />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={(e) => {
                          if (!confirm("Hapus pesan ini?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </fetcher.Form>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Belum ada pesan.</p>
        </Card>
      )}
    </div>
  );
}
