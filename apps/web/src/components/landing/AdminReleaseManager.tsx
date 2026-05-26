"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Upload, Package, Tag, FileCode,
	ExternalLink, Trash2, CheckCircle, AlertCircle
} from "lucide-react";
// import { createGitHubRelease, getLatestGitHubRelease, listGitHubReleases } from "@/app/actions/releases";
import { supabase } from "@/lib/supabase";
import { FaGithub } from "react-icons/fa";

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
	const [githubReleases, setGithubReleases] = useState<any[]>([]);

	const T = isDark ? {
		bg: "rgba(245,158,11,0.05)",
		border: "rgba(245,158,11,0.2)",
		accent: "#f59e0b",
		text: "#f1f5f9",
		muted: "rgba(255,255,255,0.4)",
	} : {
		bg: "rgba(37,99,235,0.03)",
		border: "rgba(37,99,235,0.15)",
		accent: "#2563eb",
		text: "#1e293b",
		muted: "#64748b",
	};

	useEffect(() => {
		// Check admin status
		const checkAdmin = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (user?.email === "rm0644320@gmail.com") {
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.8 }}
			className="mt-8 rounded-2xl border overflow-hidden"
			style={{ background: T.bg, borderColor: T.border }}
		>
			{/* Header */}
			<div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: T.border }}>
				<FaGithub size={20} style={{ color: T.accent }} />
				<div>
					<h3 className="font-bold text-sm" style={{ color: T.accent }}>
						GitHub Releases Manager
					</h3>
					<p className="text-xs" style={{ color: T.muted }}>
						Upload APKs to GitHub Releases — unlimited free bandwidth
					</p>
				</div>
			</div>

			<div className="p-5 space-y-5">
				{/* Version Inputs */}
				<div>
					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
						Version Number
					</label>
					<div className="grid grid-cols-3 gap-3">
						{[
							{ label: "Major", value: major, setter: setMajor },
							{ label: "Minor", value: minor, setter: setMinor },
							{ label: "Patch", value: patch, setter: setPatch },
						].map((field) => (
							<div key={field.label} className="relative">
								<Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
								<input
									type="number"
									min="0"
									value={field.value}
									onChange={(e) => field.setter(e.target.value)}
									className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-mono font-bold border outline-none"
									style={{
										background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
										borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
										color: T.text,
									}}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Release Notes */}
				<div>
					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
						Release Notes
					</label>
					<textarea
						value={releaseNotes}
						onChange={(e) => setReleaseNotes(e.target.value)}
						placeholder="What's new in this version..."
						rows={2}
						className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
						style={{
							background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
							borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
							color: T.text,
						}}
					/>
				</div>

				{/* File Upload */}
				<div>
					<label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: T.muted }}>
						APK File (max 2GB on GitHub)
					</label>
					<label className="block cursor-pointer">
						<input type="file" accept=".apk" onChange={handleFileSelect} className="hidden" />
						<div className={`px-4 py-4 rounded-xl border-2 border-dashed text-center transition-all ${file ? "border-solid" : ""}`}
							style={{
								borderColor: file ? T.accent : isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1",
								background: file ? (isDark ? "rgba(245,158,11,0.05)" : "rgba(37,99,235,0.03)") : "transparent",
							}}>
							{file ? (
								<div className="flex items-center justify-center gap-2">
									<CheckCircle size={18} style={{ color: T.accent }} />
									<span className="text-sm font-medium" style={{ color: T.accent }}>{file.name}</span>
									<span className="text-xs" style={{ color: T.muted }}>({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
								</div>
							) : (
								<div className="space-y-1">
									<Upload size={24} className="mx-auto" style={{ color: T.muted }} />
									<span className="text-sm font-medium block" style={{ color: T.text }}>Click to select APK file</span>
									<span className="text-xs block" style={{ color: T.muted }}>Will be uploaded to GitHub Releases</span>
								</div>
							)}
						</div>
					</label>
				</div>

				{/* Progress */}
				<AnimatePresence>
					{uploadProgress > 0 && (
						<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
							<div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }}>
								<motion.div className="h-full rounded-full" style={{ background: T.accent }}
									initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
							</div>
							<p className="text-xs text-center mt-1" style={{ color: T.muted }}>
								{uploadProgress === 100 ? "Upload complete!" : "Uploading to GitHub..."}
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Upload Button */}
				<button
					onClick={handleUpload}
					disabled={!file || loading}
					className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
					style={{
						background: T.accent,
						color: isDark ? "#000" : "#fff",
						boxShadow: `0 4px 20px ${isDark ? "rgba(245,158,11,0.3)" : "rgba(37,99,235,0.25)"}`,
					}}
				>
					{loading ? (
						<>
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Publishing to GitHub...
						</>
					) : (
						<>
							<FaGithub size={16} />
							Release v{major}.{minor}.{patch} on GitHub
						</>
					)}
				</button>

				{/* Version History */}
				{versions.length > 0 && (
					<div className="pt-4 border-t" style={{ borderColor: T.border }}>
						<h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: T.muted }}>
							Published Releases
						</h4>
						<div className="space-y-2">
							{versions.map((v) => (
								<div key={v.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
									style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
									<span className="text-sm font-mono font-bold" style={{ color: T.text }}>v{v.version_string}</span>
									<span className="text-xs" style={{ color: T.muted }}>
										{new Date(v.created_at).toLocaleDateString()}
									</span>
									<a href={v.apk_url} target="_blank" rel="noopener noreferrer"
										className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: T.accent }}>
										<ExternalLink size={14} />
									</a>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
}