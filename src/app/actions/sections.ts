// src/app/actions/sections.ts
// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE — "special chat sections" (broadcast groups) for the Jan Seva Kendra
// site. Place this file at src/app/actions/sections.ts. No changes are needed
// in src/app/actions/admin.ts or src/app/actions/requests.ts.
//
// WHAT IT DOES
// - Admin creates a section (title + description), then picks students from
//   the website user list (multi-select). After creation the admin can still
//   add students from the website list, register a student manually by email
//   and/or mobile (at least one is mandatory), and deregister (remove) any
//   member.
// - Admin broadcasts a message to a section; every registered student sees
//   it in their dashboard (Sections modal). A student can leave a section.
// - A member registered only by email/mobile (no website account yet) is
//   matched automatically once they register with that same email/mobile:
//   getMySectionsAction matches by user_id OR email OR mobile.
//
// TABLES (run broadcast-sections-schema.sql in the Supabase SQL editor first):
// - broadcast_sections (id, title, description, created_by, created_at)
// - broadcast_members  (id, section_id, user_id, name, email, mobile, created_at)
// - broadcast_messages (id, section_id, sender_id, sender_name, content, created_at)
//
// AUTH: section management and broadcasting are co_admin + main_admin
// (requireCOAdmin, same as the post/gallery upload actions). Reading and
// leaving are any logged-in user, but only for sections they belong to.
// All queries go through supabaseAdmin, like the rest of the actions.
//
// DELIVERY: after a successful broadcast the admin client emits
// "broadcast_message" and "trigger_queue_refresh" on the socket (see
// SectionsPanel). The student dashboard refetches its sections on both
// events and on every open of the Sections modal, so a broadcast is never
// lost even if the socket server does not relay the custom event.
//
// v2 (2026-11-10): broadcasts can also carry an image/file/document
// (uploadBroadcastFileAction -> file_url/file_name/file_size/file_type on the
// message; requires a PUBLIC Supabase Storage bucket named "broadcasts").
// Students can react to messages (toggleReactionAction, one reaction per
// user per message, WhatsApp-style); reactions ride along on the message
// payloads (grouped by emoji, with the users who reacted).
// ─────────────────────────────────────────────────────────────────────────────
"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ─── Auth helpers (same pattern as src/app/actions/admin.ts) ───
async function getAuthUser() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}

async function requireCOAdmin() {
  const cookie = await cookies();
  const token = cookie.get("csc_token")?.value;
  if (!token) throw new Error("Unauthorized - No token");
  const user = await getUserFromToken(token);
  if (!user || user.role === "user") {
    throw new Error("Forbidden - Co-Admin access required");
  }
  return user;
}

// ─── Types ───
export interface SectionMember {
  id: string;
  section_id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  created_at: string;
  displayName: string;
}

export interface SectionSummary {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  memberCount: number;
  messageCount: number;
  lastMessage: { content: string; created_at: string; sender_name: string | null } | null;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  users: { user_id: string | null; user_name: string }[];
  reactedByMe: boolean;
}

export interface BroadcastMessage {
  id: string;
  section_id: string;
  sender_id: string | null;
  sender_name: string | null;
  content: string;
  file_url: string | null;
  file_name: string | null;
  file_size: string | null;
  file_type: string | null;
  created_at: string;
  reactions?: ReactionGroup[];
}

type DbSection = { id: string; title: string; description: string | null; created_at: string };
type DbMember = { id: string; section_id: string; user_id: string | null; name: string | null; email: string | null; mobile: string | null; created_at: string };
type DbMessage = { id: string; section_id: string; sender_id: string | null; sender_name: string | null; content: string; file_url: string | null; file_name: string | null; file_size: string | null; file_type: string | null; created_at: string };
type DbReaction = { id: string; message_id: string; user_id: string | null; user_name: string; emoji: string; created_at: string };
type DbUser = { id: string; name: string | null; email: string | null; mobile: string };

