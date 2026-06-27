import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, MessageFormData } from "~/models/message.types";

export async function sendMessage(
  supabase: SupabaseClient,
  formData: MessageFormData
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ ...formData, is_read: false })
    .select()
    .single();

  if (error) throw new Error(`Failed to send message: ${error.message}`);
  return data;
}

export async function getMessages(
  supabase: SupabaseClient,
  limit?: number
): Promise<Message[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return data ?? [];
}

export async function getUnreadMessages(
  supabase: SupabaseClient,
  limit?: number
): Promise<Message[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch unread messages: ${error.message}`);
  return data ?? [];
}

export async function markMessageAsRead(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw new Error(`Failed to mark message as read: ${error.message}`);
}

export async function getUnreadCount(
  supabase: SupabaseClient
): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw new Error(`Failed to count unread messages: ${error.message}`);
  return count ?? 0;
}

export async function deleteMessage(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete message: ${error.message}`);
}
