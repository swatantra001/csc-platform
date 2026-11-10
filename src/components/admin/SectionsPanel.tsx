// src/components/admin/SectionsPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE — admin "Broadcast Sections" panel for the Jan Seva Kendra site.
// Place this file at src/components/admin/SectionsPanel.tsx. No other file
// is changed; it only calls the actions in src/app/actions/sections.ts.
//
// WHAT IT DOES
// - Lists all broadcast sections (title, description, member/message counts,
//   last message). Clicking a section opens its detail view.
// - Create modal, two steps: (1) section details (title required,
//   description optional), (2) pick students from the website user list
//   (multi-select) — or create the section empty.
// - Layout: WhatsApp-style two-pane — sections list on the left, detail on
//   the right with a fixed composer footer; only the messages area scrolls.
// - Detail view: message history (oldest first) + broadcast composer. On
//   send it calls broadcastMessageAction, appends the message, and emits
//   "broadcast_message" + "trigger_queue_refresh" on the socket. It also
//   refetches when a "broadcast_message" arrives for the open section.
// - Composer attachments: the admin can attach an image, file or document
//   (max 10 MB) via uploadBroadcastFileAction; images render as thumbnails,
//   other files as download rows. Message reactions are view-only here:
//   reaction chips under each message — click a chip to see who reacted,
//   grouped by emoji (students react from their own dashboard).
// - Manage Members modal: add students from the website list (excluding
//   current members), register a student manually by email and/or mobile
//   (at least one mandatory), and deregister (remove) current members.
// - Students leave a section from their own dashboard (leaveSectionAction)
//   — that flow is not part of this admin panel.
//
// STYLE: matches src/app/admin/page.tsx — navy header strip (#0b2239 /
// dark #081120), the same btnP / btnG / btnD / inpCls class constants,
// alert() for errors, lucide-react icons only, one deep-blue accent,
// Tailwind dark: classes, no gradients, no framer-motion.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  addMembersAction,
  broadcastMessageAction,
  createSectionAction,
  getAllStudentsAction,
  getSectionDetailAction,
  getSectionsAction,
  registerMemberAction,
  removeMemberAction,
  uploadBroadcastFileAction,
  type SectionMember,
  type SectionSummary,
} from "@/app/actions/sections";
import type { Socket } from "socket.io-client";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Megaphone,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

// ─── Shared class strings (same as src/app/admin/page.tsx) ───
const btnBase = "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px]! font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";
const btnP = `${btnBase} bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500`;
const btnG = `${btnBase} bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`;
const btnD = `${btnBase} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25`;
const inpCls = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px]! text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";

// ─── Utils ───
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtBytes = (b: number) => { if (!b) return "0 B"; const k = 1024, s = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(1)) + " " + s[i]; };
const isImageFile = (fileType?: string | null, fileName?: string | null) =>
  !!fileType?.startsWith("image/") || !!fileName?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

type WebsiteStudent = Awaited<ReturnType<typeof getAllStudentsAction>>[number];
type SectionDetail = Awaited<ReturnType<typeof getSectionDetailAction>>;

const studentLabel = (s: WebsiteStudent) => s.name || s.email || s.mobile || "Student";
const studentContact = (s: WebsiteStudent) => [s.mobile, s.email].filter(Boolean).join(" · ");
const matchesQuery = (s: WebsiteStudent, q: string) => {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return [s.name, s.email, s.mobile].some((v) => v?.toLowerCase().includes(query));
};
const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];

