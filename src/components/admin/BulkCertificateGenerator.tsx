"use client";

import React, { useState, useRef, useCallback } from "react";
import { uploadBulkExcelAction } from "@/app/actions/certificates";

type ExcelRow = {
	roll_no: string;
	student_name: string;
	father_name: string;
	mother_name: string;
	course_name: string;
	grade: string;
	email: string;
	mobile: string;
};

export default function BulkCertificateGenerator({ isDark }: { isDark: boolean }) {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<ExcelRow[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;

		setError(null);
		setSuccess(null);
		setPreview([]);
		setFile(null);

		// Strict Excel-only check
		const valid =
			f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			f.type === "application/vnd.ms-excel" ||
			f.type === "text/csv" ||
			f.name.endsWith(".xlsx") ||
			f.name.endsWith(".xls") ||
			f.name.endsWith(".csv");

		if (!valid) {
			alert("⚠️ Only Excel files are allowed (.xlsx, .xls, .csv)");
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		setFile(f);

		try {
			const XLSX = await import("xlsx");
			const ab = await f.arrayBuffer();
			const wb = XLSX.read(ab, { type: "array" });
			const ws = wb.Sheets[wb.SheetNames[0]];
			const json = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

			//   if (json.length < 2) {
			//     setError("Excel file appears empty (no data rows found).");
			//     return;
			//   }

			//   const rows: ExcelRow[] = json
			//     .slice(1)
			//     .map((row: any[]) => {
			//       const r = row || [];
			//       return {
			//         roll_no: String(r[0] ?? "").trim(),
			//         student_name: String(r[1] ?? "").trim(),
			//         father_name: String(r[2] ?? "").trim(),
			//         mother_name: String(r[3] ?? "").trim(),
			//         course_name: String(r[4] ?? "").trim(),
			//         grade: String(r[5] ?? "").trim(),
			//         email: String(r[6] ?? "").trim(),
			//         mobile: String(r[7] ?? "").trim(),
			//       };
			//     })
			//     .filter((r) => r.roll_no || r.student_name);

			if (json.length === 0) {
				setError("Excel file is empty.");
				return;
			}

			// detect whether first row is header row
			const firstRow = (json[0] || []).map((x) =>
				String(x).trim().toLowerCase()
			);

			const looksLikeHeader =
				firstRow.includes("roll no") ||
				firstRow[0].startsWith("roll") ||
				firstRow.includes("student") ||
				firstRow.includes("student name");

			const dataRows = looksLikeHeader ? json.slice(1) : json;

			const rows: ExcelRow[] = dataRows
				.map((row: any[]) => {
					const r = row || [];

					return {
						roll_no: String(r[0] ?? "").trim(),
						student_name: String(r[1] ?? "").trim(),
						father_name: String(r[2] ?? "").trim(),
						mother_name: String(r[3] ?? "").trim(),
						course_name: String(r[4] ?? "").trim(),
						grade: String(r[5] ?? "").trim(),
						email: String(r[6] ?? "").trim(),
						mobile: String(r[7] ?? "").trim(),
					};
				})
				.filter((r) => r.roll_no || r.student_name);

			if (rows.length === 0) {
				setError("Excel file appears empty (no valid rows found).");
				return;
			}

			const badRows: number[] = [];
			rows.forEach((r, i) => {
				if (!r.roll_no || !r.student_name || !r.course_name) badRows.push(i + 2);
				else if (!r.email && !r.mobile) badRows.push(i + 2);
			});

			if (badRows.length > 0) {
				setError(
					`Rows ${badRows.join(", ")} are missing required fields. ` +
					"Every row needs: Roll No, Student Name, Course Name, and at least Email OR Mobile."
				);
				setPreview(rows);
				return;
			}

			setPreview(rows);
		} catch (err: any) {
			setError("Failed to parse Excel: " + (err?.message || "Unknown error"));
		}
	}, []);

	const handleSubmit = async () => {
		if (preview.length === 0) return;
		setIsUploading(true);
		setError(null);
		try {
			await uploadBulkExcelAction(preview);
			setSuccess(`✅ Successfully uploaded ${preview.length} student records!`);
			setFile(null);
			setPreview([]);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (err: any) {
			setError(err?.message || "Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const inputBase: React.CSSProperties = {
		width: "100%",
		padding: "12px 14px",
		borderRadius: 8,
		background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
		border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
		color: isDark ? "#f8fafc" : "#1e293b",
		fontSize: 14,
		outline: "none",
		boxSizing: "border-box",
		fontFamily: "'DM Sans',sans-serif",
		marginBottom: 14,
	};

	return (
		<div style={{ padding: "10px 0" }}>
			<h3
				style={{
					fontSize: 16,
					fontWeight: 700,
					marginBottom: 16,
					color: isDark ? "#f8fafc" : "#1e293b",
				}}
			>
				📁 Bulk Certificate Upload (Excel Only)
			</h3>

			<div
				style={{
					border: `2px dashed ${error ? "#ef4444" : isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1"}`,
					borderRadius: 12,
					padding: "28px 20px",
					textAlign: "center",
					background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
					transition: "all .2s",
					cursor: "pointer",
					marginBottom: 20,
				}}
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept=".xlsx,.xls,.csv"
					style={{ display: "none" }}
					onChange={handleFileChange}
				/>
				<div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
				<div
					style={{
						fontSize: 14,
						fontWeight: 700,
						color: isDark ? "#f8fafc" : "#1e293b",
					}}
				>
					{file ? file.name : "Click to upload Excel file"}
				</div>
				<div
					style={{
						fontSize: 12,
						color: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8",
						marginTop: 4,
					}}
				>
					Columns: Roll No | Student | Father | Mother | Course | Grade | Email | Mobile
				</div>
			</div>

			{error && (
				<div
					style={{
						background: isDark ? "rgba(239,68,68,0.1)" : "#fef2f2",
						border: "1px solid #fecaca",
						borderRadius: 8,
						padding: 12,
						marginBottom: 16,
						color: "#ef4444",
						fontSize: 13,
						fontWeight: 600,
					}}
				>
					⚠️ {error}
				</div>
			)}

			{success && (
				<div
					style={{
						background: isDark ? "rgba(21,128,61,0.1)" : "#f0fdf4",
						border: "1px solid #86efac",
						borderRadius: 8,
						padding: 12,
						marginBottom: 16,
						color: "#15803d",
						fontSize: 13,
						fontWeight: 600,
					}}
				>
					{success}
				</div>
			)}

			{preview.length > 0 && (
				<div style={{ marginBottom: 20 }}>
					<div
						style={{
							fontSize: 13,
							fontWeight: 700,
							marginBottom: 10,
							color: isDark ? "#f8fafc" : "#1e293b",
						}}
					>
						Preview ({preview.length} students)
					</div>
					<div
						style={{
							overflowX: "auto",
							border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
							borderRadius: 10,
						}}
					>
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: 12,
							}}
						>
							<thead>
								<tr
									style={{
										background: isDark ? "rgba(245,158,11,0.1)" : "#eff6ff",
									}}
								>
									{["Roll No", "Student", "Father", "Mother", "Course", "Grade", "Email", "Mobile"].map(
										(h) => (
											<th
												key={h}
												style={{
													padding: "10px 12px",
													textAlign: "left",
													borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
													color: isDark ? "#f59e0b" : "#1d4ed8",
													fontWeight: 700,
													whiteSpace: "nowrap",
												}}
											>
												{h}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody>
								{preview.map((row, i) => (
									<tr
										key={i}
										style={{
											borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
										}}
									>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "#f8fafc" : "#1e293b",
												fontWeight: 600,
											}}
										>
											{row.roll_no}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "#f8fafc" : "#1e293b",
											}}
										>
											{row.student_name}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
											}}
										>
											{row.father_name || "—"}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
											}}
										>
											{row.mother_name || "—"}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "#f8fafc" : "#1e293b",
												fontWeight: 600,
											}}
										>
											{row.course_name}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
											}}
										>
											{row.grade || "—"}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
											}}
										>
											{row.email || "—"}
										</td>
										<td
											style={{
												padding: "8px 12px",
												color: isDark ? "rgba(255,255,255,0.6)" : "#475569",
											}}
										>
											{row.mobile || "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<button
				onClick={handleSubmit}
				disabled={isUploading || preview.length === 0}
				style={{
					width: "100%",
					padding: "12px",
					background: isDark
						? "linear-gradient(135deg, #f59e0b, #d97706)"
						: "linear-gradient(135deg, #2563eb, #1d4ed8)",
					color: isDark ? "#000" : "#fff",
					border: "none",
					borderRadius: 8,
					fontWeight: 800,
					cursor: isUploading || preview.length === 0 ? "not-allowed" : "pointer",
					transition: "opacity 0.2s",
					opacity: isUploading || preview.length === 0 ? 0.6 : 1,
					fontFamily: "'DM Sans',sans-serif",
				}}
			>
				{isUploading
					? "Uploading to Database…"
					: `Upload ${preview.length} Certificate${preview.length === 1 ? "" : "s"}`}
			</button>
		</div>
	);
}