// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
// 	Upload, Package, Tag, FileCode,
// 	ExternalLink, Trash2, CheckCircle, AlertCircle
// } from "lucide-react";
// // import { createGitHubRelease, getLatestGitHubRelease, listGitHubReleases } from "@/app/actions/releases";
// import { supabase } from "@/lib/supabase";
// import { FaGithub } from "react-icons/fa";

// interface AppVersion {
// 	id: string;
// 	version_string: string;
// 	apk_url: string;
// 	release_notes: string | null;
// 	github_release_id: number | null;
// 	created_at: string;
// }

// export function AdminReleaseManager({ isDark }: { isDark: boolean }) {
// 	const [isAdmin, setIsAdmin] = useState(false);
// 	const [versions, setVersions] = useState<AppVersion[]>([]);
// 	const [loading, setLoading] = useState(false);
// 	const [uploadProgress, setUploadProgress] = useState(0);

// 	// Form state
// 	const [major, setMajor] = useState("1");
// 	const [minor, setMinor] = useState("0");
// 	const [patch, setPatch] = useState("0");
// 	const [file, setFile] = useState<File | null>(null);
// 	const [releaseNotes, setReleaseNotes] = useState("");
// 	const [githubReleases, setGithubReleases] = useState<any[]>([]);

// 	const T = isDark ? {
// 		bg: "rgba(245,158,11,0.05)",
// 		border: "rgba(245,158,11,0.2)",
// 		accent: "#f59e0b",
// 		text: "#f1f5f9",
// 		muted: "rgba(255,255,255,0.4)",
// 	} : {
// 		bg: "rgba(37,99,235,0.03)",
// 		border: "rgba(37,99,235,0.15)",
// 		accent: "#2563eb",
// 		text: "#1e293b",
// 		muted: "#64748b",
// 	};

// 	useEffect(() => {
// 		// Check admin status
// 		const checkAdmin = async () => {
// 			const { data: { user } } = await supabase.auth.getUser();
// 			if (user?.email === "rm0644320@gmail.com") {
// 				setIsAdmin(true);
// 				fetchVersions();
// 			}
// 		};
// 		checkAdmin();
// 	}, []);

// 	const fetchVersions = async () => {
// 		const { data } = await supabase
// 			.from("app_versions")
// 			.select("*")
// 			.order("created_at", { ascending: false })
// 			.limit(10);
// 		if (data) setVersions(data as AppVersion[]);
// 	};

// 	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const selected = e.target.files?.[0];
// 		if (selected && selected.name.endsWith(".apk")) {
// 			setFile(selected);
// 			const match = selected.name.match(/v?(\d+)\.(\d+)\.(\d+)/);
// 			if (match) {
// 				setMajor(match[1]);
// 				setMinor(match[2]);
// 				setPatch(match[3]);
// 			}
// 		}
// 	};

// 	const handleUpload = async () => {
// 		if (!file) return;
// 		setLoading(true);
// 		setUploadProgress(30); // Fake progress for UX

// 		try {
// 			const versionString = `${major}.${minor}.${patch}`;
// 			const formData = new FormData();
// 			formData.append("file", file);
// 			formData.append("version", versionString);
// 			formData.append("releaseNotes", releaseNotes || `SriLal CSC v${versionString}`);

// 			// await createGitHubRelease(formData); // Server does GitHub + DB

// 			setFile(null);
// 			setReleaseNotes("");
// 			setUploadProgress(100);
// 			await fetchVersions();
// 			setTimeout(() => setUploadProgress(0), 2000);
// 		} catch (err: any) {
// 			alert("Upload failed: " + err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (!isAdmin) return null;

// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, y: 20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ delay: 0.8 }}
// 			className="mt-8 rounded-2xl border overflow-hidden"
// 			style={{ background: T.bg, borderColor: T.border }}
// 		>
// 			{/* Header */}
// 			<div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: T.border }}>
// 				<FaGithub size={20} style={{ color: T.accent }} />
// 				<div>
// 					<h3 className="font-bold text-sm" style={{ color: T.accent }}>
// 						GitHub Releases Manager
// 					</h3>
// 					<p className="text-xs" style={{ color: T.muted }}>
// 						Upload APKs to GitHub Releases — unlimited free bandwidth
// 					</p>
// 				</div>
// 			</div>

// 			<div className="p-5 space-y-5">
// 				{/* Version Inputs */}
// 				<div>
// 					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
// 						Version Number
// 					</label>
// 					<div className="grid grid-cols-3 gap-3">
// 						{[
// 							{ label: "Major", value: major, setter: setMajor },
// 							{ label: "Minor", value: minor, setter: setMinor },
// 							{ label: "Patch", value: patch, setter: setPatch },
// 						].map((field) => (
// 							<div key={field.label} className="relative">
// 								<Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
// 								<input
// 									type="number"
// 									min="0"
// 									value={field.value}
// 									onChange={(e) => field.setter(e.target.value)}
// 									className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-mono font-bold border outline-none"
// 									style={{
// 										background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
// 										borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
// 										color: T.text,
// 									}}
// 								/>
// 							</div>
// 						))}
// 					</div>
// 				</div>

// 				{/* Release Notes */}
// 				<div>
// 					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
// 						Release Notes
// 					</label>
// 					<textarea
// 						value={releaseNotes}
// 						onChange={(e) => setReleaseNotes(e.target.value)}
// 						placeholder="What's new in this version..."
// 						rows={2}
// 						className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
// 						style={{
// 							background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
// 							borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
// 							color: T.text,
// 						}}
// 					/>
// 				</div>

// 				{/* File Upload */}
// 				<div>
// 					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
// 						APK File (max 2GB on GitHub)
// 					</label>
// 					<label className="block cursor-pointer">
// 						<input type="file" accept=".apk" onChange={handleFileSelect} className="hidden" />
// 						<div className={`px-4 py-4 rounded-xl border-2 border-dashed text-center transition-all ${file ? "border-solid" : ""}`}
// 							style={{
// 								borderColor: file ? T.accent : isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1",
// 								background: file ? (isDark ? "rgba(245,158,11,0.05)" : "rgba(37,99,235,0.03)") : "transparent",
// 							}}>
// 							{file ? (
// 								<div className="flex items-center justify-center gap-2">
// 									<CheckCircle size={18} style={{ color: T.accent }} />
// 									<span className="text-sm font-medium" style={{ color: T.accent }}>{file.name}</span>
// 									<span className="text-xs" style={{ color: T.muted }}>({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
// 								</div>
// 							) : (
// 								<div className="space-y-1">
// 									<Upload size={24} className="mx-auto" style={{ color: T.muted }} />
// 									<span className="text-sm font-medium block" style={{ color: T.text }}>Click to select APK file</span>
// 									<span className="text-xs block" style={{ color: T.muted }}>Will be uploaded to GitHub Releases</span>
// 								</div>
// 							)}
// 						</div>
// 					</label>
// 				</div>

// 				{/* Progress */}
// 				<AnimatePresence>
// 					{uploadProgress > 0 && (
// 						<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
// 							<div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }}>
// 								<motion.div className="h-full rounded-full" style={{ background: T.accent }}
// 									initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
// 							</div>
// 							<p className="text-xs text-center mt-1" style={{ color: T.muted }}>
// 								{uploadProgress === 100 ? "Upload complete!" : "Uploading to GitHub..."}
// 							</p>
// 						</motion.div>
// 					)}
// 				</AnimatePresence>

// 				{/* Upload Button */}
// 				<button
// 					onClick={handleUpload}
// 					disabled={!file || loading}
// 					className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
// 					style={{
// 						background: T.accent,
// 						color: isDark ? "#000" : "#fff",
// 						boxShadow: `0 4px 20px ${isDark ? "rgba(245,158,11,0.3)" : "rgba(37,99,235,0.25)"}`,
// 					}}
// 				>
// 					{loading ? (
// 						<>
// 							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
// 							Publishing to GitHub...
// 						</>
// 					) : (
// 						<>
// 							<FaGithub size={16} />
// 							Release v{major}.{minor}.{patch} on GitHub
// 						</>
// 					)}
// 				</button>