export default function SectionsPanel({ socket }: { socket?: Socket | null }) {
  // ── List ──
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  // ── Detail ──
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SectionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // ── Create modal ──
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createTitle, setCreateTitle] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createSearch, setCreateSearch] = useState("");
  const [createSelected, setCreateSelected] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // ── Shared student list (website users) ──
  const [students, setStudents] = useState<WebsiteStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // ── Manage members modal ──
  const [showManage, setShowManage] = useState(false);
  const [manageSearch, setManageSearch] = useState("");
  const [manageSelected, setManageSelected] = useState<string[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ── Composer ──
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [reactionPopoverId, setReactionPopoverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Loaders ──
  const loadSections = useCallback(async () => {
    setIsLoadingSections(true);
    try {
      const data = await getSectionsAction();
      setSections(data);
    } catch (e: unknown) {
      alert("Failed to load sections: " + (e as Error).message);
    } finally {
      setIsLoadingSections(false);
    }
  }, []);

  const loadDetail = useCallback(async (sectionId: string) => {
    setIsLoadingDetail(true);
    try {
      const data = await getSectionDetailAction(sectionId);
      setDetail(data);
    } catch (e: unknown) {
      alert("Failed to load section: " + (e as Error).message);
      setDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const data = await getAllStudentsAction();
      setStudents(data);
    } catch (e: unknown) {
      alert("Failed to load students: " + (e as Error).message);
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  useEffect(() => { loadSections(); }, [loadSections]);

  // ── Open / close ──
  const openDetail = (sectionId: string) => {
    setOpenSectionId(sectionId);
    setDetail(null);
    loadDetail(sectionId);
  };

  const goBackToList = () => {
    setOpenSectionId(null);
    setDetail(null);
    loadSections();
  };

  const refreshDetail = () => { if (openSectionId) loadDetail(openSectionId); };

  // ── Live updates: refetch the open section when a broadcast arrives ──
  useEffect(() => {
    if (!socket || !detail) return;
    const sectionId = detail.section.id;
    const handleBroadcast = (payload: any) => {
      if (payload?.section_id === sectionId) loadDetail(sectionId);
    };
    socket.on("broadcast_message", handleBroadcast);
    return () => { socket.off("broadcast_message", handleBroadcast); };
  }, [socket, detail?.section.id, loadDetail]);

  // ── Create flow ──
  const openCreate = () => {
    setCreateStep(1);
    setCreateTitle("");
    setCreateDesc("");
    setCreateSearch("");
    setCreateSelected([]);
    setShowCreate(true);
  };

  const goToStep2 = () => {
    if (!createTitle.trim()) { alert("Section title is required"); return; }
    setCreateStep(2);
    loadStudents();
  };

  const handleCreate = async (withMembers: boolean) => {
    setIsCreating(true);
    try {
      const section = await createSectionAction({
        title: createTitle.trim(),
        description: createDesc.trim() || undefined,
        memberIds: withMembers ? createSelected : [],
      });
      setShowCreate(false);
      openDetail(section.id);
    } catch (e: unknown) {
      alert("Failed to create section: " + (e as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  // ── Broadcast ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert("File must be under 10 MB"); return; }
    setPendingFile(f);
  };

  const handleBroadcast = async () => {
    if (!detail || isSending) return;
    if (!draft.trim() && !pendingFile) return;
    setIsSending(true);
    try {
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      let fileSize: string | undefined;
      let fileType: string | undefined;
      if (pendingFile) {
        const fd = new FormData();
        fd.append("file", pendingFile);
        fd.append("sectionId", detail.section.id);
        const up = await uploadBroadcastFileAction(fd);
        if (!up.success) throw new Error("Upload failed");
        fileUrl = up.url;
        fileName = up.name;
        fileSize = fmtBytes(up.size);
        fileType = up.type;
      }
      const msg = await broadcastMessageAction(detail.section.id, {
        content: draft.trim() || undefined,
        fileUrl,
        fileName,
        fileSize,
        fileType,
      });
      setDetail((prev) => (prev ? { ...prev, messages: [...prev.messages, msg] } : prev));
      setDraft("");
      setPendingFile(null);
      socket?.emit("broadcast_message", { ...msg, section_title: detail.section.title });
      socket?.emit("trigger_queue_refresh");
    } catch (e: unknown) {
      alert("Failed to send message: " + (e as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  // ── Manage members ──
  const openManage = () => {
    setManageSearch("");
    setManageSelected([]);
    setRegName(""); setRegEmail(""); setRegMobile("");
    setShowManage(true);
    loadStudents();
  };

  const handleAddMembers = async () => {
    if (!detail || !manageSelected.length) return;
    setIsAddingMembers(true);
    try {
      const res = await addMembersAction(detail.section.id, manageSelected);
      setManageSelected([]);
      refreshDetail();
      if (res.added === 0) alert("Those students are already members of this section.");
    } catch (e: unknown) {
      alert("Failed to add members: " + (e as Error).message);
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleRegister = async () => {
    if (!detail) return;
    if (!regEmail.trim() && !regMobile.trim()) {
      alert("Email or mobile is required (at least one)");
      return;
    }
    setIsRegistering(true);
    try {
      await registerMemberAction(detail.section.id, {
        name: regName.trim() || undefined,
        email: regEmail.trim() || undefined,
        mobile: regMobile.trim() || undefined,
      });
      setRegName(""); setRegEmail(""); setRegMobile("");
      refreshDetail();
    } catch (e: unknown) {
      alert("Failed to register student: " + (e as Error).message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRemoveMember = async (member: SectionMember) => {
    if (!detail) return;
    if (!window.confirm(`Remove ${member.displayName} from this section?`)) return;
    setRemovingId(member.id);
    try {
      await removeMemberAction(detail.section.id, member.id);
      refreshDetail();
    } catch (e: unknown) {
      alert("Failed to remove member: " + (e as Error).message);
    } finally {
      setRemovingId(null);
    }
  };

  // ── Derived lists ──
  const createFiltered = students.filter((s) => matchesQuery(s, createSearch));
  const memberUserIds = new Set(
    (detail?.members || []).map((m) => m.user_id).filter(Boolean) as string[]
  );
  const availableStudents = students.filter((s) => !memberUserIds.has(s.id));
  const manageFiltered = availableStudents.filter((s) => matchesQuery(s, manageSearch));

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── LEFT sidebar: sections list ── */}
      <div className={`w-[360px] max-w-full shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#111a2e] ${openSectionId ? "hidden md:flex" : "flex"}`}>
        <div className="flex shrink-0 items-center justify-between gap-2 bg-[#0b2239] px-4 py-3 dark:bg-[#081120]">
            <div className="flex items-center gap-2.5">
              <Megaphone className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">Broadcast Sections</span>
            </div>
            <button
              onClick={openCreate}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-500/60 bg-blue-500/10 px-3 py-1.5 text-xs! font-bold text-blue-400 hover:bg-blue-500/20"
            >
              <Plus className="h-3.5 w-3.5" /> New Section
            </button>
          </div>

          {/* List (scrolls) */}
          <div className="flex-1 overflow-y-auto">
          {isLoadingSections ? (
            <div className="flex items-center justify-center gap-2 p-10 text-[13px] text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : sections.length === 0 ? (
            <div className="p-10 text-center">
              <Megaphone className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <div className="text-[15px] font-bold text-slate-500 dark:text-slate-400">No sections yet</div>
              <div className="mt-1 text-[13px] text-slate-400">Create a section to broadcast messages to a group of students.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-white/5">
              {sections.map((s) => (
                <div
                  key={s.id}
                  onClick={() => openDetail(s.id)}
                  className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{s.title}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{fmtDate(s.created_at)}</span>
                    </div>
                    {s.description && (
                      <div className="mt-0.5 truncate text-[13px] text-slate-500 dark:text-slate-400">{s.description}</div>
                    )}
                    <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.memberCount} members</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {s.messageCount} messages</span>
                    </div>
                    {s.lastMessage && (
                      <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-blue-700 dark:text-blue-400">{s.lastMessage.sender_name || "Admin"}:</span>{" "}
                        {s.lastMessage.content}
                        <span className="ml-2 text-slate-400">· {fmtTime(s.lastMessage.created_at)}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT pane: detail or empty state ── */}
      <div className={`flex-1 flex-col overflow-hidden bg-slate-100 dark:bg-[#080d17] ${openSectionId ? "flex" : "hidden md:flex"}`}>
        {!openSectionId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-400">
              <Megaphone className="h-8 w-8" />
            </div>
            <div className="text-xl font-bold text-slate-500 dark:text-slate-400">Select a section</div>
            <div className="text-[13px] text-slate-400">Choose a section from the list to view its messages</div>
          </div>
        ) : !detail ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-[13px] text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#111a2e]">
              <button
                onClick={goBackToList}
                aria-label="Back to sections"
                className="flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-400 md:hidden"
              >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-bold text-slate-900 dark:text-slate-100">{detail.section.title}</div>
                  {detail.section.description && (
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">{detail.section.description}</div>
                  )}
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-400 sm:flex">
                  <Users className="h-3 w-3" /> {detail.members.length} members
                </span>
                <button onClick={openManage} className={btnG} style={{ fontSize: 12 }}>
                  <Users className="h-3.5 w-3.5" /> Manage Members
                </button>
              </div>

              {/* Message history (oldest first) — the only scrolling region */}
              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                {detail.messages.length === 0 ? (
                  <div className="py-10 text-center text-[13px] text-slate-400">
                    No messages yet — broadcast the first message below.
                  </div>
                ) : (
                  detail.messages.map((m) => (
                    <div key={m.id} className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[12px] font-bold text-blue-700 dark:text-blue-400">{m.sender_name || "Admin"}</span>
                        <span className="shrink-0 text-[11px] text-slate-400">{fmtDate(m.created_at)} · {fmtTime(m.created_at)}</span>
                      </div>

                      {/* Attachment: image thumbnail or download row */}
                      {m.file_url && (
                        isImageFile(m.file_type, m.file_name) ? (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className="mb-2 block max-w-[260px]">
                            <img src={m.file_url} alt={m.file_name || "attachment"} className="block max-h-[340px] w-full rounded-lg border border-slate-200 object-cover object-top dark:border-white/10" />
                          </a>
                        ) : (
                          <a href={m.file_url} target="_blank" rel="noreferrer" download={m.file_name || undefined} className="mb-2 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:border-blue-600 dark:border-white/10 dark:bg-white/5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400">
                              <FileText className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">{m.file_name || "File"}</span>
                              <span className="text-[11px] text-slate-400">{m.file_size || ""}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                              <Download className="h-3.5 w-3.5" /> Download
                            </span>
                          </a>
                        )
                      )}
                      {m.content && (
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900 dark:text-slate-100">{m.content}</div>
                      )}

                      {/* Reactions (view only — the admin does not react) */}
                      {(m.reactions || []).length > 0 && (
                        <div className="relative mt-2 flex flex-wrap gap-1.5">
                          {(m.reactions || []).map((g) => (
                            <button
                              key={g.emoji}
                              onClick={() => setReactionPopoverId(reactionPopoverId === m.id ? null : m.id)}
                              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors ${g.reactedByMe ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/15 dark:text-blue-400" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
                            >
                              <span>{g.emoji}</span>
                              <span>{g.count}</span>
                            </button>
                          ))}
                          {reactionPopoverId === m.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setReactionPopoverId(null)} />
                              <div className="absolute left-0 top-full z-20 mt-1 w-[260px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0f172a]">
                                <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-white/10">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reactions</span>
                                  <button onClick={() => setReactionPopoverId(null)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="max-h-[220px] overflow-y-auto p-2">
                                  {(m.reactions || []).map((g) => (
                                    <div key={g.emoji}>
                                      {g.users.map((u) => (
                                        <div key={`${g.emoji}-${u.user_id || u.user_name}`} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]">
                                          <span className="text-base">{g.emoji}</span>
                                          <span className="truncate font-semibold text-slate-900 dark:text-slate-100">{u.user_name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Broadcast composer (fixed footer — only the messages above scroll) */}
              <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#111a2e]">
                {pendingFile && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/25 dark:bg-blue-500/10">
                    <FileText className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">{pendingFile.name}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{fmtBytes(pendingFile.size)}</span>
                    <button onClick={() => setPendingFile(null)} aria-label={`Remove ${pendingFile.name}`} className="flex shrink-0 p-0.5 text-slate-400 hover:text-red-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach a file"
                    className="flex shrink-0 rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:border-blue-600 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-400"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Broadcast a message to all members…"
                    aria-label="Broadcast message"
                    className={`${inpCls} resize-none !text-sm`}
                  />
                  <button
                    onClick={handleBroadcast}
                    disabled={(!draft.trim() && !pendingFile) || isSending}
                    className={btnP}
                    style={{ padding: "10px 16px" }}
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
                  </button>
                </div>
              </div>
            </>
          )}
      </div>

      {/* ── Create modal (two steps) ── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 dark:bg-black/85"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div className="w-full max-w-[520px] overflow-hidden rounded-[14px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-slate-100">
                <Megaphone className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                {createStep === 1 ? "New Section" : "Add Students"}
              </div>
              <button onClick={() => setShowCreate(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="mb-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Step {createStep} of 2 — {createStep === 1 ? "Section details" : "Add students"}
              </div>

              {createStep === 1 ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title *</label>
                    <input
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      placeholder="e.g. ADCA Batch 2026"
                      className={inpCls}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                    <textarea
                      value={createDesc}
                      onChange={(e) => setCreateDesc(e.target.value)}
                      rows={3}
                      placeholder="What is this section for? (optional)"
                      className={`${inpCls} resize-none`}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className={btnG} onClick={() => setShowCreate(false)}>Cancel</button>
                    <button className={btnP} onClick={goToStep2}>Next</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search className="h-3.5 w-3.5" /></span>
                    <input
                      value={createSearch}
                      onChange={(e) => setCreateSearch(e.target.value)}
                      placeholder="Search name, email or mobile…"
                      className={inpCls}
                      style={{ paddingLeft: 33 }}
                    />
                  </div>

                  {isLoadingStudents ? (
                    <div className="flex items-center justify-center gap-2 p-8 text-[13px] text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                    </div>
                  ) : createFiltered.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 p-6 text-center text-[13px] text-slate-400 dark:border-white/10">
                      No students found.
                    </div>
                  ) : (
                    <div className="max-h-[320px] overflow-y-auto rounded-lg border border-slate-200 dark:border-white/10">
                      {createFiltered.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setCreateSelected((p) => toggleId(p, s.id))}
                          className="flex cursor-pointer items-center gap-3 border-b border-slate-200 px-3.5 py-2.5 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
                        >
                          <input type="checkbox" readOnly checked={createSelected.includes(s.id)} className="h-4 w-4 shrink-0 accent-blue-700" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13.5px] font-bold text-slate-900 dark:text-slate-100">{studentLabel(s)}</div>
                            {studentContact(s) && <div className="truncate text-[11px] text-slate-400">{studentContact(s)}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{createSelected.length} selected</span>
                    <div className="flex gap-2">
                      <button className={btnG} onClick={() => setCreateStep(1)}>Back</button>
                      <button className={btnG} onClick={() => handleCreate(false)} disabled={isCreating}>Create empty</button>
                      <button className={btnP} onClick={() => handleCreate(true)} disabled={isCreating}>
                        {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Create Section
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Manage Members modal ── */}
      {showManage && detail && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 dark:bg-black/85"
          onClick={(e) => { if (e.target === e.currentTarget) setShowManage(false); }}
        >
          <div className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-[14px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex min-w-0 items-center gap-2 text-base font-extrabold text-slate-900 dark:text-slate-100">
                <Users className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
                <span className="truncate">Manage Members — {detail.section.title}</span>
              </div>
              <button onClick={() => setShowManage(false)} aria-label="Close" className="shrink-0 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-5 py-5">
              {/* (a) Add from website */}
              <section>
                <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Add from website</div>
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search className="h-3.5 w-3.5" /></span>
                  <input
                    value={manageSearch}
                    onChange={(e) => setManageSearch(e.target.value)}
                    placeholder="Search name, email or mobile…"
                    className={inpCls}
                    style={{ paddingLeft: 33 }}
                  />
                </div>
                {isLoadingStudents ? (
                  <div className="flex items-center justify-center gap-2 p-6 text-[13px] text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                  </div>
                ) : manageFiltered.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 p-4 text-center text-[13px] text-slate-400 dark:border-white/10">
                    {availableStudents.length === 0
                      ? "All website students are already members of this section."
                      : "No students found."}
                  </div>
                ) : (
                  <div className="max-h-[220px] overflow-y-auto rounded-lg border border-slate-200 dark:border-white/10">
                    {manageFiltered.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setManageSelected((p) => toggleId(p, s.id))}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-200 px-3.5 py-2.5 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
                      >
                        <input type="checkbox" readOnly checked={manageSelected.includes(s.id)} className="h-4 w-4 shrink-0 accent-blue-700" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13.5px] font-bold text-slate-900 dark:text-slate-100">{studentLabel(s)}</div>
                          {studentContact(s) && <div className="truncate text-[11px] text-slate-400">{studentContact(s)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className={btnP}
                  style={{ marginTop: 10 }}
                  onClick={handleAddMembers}
                  disabled={!manageSelected.length || isAddingMembers}
                >
                  {isAddingMembers ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                  Add selected ({manageSelected.length})
                </button>
              </section>

              {/* (b) Register manually */}
              <section>
                <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Register manually</div>
                <div className="grid gap-2.5">
                  <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Name (optional)" className={inpCls} />
                  <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" type="email" className={inpCls} />
                  <input value={regMobile} onChange={(e) => setRegMobile(e.target.value)} placeholder="Mobile" inputMode="tel" className={inpCls} />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  At least one of email or mobile is required. If the email or mobile matches a website account, the member is linked to it.
                </p>
                <button className={btnG} style={{ marginTop: 10 }} onClick={handleRegister} disabled={isRegistering}>
                  {isRegistering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />} Register student
                </button>
              </section>

              {/* (c) Current members */}
              <section>
                <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current members ({detail.members.length})
                </div>
                {detail.members.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-[13px] text-slate-400 dark:border-white/10">
                    No members yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-white/5 dark:border-white/10">
                    {detail.members.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 px-3.5 py-2.5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13.5px] font-bold text-slate-900 dark:text-slate-100">{m.displayName}</div>
                          <div className="truncate text-[11px] text-slate-400">
                            {[m.mobile, m.email].filter(Boolean).join(" · ") || "No contact saved"}
                          </div>
                        </div>
                        <button
                          className={btnD}
                          style={{ padding: "6px 10px", fontSize: 12 }}
                          onClick={() => handleRemoveMember(m)}
                          disabled={removingId === m.id}
                        >
                          {removingId === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