function toMember(m: DbMember, usersById: Map<string, DbUser>): SectionMember {
  const u = m.user_id ? usersById.get(m.user_id) : undefined;
  const name = m.name || u?.name || null;
  const email = m.email || u?.email || null;
  const mobile = m.mobile || u?.mobile || null;
  return { ...m, displayName: name || email || mobile || "Student" };
}

// Summaries (member/message counts + last message) for a set of sections.
async function buildSummaries(sections: DbSection[]): Promise<SectionSummary[]> {
  if (!sections.length) return [];
  const ids = sections.map((s) => s.id);
  const [membersRes, messagesRes] = await Promise.all([
    supabaseAdmin.from("broadcast_members").select("section_id").in("section_id", ids),
    supabaseAdmin.from("broadcast_messages").select("section_id, content, created_at, sender_name").in("section_id", ids).order("created_at", { ascending: false }),
  ]);
  const members = (membersRes.data || []) as { section_id: string }[];
  const messages = (messagesRes.data || []) as { section_id: string; content: string; created_at: string; sender_name: string | null }[];
  return sections.map((s) => {
    const last = messages.find((m) => m.section_id === s.id) || null;
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      created_at: s.created_at,
      memberCount: members.filter((m) => m.section_id === s.id).length,
      messageCount: messages.filter((m) => m.section_id === s.id).length,
      lastMessage: last ? { content: last.content, created_at: last.created_at, sender_name: last.sender_name } : null,
    };
  });
}

// Group raw reaction rows by emoji (WhatsApp-style chips + who-reacted lists).
function groupReactions(reactions: DbReaction[], meUserId?: string | null): ReactionGroup[] {
  const byEmoji = new Map<string, DbReaction[]>();
  reactions.forEach((r) => {
    const list = byEmoji.get(r.emoji) || [];
    list.push(r);
    byEmoji.set(r.emoji, list);
  });
  return [...byEmoji.entries()].map(([emoji, list]) => ({
    emoji,
    count: list.length,
    users: list.map((r) => ({ user_id: r.user_id, user_name: r.user_name })),
    reactedByMe: !!meUserId && list.some((r) => r.user_id === meUserId),
  }));
}

// Attach grouped reactions to a list of messages.
async function attachReactions(messages: DbMessage[], meUserId?: string | null) {
  if (!messages.length) return [];
  const ids = messages.map((m) => m.id);
  const { data, error } = await supabaseAdmin.from("broadcast_reactions").select("*").in("message_id", ids).order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const reactions = (data || []) as DbReaction[];
  return messages.map((m) => ({ ...m, reactions: groupReactions(reactions.filter((r) => r.message_id === m.id), meUserId) }) as BroadcastMessage);
}

// The logged-in user's identity for member matching (id + email + mobile).
async function getMyIdentity() {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  const userId = (user as any).sub || (user as any).id;
  if (!userId) throw new Error("Unauthorized");
  const { data } = await supabaseAdmin.from("users").select("id, name, email, mobile").eq("id", userId).single();
  const row = (data || {}) as Partial<DbUser>;
  return { userId: userId as string, email: row.email || (user as any).email || null, mobile: row.mobile || (user as any).mobile || null };
}

// All member rows in a section that belong to the given identity.
async function getMyMemberRows(sectionId: string, me: { userId: string; email: string | null; mobile: string | null }) {
  const ors: string[] = [`user_id.eq.${me.userId}`];
  if (me.email) ors.push(`email.eq.${me.email}`);
  if (me.mobile) ors.push(`mobile.eq.${me.mobile}`);
  const { data, error } = await supabaseAdmin.from("broadcast_members").select("*").eq("section_id", sectionId).or(ors.join(","));
  if (error) throw new Error(error.message);
  return (data || []) as DbMember[];
}