// 				{/* Version History */}
// 				{versions.length > 0 && (
// 					<div className="pt-4 border-t" style={{ borderColor: T.border }}>
// 						<h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: T.muted }}>
// 							Published Releases
// 						</h4>
// 						<div className="space-y-2">
// 							{versions.map((v) => (
// 								<div key={v.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
// 									style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
// 									<span className="text-sm font-mono font-bold" style={{ color: T.text }}>v{v.version_string}</span>
// 									<span className="text-xs" style={{ color: T.muted }}>
// 										{new Date(v.created_at).toLocaleDateString()}
// 									</span>
// 									<a href={v.apk_url} target="_blank" rel="noopener noreferrer"
// 										className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: T.accent }}>
// 										<ExternalLink size={14} />
// 									</a>
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 		</motion.div>
// 	);
// }














"use client";

/**
 * AdminReleaseManager.tsx — REDESIGNED for
 * D:\csc-platform\src\components\landing\AdminReleaseManager.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: AdminReleaseManager({ isDark }: { isDark: boolean }).
 *
 * This is an ADMIN-ONLY tool, not a public page — it renders nothing
 * unless the signed-in Supabase user is the admin, and it only ever
 * shows to that one person. So the design is a plain admin form, not
 * a showcase: a bordered card with a header, three version fields,
 * release notes, an APK picker, a progress bar, a publish button and
 * the version history. No motion, no glow, no gradients.
 *
 * KEPT, exactly as supplied — every line of behaviour:
 * - Admin gate: Supabase auth user, email compared to ADMIN_EMAIL
 *   (see the TODO below — this is a client-side check, move it to a
 *   server-side role check when you can).
 * - fetchVersions: Supabase table "app_versions", latest 10, newest
 *   first, shown with version, date and a link to the APK.
 * - File select: only .apk files; the version fields auto-fill from
 *   a filename like app-v1.2.3.apk.
 * - Upload: builds the version string, the FormData (file, version,
 *   releaseNotes with the default `SriLal CSC vX.Y.Z`), clears the
 *   form, sets progress to 100, refetches versions, resets progress
 *   after 2s, and alerts on failure.
 *
 * READ THIS — the upload is currently a no-op, and the original hid
 * that: the server action call (createGitHubRelease) is commented
 * out, and the progress bar is fake (it jumps to 30, then to 100,
 * while nothing is uploaded). This file keeps that behaviour exactly
 * as supplied — I did not wire up an upload that does not exist in
 * your project — but it now says so in the panel itself (the amber
 * note under the header), so nobody mistakes "Upload complete!" for
 * a real publish. To make it real: uncomment the createGitHubRelease
 * import and call in handleUpload, and make sure
 * @/app/actions/releases exists and does the GitHub + DB write.
 *
 * REMOVED: framer-motion (entrance + AnimatePresence progress),
 * the inline theme object, the hover scale on the button, the box
 * shadow, and unused imports (useCallback, Package, FileCode,
 * Trash2, AlertCircle) and the unused githubReleases state.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useState, useEffect } from "react";
import {
  Upload,
  Tag,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
// import { createGitHubRelease, getLatestGitHubRelease, listGitHubReleases } from "@/app/actions/releases";
import { supabase } from "@/lib/supabase";
import { FaGithub } from "react-icons/fa";

// TODO: move this to a server-side role check. Anyone who can read
// this file can see the admin email; the check only hides the UI.
const ADMIN_EMAIL = "rm0644320@gmail.com";

interface AppVersion {
  id: string;
  version_string: string;
  apk_url: string;
  release_notes: string | null;
  github_release_id: number | null;
  created_at: string;
}

export function AdminReleaseManager({ isDark }: { isDark: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [major, setMajor] = useState("1");
  const [minor, setMinor] = useState("0");
  const [patch, setPatch] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [releaseNotes, setReleaseNotes] = useState("");

  // Keep the parent's isDark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    // Check admin status
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        fetchVersions();
      }
    };
    checkAdmin();
  }, []);

  const fetchVersions = async () => {
    const { data } = await supabase
      .from("app_versions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setVersions(data as AppVersion[]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith(".apk")) {
      setFile(selected);
      const match = selected.name.match(/v?(\d+)\.(\d+)\.(\d+)/);
      if (match) {
        setMajor(match[1]);
        setMinor(match[2]);
        setPatch(match[3]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadProgress(30); // Fake progress for UX

    try {
      const versionString = `${major}.${minor}.${patch}`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("version", versionString);
      formData.append("releaseNotes", releaseNotes || `SriLal CSC v${versionString}`);

      // await createGitHubRelease(formData); // Server does GitHub + DB

      setFile(null);
      setReleaseNotes("");
      setUploadProgress(100);
      await fetchVersions();
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
  const labelCls =
    "mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400";

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white font-sans dark:border-slate-700 dark:bg-[#111a2e]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <FaGithub size={20} className="text-blue-700 dark:text-blue-400" />
        <div>
          <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">
            GitHub Releases Manager
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload APKs to GitHub Releases — unlimited free bandwidth
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Not wired up yet — admin-only warning */}
        <p className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Upload is not wired up yet: the server action
          (createGitHubRelease) is commented out in the code, so this
          button clears the form without publishing anything. Uncomment
          it once @/app/actions/releases exists.
        </p>

        {/* Version Inputs */}
        <div>
          <label className={labelCls}>Version Number</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Major", value: major, setter: setMajor },
              { label: "Minor", value: minor, setter: setMinor },
              { label: "Patch", value: patch, setter: setPatch },
            ].map((field) => (
              <div key={field.label} className="relative">
                <Tag
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="number"
                  min="0"
                  aria-label={field.label}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className={`${inputCls} pl-9 font-mono font-bold`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Release Notes */}
        <div>
          <label className={labelCls} htmlFor="arm-notes">
            Release Notes
          </label>
          <textarea
            id="arm-notes"
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            placeholder="What's new in this version..."
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className={labelCls}>APK File (max 2GB on GitHub)</label>
          <label className="block cursor-pointer">
            <input type="file" accept=".apk" onChange={handleFileSelect} className="hidden" />
            <div
              className={`rounded-xl border-2 px-4 py-4 text-center ${
                file
                  ? "border-solid border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                  : "border-dashed border-slate-300 dark:border-slate-600"
              }`}
            >
              {file ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <CheckCircle size={18} className="text-blue-700 dark:text-blue-400" aria-hidden />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{file.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload size={24} className="mx-auto text-slate-400" aria-hidden />
                  <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Click to select APK file
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    Will be uploaded to GitHub Releases
                  </span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Progress */}
        {uploadProgress > 0 && (
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-700 transition-[width] duration-300 dark:bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
              {uploadProgress === 100 ? "Upload complete!" : "Uploading to GitHub..."}
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
              Publishing to GitHub...
            </>
          ) : (
            <>
              <FaGithub size={16} aria-hidden />
              Release v{major}.{minor}.{patch} on GitHub
            </>
          )}
        </button>

        {/* Version History */}
        {versions.length > 0 && (
          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <h4 className={labelCls}>Published Releases</h4>
            <div className="space-y-2">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60"
                >
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    v{v.version_string}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(v.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href={v.apk_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download v${v.version_string}`}
                    className="ml-auto rounded-lg p-1.5 text-blue-700 hover:bg-slate-200 dark:text-blue-400 dark:hover:bg-slate-700"
                  >
                    <ExternalLink size={14} aria-hidden />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
