// src/components/StudentSectionsPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE — student "My Sections" panel for the Jan Seva Kendra site.
// Place at src/components/StudentSectionsPanel.tsx. No changes are needed in
// any other file. This is the inline-panel twin of SectionsModal.tsx: the
// same logic, laid out like the admin SectionsPanel (WhatsApp-style
// two-pane). The dashboard renders this panel in its body when the
// "Sections" tab is active, and hides its chat body — so this file has NO
// modal overlay and no close prop; it is a plain inline panel.
//
// WHAT IT DOES (all logic carried over unchanged from SectionsModal.tsx)
// - Lists the sections the logged-in student belongs to
//   (getMySectionsAction), with the last broadcast preview, member count
//   and message count. Click a section to read its broadcast history
//   (getSectionMessagesAction). Students can read only — there is no
//   composer, so a student can never send a message.
// - A student can leave a section: window.confirm first, then
//   leaveSectionAction, back to the list, list refetched.
// - While mounted, it listens on the dashboard socket for
//   "broadcast_message" and "refresh_queue" and refetches the current view.
//   A broadcast for one of my sections while the tab is hidden shows a
//   desktop Notification (only when permission is already granted — this
//   file never asks for it).
// - Broadcasts can carry an image/file/document: images render as a
//   thumbnail (click opens the full image in a new tab), other files as a
//   download row. Students can react to a message with one of six emoji
//   (WhatsApp-style); tapping a reaction chip shows who reacted, grouped
//   by emoji.
//
// LAYOUT (mirrors src/components/admin/SectionsPanel.tsx)
// - Root: flex flex-1 overflow-hidden — fills whatever the dashboard gives it.
// - Left: 360px sidebar (navy "My Sections" strip + sections list).
// - Right: detail pane (header + scrolling messages, no composer) or the
//   "Select a section" empty state.
// - Mobile (below md): list OR detail, never both — same pattern as the
//   dashboard and the admin panel. The back button in the detail header is
//   md:hidden; on desktop the list is always visible, so it is not needed.
//
// DESIGN (per ~/workspace/jan-seva-kendra/CONTEXT.md): Tailwind dark:
// classes, one deep-blue accent in both themes, system sans, lucide-react
// icons only, no emoji as UI icons (the six reaction emoji are message
// content, not icons), no framer-motion, no gradients.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  ArrowLeft,
  Download,
  FileText,
  LogOut,
  Megaphone,
  MessageSquare,
  SmilePlus,
  Users,
  X,
} from "lucide-react";
import {
  getMySectionsAction,
  getSectionMessagesAction,
  leaveSectionAction,
  toggleReactionAction,
  type BroadcastMessage,
  type SectionSummary,
} from "@/app/actions/sections";

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// The fixed reaction set (WhatsApp-style). These emoji are message content.
const REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

const isImageMsg = (m: BroadcastMessage) =>
  !!m.file_url &&
  ((m.file_type || "").startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(m.file_name || ""));