// ─── ADMIN: create a section (details first, students picked second) ───
export async function createSectionAction(input: { title: string; description?: string; memberIds?: string[] }) {
  const admin = await requireCOAdmin();
  const title = (input.title || "").trim();
  if (!title) throw new Error("Section title is required");
  const { data: section, error } = await supabaseAdmin
    .from("broadcast_sections")
    .insert([{ title, description: (input.description || "").trim() || null, created_by: admin.sub }])
    .select()
    .single();
  if (error) throw new Error(error.message);

  const memberIds = [...new Set(input.memberIds || [])];
  if (memberIds.length) {
    const { data: users } = await supabaseAdmin.from("users").select("id, name, email, mobile").in("id", memberIds);
    const rows = ((users || []) as DbUser[]).map((u) => ({
      section_id: section.id, user_id: u.id, name: u.name, email: u.email, mobile: u.mobile,
    }));
    if (rows.length) {
      const { error: mErr } = await supabaseAdmin.from("broadcast_members").insert(rows);
      if (mErr) throw new Error(mErr.message);
    }
  }
  return section as DbSection;
}

// ─── ADMIN: all sections with counts (newest first) ───
export async function getSectionsAction(): Promise<SectionSummary[]> {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin.from("broadcast_sections").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return buildSummaries((data || []) as DbSection[]);
}

// ─── ADMIN: one section with members + message history ───
export async function getSectionDetailAction(sectionId: string) {
  const admin = await requireCOAdmin();
  const [{ data: section, error: sErr }, { data: members, error: mErr }, { data: messages, error: gErr }] = await Promise.all([
    supabaseAdmin.from("broadcast_sections").select("*").eq("id", sectionId).single(),
    supabaseAdmin.from("broadcast_members").select("*").eq("section_id", sectionId).order("created_at", { ascending: true }),
    supabaseAdmin.from("broadcast_messages").select("*").eq("section_id", sectionId).order("created_at", { ascending: true }).limit(100),
  ]);
  if (sErr) throw new Error(sErr.message);
  if (mErr) throw new Error(mErr.message);
  if (gErr) throw new Error(gErr.message);
  const memberRows = (members || []) as DbMember[];
  const userIds = [...new Set(memberRows.map((m) => m.user_id).filter(Boolean) as string[])];
  const usersById = new Map<string, DbUser>();
  if (userIds.length) {
    const { data: users } = await supabaseAdmin.from("users").select("id, name, email, mobile").in("id", userIds);
    ((users || []) as DbUser[]).forEach((u) => usersById.set(u.id, u));
  }
  return {
    section: section as DbSection,
    members: memberRows.map((m) => toMember(m, usersById)),
    messages: await attachReactions((messages || []) as DbMessage[], admin.sub),
  };
}

// ─── ADMIN: every student registered on the website (for multi-select) ───
export async function getAllStudentsAction() {
  await requireCOAdmin();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, mobile")
    .eq("role", "user")
    .order("name", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data || []) as DbUser[];
}

// ─── ADMIN: add website students to a section (multi-select) ───
export async function addMembersAction(sectionId: string, userIds: string[]) {
  await requireCOAdmin();
  const ids = [...new Set(userIds || [])];
  if (!ids.length) return { added: 0 };
  const { data: existing } = await supabaseAdmin.from("broadcast_members").select("user_id").eq("section_id", sectionId);
  const existingIds = new Set(((existing || []) as { user_id: string | null }[]).map((m) => m.user_id));
  const freshIds = ids.filter((id) => !existingIds.has(id));
  if (!freshIds.length) return { added: 0 };
  const { data: users } = await supabaseAdmin.from("users").select("id, name, email, mobile").in("id", freshIds);
  const rows = ((users || []) as DbUser[]).map((u) => ({
    section_id: sectionId, user_id: u.id, name: u.name, email: u.email, mobile: u.mobile,
  }));
  if (!rows.length) return { added: 0 };
  const { error } = await supabaseAdmin.from("broadcast_members").insert(rows);
  if (error) throw new Error(error.message);
  return { added: rows.length };
}

// ─── ADMIN: register one student manually by email and/or mobile ───
// At least one of email / mobile is mandatory. If the email or mobile
// matches a website user, the member is linked to that account.
export async function registerMemberAction(sectionId: string, input: { name?: string; email?: string; mobile?: string }) {
  await requireCOAdmin();
  const name = (input.name || "").trim() || null;
  const email = (input.email || "").trim() || null;
  const mobile = (input.mobile || "").trim() || null;
  if (!email && !mobile) throw new Error("Email or mobile is required (at least one)");

  // Link to a website account when the contact matches one.
  let linked: DbUser | null = null;
  if (email) {
    const { data } = await supabaseAdmin.from("users").select("id, name, email, mobile").eq("email", email).limit(1);
    linked = ((data || []) as DbUser[])[0] || null;
  }
  if (!linked && mobile) {
    const { data } = await supabaseAdmin.from("users").select("id, name, email, mobile").eq("mobile", mobile).limit(1);
    linked = ((data || []) as DbUser[])[0] || null;
  }

  // Already a member? (same account, same email, or same mobile in this section)
  const { data: existing } = await supabaseAdmin.from("broadcast_members").select("*").eq("section_id", sectionId);
  const dup = ((existing || []) as DbMember[]).find(
    (m) => (linked && m.user_id === linked.id) || (email && m.email === email) || (mobile && m.mobile === mobile)
  );
  if (dup) throw new Error("This student is already registered in this section");

  const { data, error } = await supabaseAdmin
    .from("broadcast_members")
    .insert([{
      section_id: sectionId,
      user_id: linked ? linked.id : null,
      name: name || linked?.name || null,
      email: email || linked?.email || null,
      mobile: mobile || linked?.mobile || null,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  const row = data as DbMember;
  return toMember(row, new Map(linked ? [[linked.id, linked]] : []));
}

// ─── ADMIN: deregister (remove) a member from a section ───
export async function removeMemberAction(sectionId: string, memberId: string) {
  await requireCOAdmin();
  const { error } = await supabaseAdmin.from("broadcast_members").delete().eq("id", memberId).eq("section_id", sectionId);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ─── ADMIN: upload a broadcast attachment (image / file / document) ───
// Requires a PUBLIC Supabase Storage bucket named "broadcasts" (create it in
// the Supabase dashboard: Storage -> New bucket -> name "broadcasts", Public).
// FormData: { file: File, sectionId: string }. Max 10 MB.
export async function uploadBroadcastFileAction(formData: FormData) {
  await requireCOAdmin();
  const file = formData.get("file") as File | null;
  const sectionId = String(formData.get("sectionId") || "");
  if (!file || file.size === 0) throw new Error("No file selected");
  if (!sectionId) throw new Error("Section is required");
  if (file.size > 10 * 1024 * 1024) throw new Error("File must be under 10 MB");
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${sectionId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabaseAdmin.storage.from("broadcasts").upload(path, file, { contentType: file.type || undefined });
  if (error) throw new Error(error.message);
  const { data } = supabaseAdmin.storage.from("broadcasts").getPublicUrl(path);
  return { success: true, url: data.publicUrl, name: file.name, size: file.size, type: file.type || "" };
}

// ─── ADMIN: broadcast a message (text and/or an attachment) to every member ───
// input.fileSize is the display string, e.g. "1.2 MB" (format it client-side).
export async function broadcastMessageAction(
  sectionId: string,
  input: { content?: string; fileUrl?: string; fileName?: string; fileSize?: string; fileType?: string }
) {
  const admin = await requireCOAdmin();
  const text = (input.content || "").trim();
  const fileUrl = (input.fileUrl || "").trim() || null;
  if (!text && !fileUrl) throw new Error("Write a message or attach a file");
  const { data: section, error: sErr } = await supabaseAdmin.from("broadcast_sections").select("id").eq("id", sectionId).single();
  if (sErr || !section) throw new Error("Section not found");
  const { data, error } = await supabaseAdmin
    .from("broadcast_messages")
    .insert([{
      section_id: sectionId,
      sender_id: admin.sub,
      sender_name: admin.name || "Admin",
      content: text,
      file_url: fileUrl,
      file_name: (input.fileName || "").trim() || null,
      file_size: (input.fileSize || "").trim() || null,
      file_type: (input.fileType || "").trim() || null,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { ...(data as BroadcastMessage), reactions: [] };
}

// ─── STUDENT (and admin): react to a broadcast message, WhatsApp-style ───
// One reaction per user per message. Tapping the same emoji again removes it;
// tapping a different emoji replaces it. Returns the message's updated
// reaction groups so the client can refresh just that message.
export async function toggleReactionAction(messageId: string, emoji: string) {
  const me = await getMyIdentity();
  const clean = (emoji || "").trim();
  if (!clean) throw new Error("Reaction is required");
  const { data: message, error: mErr } = await supabaseAdmin.from("broadcast_messages").select("id, section_id").eq("id", messageId).single();
  if (mErr || !message) throw new Error("Message not found");
  // Allowed: a section admin, or a member of the section.
  let allowed = false;
  try { await requireCOAdmin(); allowed = true; } catch { allowed = false; }
  if (!allowed) {
    const mine = await getMyMemberRows(message.section_id, me);
    allowed = mine.length > 0;
  }
  if (!allowed) throw new Error("You are not a member of this section");
  const { data: existing } = await supabaseAdmin
    .from("broadcast_reactions")
    .select("*")
    .eq("message_id", messageId)
    .eq("user_id", me.userId)
    .limit(1);
  const row = ((existing || []) as DbReaction[])[0];
  if (row) {
    if (row.emoji === clean) {
      const { error } = await supabaseAdmin.from("broadcast_reactions").delete().eq("id", row.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("broadcast_reactions").update({ emoji: clean }).eq("id", row.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { data: userRow } = await supabaseAdmin.from("users").select("name, email, mobile").eq("id", me.userId).single();
    const u = (userRow || {}) as Partial<DbUser>;
    const userName = u.name || me.email || me.mobile || "Student";
    const { error } = await supabaseAdmin.from("broadcast_reactions").insert([{
      message_id: messageId, user_id: me.userId, user_name: userName, emoji: clean,
    }]);
    if (error) throw new Error(error.message);
  }
  const { data: fresh } = await supabaseAdmin.from("broadcast_reactions").select("*").eq("message_id", messageId).order("created_at", { ascending: true });
  return { reactions: groupReactions((fresh || []) as DbReaction[], me.userId) };
}

// ─── STUDENT: sections I belong to (by account, email, or mobile) ───
export async function getMySectionsAction(): Promise<SectionSummary[]> {
  const me = await getMyIdentity();
  const ors: string[] = [`user_id.eq.${me.userId}`];
  if (me.email) ors.push(`email.eq.${me.email}`);
  if (me.mobile) ors.push(`mobile.eq.${me.mobile}`);
  const { data: members, error } = await supabaseAdmin.from("broadcast_members").select("section_id").or(ors.join(","));
  if (error) throw new Error(error.message);
  const ids = [...new Set(((members || []) as { section_id: string }[]).map((m) => m.section_id))];
  if (!ids.length) return [];
  const { data: sections, error: sErr } = await supabaseAdmin.from("broadcast_sections").select("*").in("id", ids).order("created_at", { ascending: false });
  if (sErr) throw new Error(sErr.message);
  return buildSummaries((sections || []) as DbSection[]);
}

// ─── STUDENT: message history of one of my sections ───
export async function getSectionMessagesAction(sectionId: string): Promise<BroadcastMessage[]> {
  const me = await getMyIdentity();
  const mine = await getMyMemberRows(sectionId, me);
  if (!mine.length) throw new Error("You are not a member of this section");
  const { data, error } = await supabaseAdmin
    .from("broadcast_messages")
    .select("*")
    .eq("section_id", sectionId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw new Error(error.message);
  return attachReactions((data || []) as DbMessage[], me.userId);
}

// ─── STUDENT: leave a section ───
export async function leaveSectionAction(sectionId: string) {
  const me = await getMyIdentity();
  const mine = await getMyMemberRows(sectionId, me);
  if (!mine.length) return { success: true };
  const { error } = await supabaseAdmin.from("broadcast_members").delete().in("id", mine.map((m) => m.id));
  if (error) throw new Error(error.message);
  return { success: true };
}