export default function StudentSectionsPanel({ socket }: { socket?: Socket | null }) {
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionSummary | null>(null);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [reactionsFor, setReactionsFor] = useState<string | null>(null);
  const [reactingId, setReactingId] = useState<string | null>(null);

  const fetchSections = useCallback(async (silent = false) => {
    if (!silent) setLoadingList(true);
    setListError("");
    try {
      const data = await getMySectionsAction();
      setSections(data);
    } catch (e) {
      console.error(e);
      setListError("Could not load your sections. Please try again.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchMessages = useCallback(async (sectionId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const data = await getSectionMessagesAction(sectionId);
      setMessages(data);
    } catch (e) {
      console.error(e);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const openSection = (section: SectionSummary) => {
    setActiveSection(section);
    setMessages([]);
    fetchMessages(section.id);
  };

  const goBackToList = () => {
    setActiveSection(null);
    setMessages([]);
  };

  const handleLeave = async () => {
    if (!activeSection || isLeaving) return;
    if (!window.confirm(`Leave "${activeSection.title}"? You will stop receiving its messages.`)) return;
    setIsLeaving(true);
    try {
      await leaveSectionAction(activeSection.id);
      setActiveSection(null);
      setMessages([]);
      await fetchSections();
    } catch (e) {
      console.error(e);
      alert("Could not leave the section. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    if (reactingId) return;
    setReactingId(messageId);
    setPickerFor(null);
    try {
      const { reactions } = await toggleReactionAction(messageId, emoji);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
    } catch (e) {
      console.error(e);
    } finally {
      setReactingId(null);
    }
  };

  // Live updates while the panel is mounted.
  useEffect(() => {
    if (!socket) return;

    const handleBroadcast = (msg: any) => {
      const section = sections.find((s) => s.id === msg?.section_id);
      if (!section) return;
      if (
        typeof window !== "undefined" &&
        document.hidden &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(`New message in ${section.title}`, {
          body: msg.content || "New broadcast message",
          icon: "/favicon.ico",
        });
      }
      if (activeSection?.id === msg.section_id) fetchMessages(msg.section_id, true);
      else fetchSections(true);
    };

    const handleRefresh = () => {
      if (activeSection) fetchMessages(activeSection.id, true);
      else fetchSections(true);
    };

    socket.on("broadcast_message", handleBroadcast);
    socket.on("refresh_queue", handleRefresh);
    return () => {
      socket.off("broadcast_message", handleBroadcast);
      socket.off("refresh_queue", handleRefresh);
    };
  }, [socket, sections, activeSection, fetchMessages, fetchSections]);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* ── LEFT sidebar: sections list ── */}
      <div className={`w-[360px] max-w-full shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0d1526] ${activeSection ? "hidden md:flex" : "flex"}`}>
        {/* Navy strip header, like the admin panel */}
        <div className="flex shrink-0 items-center gap-2.5 bg-[#0b2239] px-4 py-3 dark:bg-[#081120]">
          <Megaphone className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-white">My Sections</span>
        </div>

        {/* Sections list (scrolls) — rows kept exactly as the modal's */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loadingList ? (
            <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">Loading…</p>
          ) : listError ? (
            <p className="py-10 text-center text-sm text-red-600 dark:text-red-400">{listError}</p>
          ) : sections.length === 0 ? (
            <div className="py-10 text-center">
              <Megaphone className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">You are not part of any section yet.</p>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">When an admin adds you to a section, its messages will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openSection(s)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-[#111a2e] dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] font-bold text-slate-900 dark:text-white">{s.title}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {s.lastMessage ? `${fmtDate(s.lastMessage.created_at)} · ${fmtTime(s.lastMessage.created_at)}` : fmtDate(s.created_at)}
                    </span>
                  </div>
                  {s.description && (
                    <p className="mt-0.5 truncate text-[13px] text-slate-500 dark:text-slate-400">{s.description}</p>
                  )}
                  <p className="mt-1.5 truncate text-[13px] text-slate-600 dark:text-slate-300">
                    {s.lastMessage ? (
                      <>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">{s.lastMessage.sender_name || "Admin"}: </span>
                        {s.lastMessage.content}
                      </>
                    ) : "No messages yet"}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.memberCount} {s.memberCount === 1 ? "member" : "members"}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {s.messageCount} {s.messageCount === 1 ? "message" : "messages"}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT pane: detail or empty state ── */}
      <div className={`flex-1 flex-col overflow-hidden bg-slate-100 dark:bg-[#080d17] ${activeSection ? "flex" : "hidden md:flex"}`}>
        {!activeSection ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-400">
              <Megaphone className="h-8 w-8" />
            </div>
            <div className="text-xl font-bold text-slate-500 dark:text-slate-400">Select a section</div>
            <div className="text-[13px] text-slate-400">Choose a section from the list to read its messages</div>
          </div>
        ) : (
          <>
            {/* Header — same as the modal's, minus the X close button */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#111a2e]">
              <button
                onClick={goBackToList}
                aria-label="Back to sections"
                className="flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-400 md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Megaphone className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold text-slate-900 dark:text-slate-100">{activeSection.title}</div>
                {activeSection.description && (
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">{activeSection.description}</div>
                )}
              </div>
              <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" /> {isLeaving ? "Leaving…" : "Leave"}
              </button>
            </div>

            {/* Messages — the only scrolling region, exactly as the modal renders them */}
            <div className="flex flex-1 overflow-y-auto flex-col px-5 py-4">
              {loadingMessages ? (
                <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">No messages yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <div key={m.id} className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-blue-700 dark:text-blue-400">{m.sender_name || "Admin"}</span>
                        <span className="shrink-0 text-[11px] text-slate-400">{fmtDate(m.created_at)} · {fmtTime(m.created_at)}</span>
                      </div>

                      {/* Attachment: image thumbnail, or a download row for other files */}
                      {m.file_url && (
                        isImageMsg(m) ? (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className="mb-2 block max-w-[260px]">
                            <img
                              src={m.file_url}
                              alt={m.file_name || "Image"}
                              className="max-h-[260px] w-full rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                            />
                          </a>
                        ) : (
                          <a
                            href={m.file_url}
                            target="_blank"
                            rel="noreferrer"
                            download={m.file_name || undefined}
                            className="mb-2 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800"
                          >
                            <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">{m.file_name || "File"}</span>
                              {m.file_size && <span className="text-[11px] text-slate-400">{m.file_size}</span>}
                            </span>
                            <span className="flex shrink-0 items-center gap-1 rounded-md bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white">
                              <Download className="h-3 w-3" /> Download
                            </span>
                          </a>
                        )
                      )}

                      {m.content && (
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900 dark:text-slate-100">{m.content}</p>
                      )}

                      {/* Reactions: chips + react button */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {(m.reactions || []).map((g) => (
                          <button
                            key={g.emoji}
                            onClick={() => { setPickerFor(null); setReactionsFor(reactionsFor === m.id ? null : m.id); }}
                            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors ${g.reactedByMe
                              ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/15 dark:text-blue-400"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
                          >
                            <span>{g.emoji}</span> {g.count}
                          </button>
                        ))}
                        <button
                          onClick={() => { setReactionsFor(null); setPickerFor(pickerFor === m.id ? null : m.id); }}
                          aria-label="React to this message"
                          className="flex rounded-full border border-slate-200 bg-white p-1.5 text-slate-400 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
                        >
                          <SmilePlus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Emoji picker (fixed set of six) */}
                      {pickerFor === m.id && (
                        <div className="absolute bottom-full left-0 z-50 mb-1 flex gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-[#1a2742]">
                          {REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(m.id, emoji)}
                              className="rounded-full p-1 text-lg leading-none transition-transform hover:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Who reacted, grouped by emoji */}
                      {reactionsFor === m.id && (
                        <div className="absolute left-0 top-full z-50 mt-1 w-[220px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#1a2742]">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Reactions</span>
                            <button
                              onClick={() => setReactionsFor(null)}
                              aria-label="Close reactions"
                              className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {(m.reactions || []).map((g) => (
                            <div key={g.emoji} className="mb-1.5 last:mb-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white">{g.emoji} {g.count}</div>
                              {g.users.map((u) => (
                                <div key={u.user_id || u.user_name} className="ml-5 text-[13px] text-slate-600 dark:text-slate-300">{u.user_name}</div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Closes the emoji picker / reactions popover on outside click.
          Absolute (not fixed): it only covers this panel, never the rest
          of the dashboard — the picker/popover (z-50) sit above it. */}
      {(pickerFor || reactionsFor) && (
        <div
          className="absolute inset-0 z-40"
          onClick={() => { setPickerFor(null); setReactionsFor(null); }}
        />
      )}
    </div>
  );
}
