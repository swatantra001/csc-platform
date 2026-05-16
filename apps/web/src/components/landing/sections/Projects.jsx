"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useMotionValueEvent, AnimatePresence, useScroll, motion } from "framer-motion"

// ─────────────────────────────────────────────
//  Inline SVG screenshots (base64-encoded/URL-encoded)
// ─────────────────────────────────────────────
const IMG = {
	// ── CSC Hub (Replaces NexusIDE) ──
	csc_hub_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230a0e1a"/><stop offset="100%" stop-color="%230d1525"/></linearGradient><clipPath id="sc"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23sc)"><rect width="1200" height="750" fill="url(%23bg)"/><circle cx="200" cy="150" r="220" fill="%231cd8d2" fill-opacity="0.04"/><circle cx="1050" cy="620" r="200" fill="%23302b63" fill-opacity="0.25"/><rect width="1200" height="40" fill="%23080d18"/><circle cx="20" cy="20" r="6" fill="%23ff5f57"/><circle cx="40" cy="20" r="6" fill="%23ffbd2e"/><circle cx="60" cy="20" r="6" fill="%2328ca41"/><text x="90" y="26" font-size="13" fill="%231cd8d2" font-weight="bold" letter-spacing="2">CSC</text><text x="130" y="26" font-size="13" fill="%23ffffff" font-weight="300">DASHBOARD</text><rect x="200" y="8" width="110" height="24" rx="4" fill="%231cd8d2" fill-opacity="0.1" stroke="%231cd8d2" stroke-width="0.5" stroke-opacity="0.4"/><text x="215" y="24" font-size="11" fill="%231cd8d2">analytics.js</text><text x="333" y="24" font-size="11" fill="%234a5568">users.js</text><rect x="0" y="40" width="200" height="710" fill="%230f1420"/><rect x="199" y="40" width="1" height="710" fill="%231cd8d2" fill-opacity="0.08"/><text x="12" y="62" font-size="10" fill="%234a5568" letter-spacing="1.5" font-weight="bold">OPERATIONS</text><text x="12" y="84" font-size="11" fill="%236b7280">▶ Services</text><text x="24" y="100" font-size="11" fill="%239ca3af">▶ Banking</text><rect x="36" y="104" width="150" height="16" rx="2" fill="%231cd8d2" fill-opacity="0.08"/><text x="36" y="116" font-size="11" fill="%231cd8d2">  Transactions</text><text x="36" y="132" font-size="11" fill="%239ca3af">  Razorpay Sync</text><text x="12" y="390" font-size="9" fill="%234a5568" letter-spacing="1">OPERATORS (3)</text><circle cx="22" cy="410" r="10" fill="%231cd8d2" fill-opacity="0.3" stroke="%231cd8d2" stroke-width="1"/><text x="15" y="414" font-size="9" fill="%231cd8d2">SY</text><circle cx="46" cy="410" r="10" fill="%23a855f7" fill-opacity="0.3" stroke="%23a855f7" stroke-width="1"/><text x="40" y="414" font-size="9" fill="%23c084fc">E1</text><circle cx="70" cy="410" r="10" fill="%23f59e0b" fill-opacity="0.3" stroke="%23f59e0b" stroke-width="1"/><text x="64" y="414" font-size="9" fill="%23fbbf24">E2</text><rect x="200" y="40" width="1000" height="710" fill="%230b1120"/><rect x="240" y="80" width="250" height="120" rx="8" fill="%23111827" stroke="%231cd8d2" stroke-width="0.5" stroke-opacity="0.5"/><text x="260" y="110" font-size="14" fill="%239ca3af">Daily Visitors (Shambhuganj)</text><text x="260" y="150" font-size="36" fill="%231cd8d2" font-weight="bold">142</text><text x="260" y="180" font-size="12" fill="%2310b981">▲ 12% from yesterday</text><rect x="520" y="80" width="250" height="120" rx="8" fill="%23111827" stroke="%23a855f7" stroke-width="0.5" stroke-opacity="0.5"/><text x="540" y="110" font-size="14" fill="%239ca3af">Total Revenue (Razorpay + Cash)</text><text x="540" y="150" font-size="36" fill="%23a855f7" font-weight="bold">₹8,450</text><text x="540" y="180" font-size="12" fill="%2310b981">▲ Secure</text><rect x="240" y="240" width="800" height="350" rx="8" fill="%23111827" stroke="%23ffffff" stroke-width="0.3" stroke-opacity="0.1"/><text x="260" y="280" font-size="18" fill="%23e2e8f0" font-weight="bold">Recent Service Requests</text><line x1="240" y1="300" x2="1040" y2="300" stroke="%23374151" stroke-width="1"/><text x="260" y="330" font-size="14" fill="%239ca3af">Service Type</text><text x="500" y="330" font-size="14" fill="%239ca3af">Customer</text><text x="700" y="330" font-size="14" fill="%239ca3af">Operator</text><text x="900" y="330" font-size="14" fill="%239ca3af">Status</text><text x="260" y="370" font-size="14" fill="%23e2e8f0">Aadhaar Print</text><text x="500" y="370" font-size="14" fill="%23e2e8f0">Ramesh K.</text><text x="700" y="370" font-size="14" fill="%23e2e8f0">Emp 1</text><text x="900" y="370" font-size="14" fill="%2310b981">Completed</text><text x="260" y="410" font-size="14" fill="%23e2e8f0">PAN Application</text><text x="500" y="410" font-size="14" fill="%23e2e8f0">Suresh M.</text><text x="700" y="410" font-size="14" fill="%23e2e8f0">Shrilal Y.</text><text x="900" y="410" font-size="14" fill="%23f59e0b">Processing</text><text x="260" y="450" font-size="14" fill="%23e2e8f0">Income Certificate</text><text x="500" y="450" font-size="14" fill="%23e2e8f0">Amit T.</text><text x="700" y="450" font-size="14" fill="%23e2e8f0">Emp 2</text><text x="900" y="450" font-size="14" fill="%23f59e0b">Processing</text><rect x="0" y="730" width="1200" height="20" fill="%23080d18"/><text x="10" y="743" font-size="9" fill="%231cd8d2">● Center Open (9AM - 9PM)</text><text x="150" y="743" font-size="9" fill="%234a5568">Chakpataila &amp; Shambhuganj Connected</text></g></svg>`,
	csc_hub_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="mbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230a0e1a"/><stop offset="100%" stop-color="%230d1525"/></linearGradient><clipPath id="mclip"><rect width="400" height="700" rx="10"/></clipPath></defs><g clip-path="url(%23mclip)"><rect width="400" height="700" fill="url(%23mbg)"/><circle cx="80" cy="100" r="120" fill="%231cd8d2" fill-opacity="0.04"/><rect width="400" height="44" fill="%23080d18"/><text x="20" y="27" font-size="12" fill="%231cd8d2" font-weight="bold">CSC HUB</text><rect x="20" y="80" width="360" height="100" rx="8" fill="%23111827" stroke="%231cd8d2" stroke-width="0.5"/><text x="40" y="110" font-size="12" fill="%239ca3af">Daily Visitors</text><text x="40" y="145" font-size="30" fill="%231cd8d2" font-weight="bold">142</text><rect x="20" y="200" width="360" height="100" rx="8" fill="%23111827" stroke="%23a855f7" stroke-width="0.5"/><text x="40" y="230" font-size="12" fill="%239ca3af">Revenue (Razorpay)</text><text x="40" y="265" font-size="30" fill="%23a855f7" font-weight="bold">₹8,450</text><rect x="20" y="320" width="360" height="250" rx="8" fill="%23111827"/><text x="40" y="350" font-size="14" fill="%23e2e8f0" font-weight="bold">Recent Tasks</text><line x1="20" y1="365" x2="380" y2="365" stroke="%23374151" stroke-width="1"/><text x="40" y="390" font-size="12" fill="%23e2e8f0">PAN Application</text><text x="300" y="390" font-size="12" fill="%23f59e0b">Processing</text><text x="40" y="430" font-size="12" fill="%23e2e8f0">Aadhaar Print</text><text x="300" y="430" font-size="12" fill="%2310b981">Completed</text><rect x="0" y="670" width="400" height="30" fill="%23080d18"/><text x="20" y="688" font-size="10" fill="%231cd8d2">● Operators Active: 3</text></g></svg>`,

	// ── CSC Banking (Replaces SmartAttend) ──
	csc_banking_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="dbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230a0f1e"/><stop offset="100%" stop-color="%230c1428"/></linearGradient><clipPath id="dclip"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23dclip)"><rect width="1200" height="750" fill="url(%23dbg)"/><circle cx="600" cy="300" r="400" fill="%2300bf8f" fill-opacity="0.02"/><rect x="0" y="0" width="220" height="750" fill="%2306090f"/><text x="32" y="36" font-size="16" fill="%2300bf8f" font-weight="bold">Aadhaar Bank</text><text x="32" y="52" font-size="10" fill="%234a5568">Multi-Bank Ecosystem</text><rect x="10" y="84" width="200" height="36" rx="8" fill="%2300bf8f" fill-opacity="0.1" stroke="%2300bf8f" stroke-width="0.5"/><text x="30" y="107" font-size="12" fill="%2300bf8f">🏦 Dashboard</text><text x="30" y="143" font-size="12" fill="%234a5568">💸 Cash Exchange</text><text x="30" y="199" font-size="12" fill="%234a5568">📱 Airtel Bank</text><text x="30" y="227" font-size="12" fill="%234a5568">📮 India Post Bank</text><rect x="220" y="0" width="980" height="56" fill="%2308101e"/><text x="240" y="24" font-size="16" fill="%23e2e8f0" font-weight="bold">Banking Overview</text><text x="240" y="42" font-size="11" fill="%234a5568">Fino Payment Bank · Live Transactions</text><rect x="240" y="76" width="210" height="100" rx="12" fill="%230d2d22" stroke="%2300bf8f" stroke-width="0.5" stroke-opacity="0.3"/><text x="258" y="100" font-size="11" fill="%234a5568">Daily Cash Handled</text><text x="258" y="130" font-size="32" fill="%2300bf8f" font-weight="bold">₹42,500</text><rect x="464" y="76" width="210" height="100" rx="12" fill="%231a0d2e" stroke="%23a855f7" stroke-width="0.5" stroke-opacity="0.3"/><text x="482" y="100" font-size="11" fill="%234a5568">New Accounts Opened</text><text x="482" y="130" font-size="32" fill="%23a855f7" font-weight="bold">14</text><rect x="688" y="76" width="210" height="100" rx="12" fill="%232d1a00" stroke="%23f59e0b" stroke-width="0.5" stroke-opacity="0.3"/><text x="706" y="100" font-size="11" fill="%234a5568">UPI Transfers</text><text x="706" y="130" font-size="32" fill="%23f59e0b" font-weight="bold">86</text><rect x="240" y="196" width="900" height="400" rx="12" fill="%2308101e" stroke="%23ffffff" stroke-width="0.3" stroke-opacity="0.06"/><text x="258" y="230" font-size="14" fill="%23e2e8f0" font-weight="bold">Recent Bank Transactions</text><rect x="248" y="250" width="880" height="40" rx="6" fill="%23ffffff" fill-opacity="0.05"/><text x="260" y="275" font-size="12" fill="%234a5568" font-weight="bold">BANK</text><text x="450" y="275" font-size="12" fill="%234a5568" font-weight="bold">TYPE</text><text x="650" y="275" font-size="12" fill="%234a5568" font-weight="bold">AMOUNT</text><text x="850" y="275" font-size="12" fill="%234a5568" font-weight="bold">STATUS</text><text x="260" y="320" font-size="12" fill="%23e2e8f0">Fino Payment Bank</text><text x="450" y="320" font-size="12" fill="%23e2e8f0">Cash Withdrawal (AEPS)</text><text x="650" y="320" font-size="12" fill="%2300bf8f">₹5,000</text><text x="850" y="320" font-size="12" fill="%2300bf8f">✔ Success</text><text x="260" y="370" font-size="12" fill="%23e2e8f0">Airtel Payment Bank</text><text x="450" y="370" font-size="12" fill="%23e2e8f0">Account Opening</text><text x="650" y="370" font-size="12" fill="%23a855f7">N/A</text><text x="850" y="370" font-size="12" fill="%2300bf8f">✔ Success</text><text x="260" y="420" font-size="12" fill="%23e2e8f0">India Post Payment Bank</text><text x="450" y="420" font-size="12" fill="%23e2e8f0">UPI Cash Exchange</text><text x="650" y="420" font-size="12" fill="%23f59e0b">₹2,500</text><text x="850" y="420" font-size="12" fill="%2300bf8f">✔ Success</text></g></svg>`,
	csc_banking_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="smbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230a0f1e"/><stop offset="100%" stop-color="%23060b14"/></linearGradient><clipPath id="smclip"><rect width="400" height="700" rx="10"/></clipPath></defs><g clip-path="url(%23smclip)"><rect width="400" height="700" fill="url(%23smbg)"/><rect width="400" height="28" fill="%23060b14"/><rect x="0" y="28" width="400" height="56" fill="%2308101e"/><text x="20" y="52" font-size="15" fill="%2300bf8f" font-weight="bold">Aadhaar Bank</text><text x="20" y="68" font-size="10" fill="%234a5568">Fino &amp; Airtel Partner</text><rect x="14" y="96" width="372" height="80" rx="12" fill="%230d2d22" stroke="%2300bf8f" stroke-width="0.5"/><text x="28" y="120" font-size="14" fill="%23e2e8f0" font-weight="bold">Cash Available: ₹85,000</text><text x="28" y="138" font-size="11" fill="%234a5568">Ready for AEPS / UPI Exchange</text><rect x="28" y="148" width="120" height="20" rx="10" fill="%2300bf8f"/><text x="38" y="162" font-size="9" fill="%23000" font-weight="bold">New Txn ➔</text><rect x="14" y="210" width="372" height="72" rx="10" fill="%230d2d22" stroke="%2300bf8f" stroke-width="1"/><text x="28" y="230" font-size="12" fill="%23e2e8f0" font-weight="bold">Fino Payment Bank</text><text x="28" y="246" font-size="10" fill="%234a5568">Account Opening Active</text><rect x="300" y="220" width="72" height="22" rx="11" fill="%2300bf8f" fill-opacity="0.15" stroke="%2300bf8f" stroke-width="0.5"/><text x="308" y="235" font-size="9" fill="%2300bf8f">● LIVE NOW</text><rect x="14" y="300" width="372" height="72" rx="10" fill="%231a0d2e" stroke="%23a855f7" stroke-width="1"/><text x="28" y="320" font-size="12" fill="%23e2e8f0" font-weight="bold">Airtel Payment Bank</text><text x="28" y="336" font-size="10" fill="%234a5568">AEPS Withdrawals</text></g></svg>`,

	// ── Transaction Tracker (Replaces payScan) ──
	payscan_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230a1628"/><stop offset="100%" stop-color="%230e1f3a"/></linearGradient><linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%237c3aed"/></linearGradient><clipPath id="pc"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23pc)"><rect width="1200" height="750" fill="url(%23pbg)"/><circle cx="900" cy="150" r="300" fill="%234f46e5" fill-opacity="0.06"/><circle cx="200" cy="600" r="200" fill="%237c3aed" fill-opacity="0.05"/><rect width="1200" height="56" fill="%23060f22"/><circle cx="20" cy="28" r="6" fill="%23ff5f57"/><circle cx="40" cy="28" r="6" fill="%23ffbd2e"/><circle cx="60" cy="28" r="6" fill="%2328ca41"/><text x="90" y="32" font-size="16" fill="%234f46e5" font-weight="bold" letter-spacing="1">CSC</text><text x="125" y="32" font-size="16" fill="%237c3aed" font-weight="bold">Ledger</text><rect x="200" y="12" width="110" height="32" rx="16" fill="%234f46e5" fill-opacity="0.1" stroke="%234f46e5" stroke-width="0.5"/><text x="215" y="32" font-size="11" fill="%234f46e5">📷 Scan Bill</text><text x="330" y="32" font-size="11" fill="%234a5568">📊 Transactions</text><text x="450" y="32" font-size="11" fill="%234a5568">📈 Analytics</text><circle cx="1150" cy="28" r="18" fill="%234f46e5" fill-opacity="0.15" stroke="%234f46e5" stroke-width="1"/><text x="1145" y="32" font-size="9" fill="%234f46e5">SY</text><rect x="24" y="72" width="460" height="620" rx="16" fill="%230d1a35" stroke="%234f46e5" stroke-width="0.5" stroke-opacity="0.3"/><text x="44" y="100" font-size="13" fill="%23e2e8f0" font-weight="bold">📷 Receipt Scanner</text><text x="44" y="116" font-size="10" fill="%234a5568">AI-powered OCR for Cash Flow</text><rect x="60" y="130" width="390" height="280" rx="12" fill="%23060f22" stroke="%234f46e5" stroke-width="1"/><rect x="80" y="150" width="350" height="240" rx="8" fill="%230a1628"/><rect x="140" y="165" width="210" height="210" rx="4" fill="%23fff" fill-opacity="0.95"/><text x="155" y="190" font-size="9" fill="%23333" font-weight="bold">TRANSACTION RECEIPT</text><line x1="155" y1="195" x2="335" y2="195" stroke="%23ccc" stroke-width="0.5"/><text x="155" y="210" font-size="8" fill="%23555">PAN Application Fee</text><text x="295" y="210" font-size="8" fill="%23333" text-anchor="end">₹150</text><text x="155" y="222" font-size="8" fill="%23555">Aadhaar Print</text><text x="295" y="222" font-size="8" fill="%23333" text-anchor="end">₹30</text><text x="155" y="234" font-size="8" fill="%23555">Lamination</text><text x="295" y="234" font-size="8" fill="%23333" text-anchor="end">₹20</text><text x="155" y="246" font-size="8" fill="%23555">Photo Copies</text><text x="295" y="246" font-size="8" fill="%23333" text-anchor="end">₹10</text><line x1="155" y1="252" x2="335" y2="252" stroke="%23ccc" stroke-width="0.5"/><text x="155" y="265" font-size="8" fill="%23555">Subtotal</text><text x="295" y="265" font-size="8" fill="%23333" text-anchor="end">₹210</text><text x="155" y="277" font-size="8" fill="%23555">Platform Fee</text><text x="295" y="277" font-size="8" fill="%23333" text-anchor="end">₹5</text><text x="155" y="293" font-size="10" fill="%23000" font-weight="bold">TOTAL</text><text x="295" y="293" font-size="10" fill="%23000" font-weight="bold" text-anchor="end">₹215</text><text x="155" y="308" font-size="7" fill="%23888">CSC Center, Shambhuganj</text><text x="155" y="320" font-size="7" fill="%23888">15 Mar 2025 · Operator 1</text><rect x="80" y="150" width="350" height="240" rx="8" fill="%234f46e5" fill-opacity="0.04"/><polyline points="80,150 80,175 105,175" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="405,150 430,150 430,175" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="80,365 80,390 105,390" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="405,365 430,365 430,390" fill="none" stroke="%234f46e5" stroke-width="2"/><rect x="80" y="245" width="350" height="2" fill="%234f46e5" fill-opacity="0.7"/><rect x="170" y="426" width="200" height="28" rx="14" fill="%234f46e5" fill-opacity="0.15" stroke="%234f46e5" stroke-width="0.5"/><text x="195" y="444" font-size="10" fill="%234f46e5">🤖 Verifying Details...</text><text x="44" y="480" font-size="11" fill="%23e2e8f0" font-weight="bold">Detected Items</text><rect x="44" y="490" width="400" height="24" rx="6" fill="%234f46e5" fill-opacity="0.08"/><text x="56" y="506" font-size="10" fill="%23a78bfa">PAN Application Fee</text><text x="380" y="506" font-size="10" fill="%23e2e8f0" text-anchor="end">₹150</text><rect x="44" y="518" width="400" height="24" rx="6" fill="none"/><text x="56" y="534" font-size="10" fill="%23a78bfa">Aadhaar Print</text><text x="380" y="534" font-size="10" fill="%23e2e8f0" text-anchor="end">₹30</text><text x="56" y="562" font-size="10" fill="%23a78bfa">Lamination</text><text x="380" y="562" font-size="10" fill="%23e2e8f0" text-anchor="end">₹20</text><rect x="44" y="580" width="400" height="1" fill="%23ffffff" fill-opacity="0.05"/><text x="56" y="600" font-size="11" fill="%23e2e8f0" font-weight="bold">Total Detected</text><text x="380" y="600" font-size="13" fill="%234f46e5" font-weight="bold" text-anchor="end">₹215</text><rect x="44" y="618" width="190" height="36" rx="18" fill="url(%23pg)"/><text x="90" y="641" font-size="11" fill="%23fff" font-weight="bold">✓ Save Transaction</text><rect x="248" y="618" width="190" height="36" rx="18" fill="%234f46e5" fill-opacity="0.1" stroke="%234f46e5" stroke-width="0.5"/><text x="290" y="641" font-size="11" fill="%234f46e5">✏ Edit Details</text><rect x="504" y="72" width="672" height="620" rx="16" fill="%230d1a35" stroke="%237c3aed" stroke-width="0.5" stroke-opacity="0.3"/><text x="524" y="100" font-size="13" fill="%23e2e8f0" font-weight="bold">🤖 OCR Transaction Logger</text><rect x="1090" y="82" width="70" height="22" rx="11" fill="%234f46e5" fill-opacity="0.15" stroke="%234f46e5" stroke-width="0.5"/><text x="1100" y="97" font-size="9" fill="%234f46e5">Auto-filled</text><text x="524" y="135" font-size="10" fill="%234a5568">CENTER NAME</text><rect x="524" y="142" width="300" height="36" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.8"/><text x="540" y="165" font-size="12" fill="%23e2e8f0">Shambhuganj CSC</text><text x="840" y="135" font-size="10" fill="%234a5568">CATEGORY</text><rect x="840" y="142" width="300" height="36" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.8"/><text x="856" y="165" font-size="12" fill="%23a78bfa">🏛 Government Services</text><text x="524" y="205" font-size="10" fill="%234a5568">DATE &amp; TIME</text><rect x="524" y="212" width="190" height="36" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.8"/><text x="540" y="235" font-size="12" fill="%23e2e8f0">15 Mar 2025</text><text x="730" y="205" font-size="10" fill="%234a5568">TIME</text><rect x="730" y="212" width="140" height="36" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.8"/><text x="746" y="235" font-size="12" fill="%23e2e8f0">08:45 PM</text><text x="886" y="205" font-size="10" fill="%234a5568">PAYMENT MODE</text><rect x="886" y="212" width="254" height="36" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.8"/><text x="902" y="235" font-size="12" fill="%23e2e8f0">💸 Cash / UPI</text><text x="524" y="275" font-size="10" fill="%234a5568">ITEMS (4 detected)</text><rect x="524" y="282" width="616" height="130" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.5" stroke-opacity="0.4"/><text x="540" y="302" font-size="11" fill="%23e2e8f0">PAN Application Fee</text><text x="1100" y="302" font-size="11" fill="%23a78bfa" text-anchor="end">₹150</text><text x="540" y="322" font-size="11" fill="%23e2e8f0">Aadhaar Print</text><text x="1100" y="322" font-size="11" fill="%23a78bfa" text-anchor="end">₹30</text><text x="540" y="342" font-size="11" fill="%23e2e8f0">Lamination</text><text x="1100" y="342" font-size="11" fill="%23a78bfa" text-anchor="end">₹20</text><text x="540" y="362" font-size="11" fill="%23e2e8f0">Photo Copies</text><text x="1100" y="362" font-size="11" fill="%23a78bfa" text-anchor="end">₹10</text><line x1="524" y1="380" x2="1140" y2="380" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.08"/><text x="540" y="398" font-size="10" fill="%234a5568">Platform Fee</text><text x="1100" y="398" font-size="11" fill="%234a5568" text-anchor="end">₹5</text><text x="524" y="440" font-size="10" fill="%234a5568">TOTAL AMOUNT</text><rect x="524" y="447" width="616" height="48" rx="8" fill="%234f46e5" fill-opacity="0.08" stroke="%234f46e5" stroke-width="0.8"/><text x="540" y="477" font-size="24" fill="%234f46e5" font-weight="bold">₹215</text><text x="524" y="525" font-size="10" fill="%234a5568">NOTES</text><rect x="524" y="532" width="616" height="60" rx="8" fill="%230a1628" stroke="%234f46e5" stroke-width="0.5" stroke-opacity="0.4"/><text x="540" y="555" font-size="11" fill="%236b7280" font-style="italic">Handled by Operator 1. Payment received via Razorpay UPI.</text><rect x="524" y="620" width="290" height="44" rx="22" fill="url(%23pg)"/><text x="600" y="647" font-size="13" fill="%23fff" font-weight="bold" text-anchor="middle">💾 Save Transaction</text><rect x="836" y="620" width="290" height="44" rx="22" fill="%234f46e5" fill-opacity="0.1" stroke="%234f46e5" stroke-width="0.5"/><text x="981" y="647" font-size="13" fill="%234f46e5" text-anchor="middle">🔁 Re-scan</text></g></svg>`,
	payscan_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="pmbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230a1628"/><stop offset="100%" stop-color="%230e1f3a"/></linearGradient><clipPath id="pmc"><rect width="400" height="700" rx="16"/></clipPath></defs><g clip-path="url(%23pmc)"><rect width="400" height="700" fill="url(%23pmbg)"/><circle cx="350" cy="120" r="150" fill="%234f46e5" fill-opacity="0.06"/><rect width="400" height="28" fill="%23060f22"/><text x="16" y="19" font-size="10" fill="%239ca3af">9:41</text><text x="340" y="19" font-size="10" fill="%239ca3af">⚡ 94%</text><rect x="0" y="28" width="400" height="52" fill="%230d1a35"/><text x="20" y="50" font-size="17" fill="%234f46e5" font-weight="bold">CSC</text><text x="56" y="50" font-size="17" fill="%237c3aed" font-weight="bold">Ledger</text><text x="20" y="66" font-size="9" fill="%234a5568">Scan receipts · AI-powered · Instant log</text><circle cx="370" cy="52" r="14" fill="%234f46e5" fill-opacity="0.15" stroke="%234f46e5" stroke-width="1"/><text x="362" y="56" font-size="9" fill="%234f46e5">SY</text><rect x="12" y="92" width="376" height="260" rx="14" fill="%23060f22" stroke="%234f46e5" stroke-width="0.8"/><text x="28" y="114" font-size="11" fill="%23e2e8f0" font-weight="bold">📷 Receipt Scanner</text><rect x="28" y="122" width="344" height="200" rx="8" fill="%230a1628"/><rect x="110" y="132" width="160" height="180" rx="4" fill="%23fff" fill-opacity="0.93"/><text x="122" y="152" font-size="7" fill="%23333" font-weight="bold">TRANSACTION RECEIPT</text><text x="122" y="166" font-size="7" fill="%23555">PAN Application</text><text x="258" y="166" font-size="7" fill="%23333" text-anchor="end">₹150</text><text x="122" y="178" font-size="7" fill="%23555">Aadhaar Print</text><text x="258" y="178" font-size="7" fill="%23333" text-anchor="end">₹30</text><text x="122" y="190" font-size="7" fill="%23555">Lamination</text><text x="258" y="190" font-size="7" fill="%23333" text-anchor="end">₹20</text><line x1="122" y1="200" x2="258" y2="200" stroke="%23ccc" stroke-width="0.5"/><text x="122" y="214" font-size="8" fill="%23000" font-weight="bold">TOTAL</text><text x="258" y="214" font-size="8" fill="%23000" font-weight="bold" text-anchor="end">₹215</text><polyline points="28,122 28,142 48,142" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="352,122 372,122 372,142" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="28,302 28,322 48,322" fill="none" stroke="%234f46e5" stroke-width="2"/><polyline points="352,302 372,302 372,322" fill="none" stroke="%234f46e5" stroke-width="2"/><rect x="28" y="220" width="344" height="2" fill="%234f46e5" fill-opacity="0.6"/><rect x="100" y="336" width="200" height="26" rx="13" fill="%234f46e5" fill-opacity="0.15" stroke="%234f46e5" stroke-width="0.5"/><text x="130" y="353" font-size="9" fill="%234f46e5">🤖 AI Extracting...</text><rect x="12" y="376" width="376" height="230" rx="14" fill="%230d1a35" stroke="%237c3aed" stroke-width="0.5"/><text x="28" y="398" font-size="11" fill="%23e2e8f0" font-weight="bold">OCR Generated Form</text><rect x="320" y="386" width="56" height="18" rx="9" fill="%234f46e5" fill-opacity="0.15"/><text x="328" y="398" font-size="8" fill="%234f46e5">Auto-filled</text><text x="28" y="420" font-size="9" fill="%234a5568">CENTER</text><rect x="28" y="426" width="160" height="30" rx="6" fill="%230a1628" stroke="%234f46e5" stroke-width="0.6"/><text x="40" y="446" font-size="11" fill="%23e2e8f0">Shambhuganj CSC</text><text x="200" y="420" font-size="9" fill="%234a5568">CATEGORY</text><rect x="200" y="426" width="176" height="30" rx="6" fill="%230a1628" stroke="%234f46e5" stroke-width="0.6"/><text x="212" y="446" font-size="11" fill="%23a78bfa">🏛 Govt Services</text><text x="28" y="476" font-size="9" fill="%234a5568">AMOUNT</text><rect x="28" y="482" width="352" height="40" rx="8" fill="%234f46e5" fill-opacity="0.08" stroke="%234f46e5" stroke-width="0.6"/><text x="44" y="508" font-size="22" fill="%234f46e5" font-weight="bold">₹215</text><text x="280" y="508" font-size="10" fill="%234a5568">15 Mar 2025</text><text x="28" y="538" font-size="9" fill="%234a5568">4 items detected</text><rect x="28" y="556" width="168" height="36" rx="18" fill="%234f46e5"/><text x="73" y="578" font-size="11" fill="%23fff" font-weight="bold" text-anchor="middle">💾 Save</text><rect x="208" y="556" width="168" height="36" rx="18" fill="%234f46e5" fill-opacity="0.1" stroke="%234f46e5" stroke-width="0.5"/><text x="292" y="578" font-size="11" fill="%234f46e5" text-anchor="middle">✏ Edit</text><rect x="0" y="654" width="400" height="46" fill="%23060f22"/><rect x="0" y="654" width="400" height="0.5" fill="%234f46e5" fill-opacity="0.2"/><text x="50" y="680" font-size="20" text-anchor="middle">🏠</text><text x="50" y="693" font-size="8" fill="%234f46e5" text-anchor="middle">Home</text><text x="150" y="680" font-size="20" text-anchor="middle">📷</text><text x="150" y="693" font-size="8" fill="%234a5568" text-anchor="middle">Scan</text><text x="250" y="680" font-size="20" text-anchor="middle">📊</text><text x="250" y="693" font-size="8" fill="%234a5568" text-anchor="middle">History</text><text x="350" y="680" font-size="20" text-anchor="middle">📈</text><text x="350" y="693" font-size="8" fill="%234a5568" text-anchor="middle">Analytics</text></g></svg>`,

	// ── Client Request Portal (Replaces ChaApp) ──
	chatapp_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23050d1a"/><stop offset="100%" stop-color="%230a0f1e"/></linearGradient><linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23cf55a5"/><stop offset="100%" stop-color="%23a855f7"/></linearGradient><clipPath id="cc"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23cc)"><rect width="1200" height="750" fill="url(%23cbg)"/><circle cx="600" cy="375" r="400" fill="%23cf55a5" fill-opacity="0.03"/><rect width="1200" height="52" fill="%23060c18"/><circle cx="20" cy="26" r="6" fill="%23ff5f57"/><circle cx="40" cy="26" r="6" fill="%23ffbd2e"/><circle cx="60" cy="26" r="6" fill="%2328ca41"/><text x="90" y="30" font-size="15" fill="%23cf55a5" font-weight="bold">Client Portal</text><text x="185" y="30" font-size="10" fill="%234a5568">Real-time status tracking for customers</text><rect x="1100" y="10" width="80" height="32" rx="16" fill="%23cf55a5" fill-opacity="0.1" stroke="%23cf55a5" stroke-width="0.5"/><text x="1118" y="30" font-size="10" fill="%23cf55a5">⚡ Online</text><rect x="0" y="52" width="280" height="698" fill="%23080d1c"/><rect x="279" y="52" width="1" height="698" fill="%23cf55a5" fill-opacity="0.08"/><rect x="12" y="64" width="256" height="36" rx="18" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="28" y="86" font-size="11" fill="%234a5568">🔍 Search tracking ID...</text><text x="12" y="118" font-size="9" fill="%234a5568" letter-spacing="1">RECENT INQUIRIES (5)</text><rect x="12" y="126" width="256" height="60" rx="10" fill="%23cf55a5" fill-opacity="0.08" stroke="%23cf55a5" stroke-width="0.5" stroke-opacity="0.3"/><circle cx="38" cy="156" r="18" fill="%23a855f7" fill-opacity="0.3" stroke="%23a855f7" stroke-width="1"/><text x="31" y="160" font-size="10" fill="%23c084fc">P89</text><circle cx="52" cy="140" r="5" fill="%2322c55e"/><text x="66" y="150" font-size="12" fill="%23e2e8f0" font-weight="bold">Application: PAN-8921</text><text x="66" y="165" font-size="10" fill="%236b7280">typing...</text><text x="248" y="148" font-size="9" fill="%23cf55a5">now</text><rect x="240" y="158" width="18" height="18" rx="9" fill="%23cf55a5"/><text x="247" y="170" font-size="9" fill="%23fff">1</text><circle cx="38" cy="212" r="18" fill="%2306b6d4" fill-opacity="0.2" stroke="%2306b6d4" stroke-width="1"/><text x="31" y="216" font-size="10" fill="%2322d3ee">I44</text><circle cx="52" cy="196" r="5" fill="%2322c55e"/><text x="66" y="206" font-size="12" fill="%23e2e8f0">Income Cert-44</text><text x="66" y="221" font-size="10" fill="%236b7280">Is it ready to pick up?</text><text x="248" y="210" font-size="9" fill="%234a5568">2m</text><circle cx="38" cy="258" r="18" fill="%23f59e0b" fill-opacity="0.2" stroke="%23f59e0b" stroke-width="1"/><text x="31" y="262" font-size="10" fill="%23fbbf24">A12</text><circle cx="52" cy="242" r="5" fill="%2322c55e"/><text x="66" y="252" font-size="12" fill="%23e2e8f0">Aadhaar Update</text><text x="66" y="267" font-size="10" fill="%236b7280">Fingerprint updated 👍</text><circle cx="38" cy="304" r="18" fill="%23ef4444" fill-opacity="0.2" stroke="%23ef4444" stroke-width="1"/><text x="31" y="308" font-size="10" fill="%23f87171">P01</text><circle cx="52" cy="288" r="4" fill="%23fbbf24"/><text x="66" y="298" font-size="12" fill="%23e2e8f0">Passport Form</text><text x="66" y="313" font-size="10" fill="%236b7280">Submitted, awaiting dates</text><text x="248" y="302" font-size="9" fill="%234a5568">1h</text><text x="12" y="350" font-size="9" fill="%234a5568" letter-spacing="1">SERVICE QUEUES</text><rect x="12" y="358" width="256" height="44" rx="8" fill="%230f1628"/><text x="28" y="378" font-size="11" fill="%23e2e8f0">🚀 Pending Verifications</text><text x="28" y="393" font-size="9" fill="%236b7280">12 applications · 4 need attention</text><rect x="12" y="408" width="256" height="44" rx="8" fill="%230f1628"/><text x="28" y="428" font-size="11" fill="%23e2e8f0">🎓 Completed Today</text><text x="28" y="443" font-size="9" fill="%236b7280">8 applications finished</text><rect x="280" y="52" width="920" height="698" fill="%230b1120"/><rect x="280" y="52" width="920" height="60" fill="%23060c18"/><rect x="280" y="111" width="920" height="1" fill="%23cf55a5" fill-opacity="0.08"/><circle cx="318" cy="82" r="22" fill="%23a855f7" fill-opacity="0.3" stroke="%23a855f7" stroke-width="1.5"/><text x="307" y="87" font-size="11" fill="%23c084fc">P89</text><circle cx="336" cy="62" r="6" fill="%2322c55e"/><text x="350" y="78" font-size="14" fill="%23e2e8f0" font-weight="bold">Application: PAN-8921</text><text x="350" y="94" font-size="10" fill="%2322c55e">● Online · Customer typing...</text><text x="1100" y="85" font-size="18">📞</text><text x="1140" y="85" font-size="18">📋</text><text x="400" y="145" font-size="9" fill="%234a5568" text-anchor="middle">Today · 8:45 PM</text><circle cx="310" cy="175" r="16" fill="%23a855f7" fill-opacity="0.2"/><text x="301" y="179" font-size="9" fill="%23c084fc">P89</text><rect x="334" y="158" width="310" height="52" rx="14" rx2="4" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="350" y="177" font-size="11" fill="%23e2e8f0">Hello, when will my PAN card be</text><text x="350" y="195" font-size="11" fill="%23e2e8f0">ready for pickup at the center?</text><text x="626" y="206" font-size="9" fill="%234a5568">8:45</text><rect x="780" y="225" width="330" height="52" rx="14" fill="url(%23cg)" fill-opacity="0.85"/><text x="796" y="244" font-size="11" fill="%23fff">Your application is processed 🔥</text><text x="796" y="261" font-size="11" fill="%23fff">It will arrive by mail shortly.</text><text x="1092" y="273" font-size="9" fill="%23e2e8f0" fill-opacity="0.7">8:46 ✓✓</text><circle cx="310" cy="305" r="16" fill="%23a855f7" fill-opacity="0.2"/><text x="301" y="309" font-size="9" fill="%23c084fc">P89</text><rect x="334" y="290" width="220" height="36" rx="14" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="350" y="312" font-size="11" fill="%23e2e8f0">Oh nice! 🎉 Can you send receipt?</text><text x="545" y="322" font-size="9" fill="%234a5568">8:47</text><rect x="820" y="358" width="290" height="160" rx="14" fill="url(%23cg)" fill-opacity="0.15" stroke="%23cf55a5" stroke-width="0.5"/><rect x="834" y="368" width="264" height="100" rx="8" fill="%230a1220"/><text x="966" y="418" font-size="28" text-anchor="middle">🖼️</text><text x="966" y="440" font-size="10" fill="%234a5568" text-anchor="middle">acknowledgement_slip.png</text><text x="836" y="502" font-size="11" fill="%23e2e8f0">Attached! Tracking ID: 9482X 🚀</text><text x="1090" y="514" font-size="9" fill="%23e2e8f0" fill-opacity="0.7">8:52 ✓✓</text><circle cx="310" cy="555" r="16" fill="%23a855f7" fill-opacity="0.2"/><text x="301" y="559" font-size="9" fill="%23c084fc">P89</text><rect x="334" y="540" width="80" height="36" rx="18" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><circle cx="360" cy="558" r="4" fill="%23cf55a5" fill-opacity="0.5"/><circle cx="375" cy="558" r="4" fill="%23cf55a5" fill-opacity="0.7"/><circle cx="390" cy="558" r="4" fill="%23cf55a5"/><rect x="280" y="690" width="920" height="60" fill="%23060c18"/><rect x="280" y="690" width="920" height="1" fill="%23cf55a5" fill-opacity="0.08"/><rect x="300" y="706" width="800" height="36" rx="18" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.4" stroke-opacity="0.4"/><text x="320" y="728" font-size="11" fill="%234a5568">Message customer...</text><text x="1090" y="728" font-size="18">😊</text><text x="1120" y="728" font-size="18">📎</text><rect x="1148" y="706" width="36" height="36" rx="18" fill="url(%23cg)"/><text x="1166" y="729" font-size="14" fill="%23fff" text-anchor="middle">➤</text></g></svg>`,
	chatapp_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="cmbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23050d1a"/><stop offset="100%" stop-color="%230a0f1e"/></linearGradient><linearGradient id="cmg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23cf55a5"/><stop offset="100%" stop-color="%23a855f7"/></linearGradient><clipPath id="cmc"><rect width="400" height="700" rx="16"/></clipPath></defs><g clip-path="url(%23cmc)"><rect width="400" height="700" fill="url(%23cmbg)"/><circle cx="200" cy="350" r="200" fill="%23cf55a5" fill-opacity="0.04"/><rect width="400" height="28" fill="%23060c18"/><text x="16" y="19" font-size="10" fill="%239ca3af">9:41</text><rect x="0" y="28" width="400" height="56" fill="%23080d1c"/><rect x="0" y="83" width="400" height="1" fill="%23cf55a5" fill-opacity="0.1"/><text x="16" y="64" font-size="16" fill="%23cf55a5">←</text><circle cx="56" cy="58" r="18" fill="%23a855f7" fill-opacity="0.25" stroke="%23a855f7" stroke-width="1.5"/><text x="47" y="62" font-size="10" fill="%23c084fc">P89</text><circle cx="70" cy="42" r="5" fill="%2322c55e"/><text x="82" y="54" font-size="13" fill="%23e2e8f0" font-weight="bold">PAN-8921</text><text x="82" y="70" font-size="10" fill="%2322c55e">● typing...</text><text x="350" y="62" font-size="18">📞</text><text x="372" y="62" font-size="18">⋮</text><rect x="0" y="84" width="400" height="528" fill="%230b1120"/><text x="200" y="108" font-size="9" fill="%234a5568" text-anchor="middle">Today · 8:45 PM</text><circle cx="26" cy="140" r="14" fill="%23a855f7" fill-opacity="0.2"/><text x="17" y="144" font-size="9" fill="%23c084fc">P89</text><rect x="48" y="122" width="230" height="44" rx="12" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="60" y="138" font-size="10" fill="%23e2e8f0">Hello, when will my PAN card</text><text x="60" y="153" font-size="10" fill="%23e2e8f0">be ready for pickup? 🤔</text><text x="270" y="163" font-size="8" fill="%234a5568">8:45</text><rect x="110" y="182" width="276" height="44" rx="12" fill="url(%23cmg)" fill-opacity="0.85"/><text x="122" y="198" font-size="10" fill="%23fff">Your application is processed 🔥</text><text x="122" y="212" font-size="10" fill="%23fff">It will arrive by mail shortly ✅</text><text x="366" y="224" font-size="8" fill="%23fff" fill-opacity="0.7" text-anchor="end">8:46 ✓✓</text><circle cx="26" cy="252" r="14" fill="%23a855f7" fill-opacity="0.2"/><text x="17" y="256" font-size="9" fill="%23c084fc">P89</text><rect x="48" y="236" width="200" height="30" rx="12" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="60" y="255" font-size="10" fill="%23e2e8f0">Oh nice! Can you send receipt? 🎉</text><rect x="100" y="288" width="286" height="30" rx="12" fill="url(%23cmg)" fill-opacity="0.85"/><text x="112" y="307" font-size="10" fill="%23fff">Attached! Tracking ID: 9482X 🚀</text><text x="366" y="316" font-size="8" fill="%23fff" fill-opacity="0.7" text-anchor="end">8:52 ✓✓</text><rect x="260" y="320" width="100" height="22" rx="11" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.5"/><text x="272" y="334" font-size="10">🔥 1</text><text x="310" y="334" font-size="10">❤️ 1</text><circle cx="26" cy="380" r="14" fill="%23a855f7" fill-opacity="0.2"/><text x="17" y="384" font-size="9" fill="%23c084fc">P89</text><rect x="48" y="364" width="230" height="50" rx="12" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><text x="60" y="384" font-size="10" fill="%23e2e8f0">Thanks so much for the quick help 😂</text><text x="60" y="400" font-size="10" fill="%23e2e8f0">Will check online. 💯</text><circle cx="26" cy="438" r="14" fill="%23a855f7" fill-opacity="0.2"/><text x="17" y="442" font-size="9" fill="%23c084fc">P89</text><rect x="48" y="422" width="70" height="30" rx="15" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.3" stroke-opacity="0.3"/><circle cx="70" cy="437" r="3.5" fill="%23cf55a5" fill-opacity="0.5"/><circle cx="82" cy="437" r="3.5" fill="%23cf55a5" fill-opacity="0.7"/><circle cx="94" cy="437" r="3.5" fill="%23cf55a5"/><rect x="0" y="612" width="400" height="60" fill="%23060c18"/><rect x="0" y="612" width="400" height="1" fill="%23cf55a5" fill-opacity="0.1"/><rect x="12" y="626" width="310" height="36" rx="18" fill="%230f1628" stroke="%23cf55a5" stroke-width="0.4" stroke-opacity="0.3"/><text x="28" y="648" font-size="11" fill="%234a5568">Message...</text><text x="330" y="648" font-size="18">😊</text><text x="350" y="648" font-size="18">📎</text><rect x="370" y="626" width="20" height="36" rx="10" fill="url(%23cmg)"/><text x="380" y="649" font-size="11" fill="%23fff" text-anchor="middle">➤</text><rect x="0" y="672" width="400" height="28" fill="%23060c18"/><text x="50" y="691" font-size="9" fill="%23cf55a5" text-anchor="middle">💬 Chats</text><text x="150" y="691" font-size="9" fill="%234a5568" text-anchor="middle">👥 Queues</text><text x="250" y="691" font-size="9" fill="%234a5568" text-anchor="middle">📞 Calls</text><text x="350" y="691" font-size="9" fill="%234a5568" text-anchor="middle">👤 Admin</text></g></svg>`,

	// ── Notice Board (Replaces GoogleDoc) ──
	googledoc_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="gbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="100%" stop-color="%23f1f5f9"/></linearGradient><clipPath id="gc"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23gc)"><rect width="1200" height="750" fill="url(%23gbg)"/><rect width="1200" height="36" fill="%23e8edf2"/><circle cx="18" cy="18" r="6" fill="%23ff5f57"/><circle cx="38" cy="18" r="6" fill="%23ffbd2e"/><circle cx="58" cy="18" r="6" fill="%2328ca41"/><rect x="80" y="6" width="800" height="24" rx="12" fill="%23fff" stroke="%23d1d5db" stroke-width="1"/><text x="100" y="22" font-size="11" fill="%23374151">🔒 csc.shambhuganj.in/admin/posts/create</text><text x="1050" y="22" font-size="11" fill="%234a5568">⋯ ⊕ ★</text><rect x="0" y="36" width="1200" height="48" fill="%23fff" stroke="%23e5e7eb" stroke-width="0" /><rect x="0" y="83" width="1200" height="1" fill="%23e5e7eb"/><text x="16" y="58" font-size="22" fill="%232563eb">📢</text><text x="46" y="58" font-size="15" fill="%23374151" font-weight="500">Notice: PM Kisan Yojana Updates</text><circle cx="490" cy="52" r="6" fill="%2322c55e"/><text x="502" y="56" font-size="9" fill="%2322c55e">Saved</text><text x="560" y="58" font-size="11" fill="%23374151">File</text><text x="596" y="58" font-size="11" fill="%23374151">Edit</text><text x="630" y="58" font-size="11" fill="%23374151">View</text><text x="668" y="58" font-size="11" fill="%23374151">Insert</text><text x="710" y="58" font-size="11" fill="%23374151">Format</text><rect x="980" y="40" width="130" height="30" rx="15" fill="%232563eb"/><text x="1020" y="59" font-size="11" fill="%23fff" font-weight="bold" text-anchor="middle">🚀 Publish</text><circle cx="1130" cy="55" r="14" fill="%23a855f7"/><text x="1122" y="59" font-size="9" fill="%23fff">E1</text><circle cx="1155" cy="55" r="14" fill="%23f59e0b"/><text x="1147" y="59" font-size="9" fill="%23fff">E2</text><circle cx="1180" cy="55" r="14" fill="%2306b6d4"/><text x="1172" y="59" font-size="9" fill="%23fff">SY</text><rect x="0" y="84" width="1200" height="40" fill="%23fff" stroke="%23e5e7eb" stroke-width="0"/><rect x="0" y="123" width="1200" height="1" fill="%23e5e7eb"/><rect x="16" y="92" width="120" height="24" rx="4" fill="%23f9fafb" stroke="%23e5e7eb" stroke-width="1"/><text x="28" y="108" font-size="11" fill="%23374151">Arial</text><rect x="144" y="92" width="52" height="24" rx="4" fill="%23f9fafb" stroke="%23e5e7eb" stroke-width="1"/><text x="158" y="108" font-size="11" fill="%23374151">14</text><text x="210" y="110" font-size="14" fill="%23374151" font-weight="bold">B</text><text x="232" y="110" font-size="14" fill="%234a5568" font-style="italic">I</text><text x="252" y="111" font-size="12" fill="%234a5568" text-decoration="underline">U</text><text x="275" y="110" font-size="14">🔗</text><text x="300" y="110" font-size="14">📋</text><text x="330" y="110" font-size="11" fill="%234a5568">≡ Left</text><text x="375" y="110" font-size="11" fill="%232563eb">≡ Center</text><text x="425" y="110" font-size="11" fill="%234a5568">≡ Right</text><rect x="180" y="124" width="840" height="626" fill="%23fff" stroke="%23e5e7eb" stroke-width="1"/><rect x="186" y="130" width="840" height="626" rx="2" fill="%23000" fill-opacity="0.05"/><text x="260" y="180" font-size="22" fill="%23111827" font-weight="bold">Important Update on PM Kisan KYC</text><text x="260" y="205" font-size="11" fill="%236b7280">Shrilal Yadav · Shambhuganj CSC Center · Jaunpur · 2025</text><line x1="260" y1="215" x2="960" y2="215" stroke="%23e5e7eb" stroke-width="1"/><rect x="758" y="232" width="2" height="16" fill="%23a855f7"/><rect x="760" y="230" width="60" height="16" rx="4" fill="%23a855f7"/><text x="764" y="241" font-size="9" fill="%23fff">Emp 1.</text><text x="260" y="250" font-size="13" fill="%231f2937" font-weight="bold">Notice to All Farmers</text><text x="260" y="268" font-size="11" fill="%23374151">All farmers in Shambhuganj and nearby areas are requested to complete</text><text x="260" y="284" font-size="11" fill="%23374151">their e-KYC for the upcoming PM Kisan installment at the earliest.</text><text x="260" y="300" font-size="11" fill="%23374151">Our center is open from 9 AM to 9 PM daily to assist you with this process.</text><rect x="260" y="322" width="460" height="16" fill="%232563eb" fill-opacity="0.1"/><rect x="720" y="322" width="2" height="16" fill="%232563eb"/><text x="260" y="335" font-size="11" fill="%23374151">Please bring your Aadhaar card and registered mobile number.</text><text x="260" y="365" font-size="14" fill="%231f2937" font-weight="bold">Required Documents</text><text x="260" y="385" font-size="11" fill="%23374151">• Aadhaar Card</text><text x="260" y="400" font-size="11" fill="%23374151">• Bank Passbook</text><text x="260" y="415" font-size="11" fill="%23374151">• Mobile phone linked to Aadhaar (for OTP verification)</text><rect x="260" y="448" width="2" height="16" fill="%23f59e0b"/><rect x="264" y="446" width="56" height="16" rx="4" fill="%23f59e0b"/><text x="268" y="457" font-size="9" fill="%23fff">Emp 2.</text><text x="260" y="462" font-size="11" fill="%23374151">Note: We also provide Fino Payment Bank and Airtel Payment Bank</text><text x="260" y="478" font-size="11" fill="%23374151">account opening services. Cash withdrawal available.</text><rect x="1020" y="124" width="180" height="626" fill="%23f9fafb" stroke="%23e5e7eb" stroke-width="1"/><rect x="1030" y="140" width="160" height="90" rx="8" fill="%23fff" stroke="%23e5e7eb" stroke-width="1"/><circle cx="1046" cy="155" r="8" fill="%23a855f7"/><text x="1041" y="158" font-size="8" fill="%23fff">E1</text><text x="1060" y="155" font-size="10" fill="%23374151" font-weight="bold">Employee 1</text><text x="1060" y="168" font-size="8" fill="%236b7280">2 min ago</text><text x="1034" y="186" font-size="9" fill="%23374151">Should we include the</text><text x="1034" y="198" font-size="9" fill="%23374151">exact deadline date?</text><rect x="1034" y="212" width="56" height="18" rx="9" fill="%232563eb" fill-opacity="0.1"/><text x="1044" y="224" font-size="9" fill="%232563eb">Reply</text><rect x="1030" y="240" width="160" height="80" rx="8" fill="%23fff" stroke="%23fbbf24" stroke-width="1"/><circle cx="1046" cy="255" r="8" fill="%23f59e0b"/><text x="1041" y="258" font-size="8" fill="%23fff">E2</text><text x="1060" y="255" font-size="10" fill="%23374151" font-weight="bold">Employee 2</text><text x="1060" y="268" font-size="8" fill="%236b7280">just now</text><text x="1034" y="286" font-size="9" fill="%23374151">Good point. Let's add it</text><text x="1034" y="298" font-size="9" fill="%23374151">before publishing. 📝</text></g></svg>`,
	googledoc_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><clipPath id="gmc"><rect width="400" height="700" rx="16"/></clipPath></defs><g clip-path="url(%23gmc)"><rect width="400" height="700" fill="%23f8fafc"/><rect width="400" height="28" fill="%23e8edf2"/><text x="16" y="19" font-size="10" fill="%236b7280">9:41</text><text x="340" y="19" font-size="10" fill="%236b7280">⚡ 94%</text><rect x="0" y="28" width="400" height="52" fill="%23fff" stroke="%23e5e7eb" stroke-width="0"/><rect x="0" y="79" width="400" height="1" fill="%23e5e7eb"/><text x="16" y="52" font-size="20" fill="%232563eb">←</text><text x="46" y="50" font-size="12" fill="%23374151" font-weight="500">Notice: PM Kisan...</text><circle cx="280" cy="46" r="5" fill="%2322c55e"/><text x="290" y="50" font-size="9" fill="%2322c55e">Saved</text><circle cx="338" cy="46" r="12" fill="%23a855f7"/><text x="331" y="49" font-size="8" fill="%23fff">E1</text><circle cx="360" cy="46" r="12" fill="%23f59e0b"/><text x="353" y="49" font-size="8" fill="%23fff">E2</text><text x="382" y="52" font-size="16" fill="%23374151">⋮</text><rect x="0" y="80" width="400" height="36" fill="%23fff" stroke="%23e5e7eb" stroke-width="0"/><rect x="0" y="115" width="400" height="1" fill="%23e5e7eb"/><text x="16" y="101" font-size="14" fill="%23374151" font-weight="bold">B</text><text x="36" y="101" font-size="14" fill="%236b7280" font-style="italic">I</text><text x="56" y="101" font-size="12" fill="%236b7280">U</text><text x="76" y="101" font-size="14">🔗</text><text x="100" y="101" font-size="11" fill="%236b7280">≡</text><text x="120" y="101" font-size="11" fill="%232563eb">≡</text><text x="140" y="101" font-size="11" fill="%236b7280">≡</text><text x="168" y="101" font-size="11" fill="%236b7280">H1</text><text x="192" y="101" font-size="11" fill="%236b7280">H2</text><text x="216" y="101" font-size="11" fill="%236b7280">• List</text><text x="260" y="101" font-size="14">📷</text><text x="285" y="101" font-size="14">📊</text><rect x="20" y="124" width="360" height="520" fill="%23fff" stroke="%23e5e7eb" stroke-width="1" rx="4"/><rect x="48" y="146" width="2" height="14" fill="%23a855f7"/><rect x="50" y="144" width="44" height="14" rx="4" fill="%23a855f7"/><text x="54" y="154" font-size="8" fill="%23fff">Emp 1.</text><text x="36" y="175" font-size="16" fill="%23111827" font-weight="bold">PM Kisan Update</text><text x="36" y="192" font-size="9" fill="%236b7280">Shrilal Yadav · Shambhuganj · 2025</text><line x1="36" y1="200" x2="364" y2="200" stroke="%23e5e7eb" stroke-width="1"/><rect x="36" y="214" width="200" height="14" fill="%232563eb" fill-opacity="0.12"/><rect x="236" y="214" width="2" height="14" fill="%232563eb"/><text x="36" y="225" font-size="11" fill="%23374151">All farmers are requested to</text><text x="36" y="241" font-size="11" fill="%23374151">complete their e-KYC...</text><text x="36" y="257" font-size="11" fill="%23374151">Please bring your Aadhaar card</text><text x="36" y="273" font-size="11" fill="%23374151">and registered mobile number.</text><text x="36" y="302" font-size="13" fill="%231f2937" font-weight="bold">1. Timings</text><text x="36" y="320" font-size="11" fill="%23374151">Our center is open from 9 AM to</text><text x="36" y="336" font-size="11" fill="%23374151">9 PM daily to assist you.</text><rect x="36" y="354" width="2" height="14" fill="%23f59e0b"/><rect x="38" y="352" width="48" height="14" rx="4" fill="%23f59e0b"/><text x="42" y="362" font-size="8" fill="%23fff">Emp 2.</text><text x="36" y="368" font-size="11" fill="%23374151">We also provide Fino Payment Bank</text><text x="36" y="384" font-size="11" fill="%23374151">account opening services.</text><rect x="320" y="320" width="56" height="36" rx="8" fill="%23fef3c7" stroke="%23fbbf24" stroke-width="0.5"/><text x="348" y="336" font-size="16" text-anchor="middle">💬</text><text x="348" y="349" font-size="8" fill="%23f59e0b" text-anchor="middle">2 notes</text><rect x="0" y="644" width="400" height="56" fill="%23fff" stroke="%23e5e7eb" stroke-width="0"/><rect x="0" y="644" width="400" height="1" fill="%23e5e7eb"/><rect x="12" y="656" width="60" height="30" rx="6" fill="%23f3f4f6" stroke="%23e5e7eb" stroke-width="1"/><text x="42" y="674" font-size="11" fill="%23374151" text-anchor="middle">Bold</text><rect x="80" y="656" width="60" height="30" rx="6" fill="%23f3f4f6" stroke="%23e5e7eb" stroke-width="1"/><text x="110" y="674" font-size="11" fill="%236b7280" text-anchor="middle" font-style="italic">Italic</text><rect x="148" y="656" width="60" height="30" rx="6" fill="%232563eb" fill-opacity="0.1" stroke="%232563eb" stroke-width="0.5"/><text x="178" y="674" font-size="11" fill="%232563eb" text-anchor="middle">H1</text><rect x="216" y="656" width="60" height="30" rx="6" fill="%23f3f4f6" stroke="%23e5e7eb" stroke-width="1"/><text x="246" y="674" font-size="11" fill="%236b7280" text-anchor="middle">• List</text><rect x="284" y="656" width="104" height="30" rx="6" fill="%232563eb"/><text x="336" y="674" font-size="11" fill="%23fff" text-anchor="middle">🚀 Publish</text></g></svg>`,

	// ── IRCTC Rail Connect (Replaces Gemini) ──
	csc_travel_desktop: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="gmbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230c0c1a"/><stop offset="100%" stop-color="%230a0a1e"/></linearGradient><linearGradient id="gemg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%234285f4"/><stop offset="50%" stop-color="%23a855f7"/><stop offset="100%" stop-color="%23ea4335"/></linearGradient><linearGradient id="gemg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%234285f4"/><stop offset="100%" stop-color="%23a855f7"/></linearGradient><clipPath id="gmc2"><rect width="1200" height="750" rx="12"/></clipPath></defs><g clip-path="url(%23gmc2)"><rect width="1200" height="750" fill="url(%23gmbg)"/><circle cx="600" cy="375" r="500" fill="%234285f4" fill-opacity="0.03"/><circle cx="200" cy="200" r="200" fill="%23a855f7" fill-opacity="0.04"/><rect width="1200" height="52" fill="%23050510"/><circle cx="20" cy="26" r="6" fill="%23ff5f57"/><circle cx="40" cy="26" r="6" fill="%23ffbd2e"/><circle cx="60" cy="26" r="6" fill="%2328ca41"/><text x="90" y="34" font-size="20" fill="%234285f4">🚆</text><text x="120" y="33" font-size="15" fill="%23e2e8f0" font-weight="600">RailConnect</text><text x="210" y="33" font-size="11" fill="%234a5568">Authorized IRCTC Agent</text><rect x="1080" y="12" width="100" height="28" rx="14" fill="%234285f4" fill-opacity="0.15" stroke="%234285f4" stroke-width="0.5"/><text x="1098" y="30" font-size="11" fill="%234285f4">Agent Wallet</text><rect x="0" y="52" width="260" height="698" fill="%23070712"/><rect x="259" y="52" width="1" height="698" fill="%234285f4" fill-opacity="0.08"/><rect x="16" y="68" width="228" height="40" rx="20" fill="%234285f4" fill-opacity="0.12" stroke="%234285f4" stroke-width="0.5"/><text x="128" y="93" font-size="12" fill="%234285f4" text-anchor="middle">✦ New Ticket Search</text><text x="16" y="132" font-size="9" fill="%234a5568" letter-spacing="1">RECENT BOOKINGS</text><rect x="16" y="140" width="228" height="36" rx="8" fill="%234285f4" fill-opacity="0.08"/><text x="28" y="162" font-size="11" fill="%23e2e8f0">✦ Jaunpur ➔ New Delhi</text><text x="28" y="190" font-size="11" fill="%234a5568">Varanasi ➔ Mumbai</text><text x="28" y="214" font-size="11" fill="%234a5568">PNR: 8349281723</text><rect x="260" y="52" width="940" height="698" fill="%230a0a1e"/><text x="730" y="100" font-size="11" fill="%234a5568" text-anchor="middle">Ticket Reservation · Agent Portal · erail.in</text><rect x="660" y="120" width="510" height="52" rx="16" fill="%231a1a2e" stroke="%234285f4" stroke-width="0.4" stroke-opacity="0.4"/><text x="676" y="141" font-size="12" fill="%23e2e8f0">Search trains from Jaunpur to New Delhi</text><text x="280" y="120" font-size="22" fill="url(%23gemg)">🚆</text><rect x="310" y="108" width="560" height="260" rx="16" fill="%230d0d22" stroke="%234285f4" stroke-width="0.3" stroke-opacity="0.3"/><text x="328" y="132" font-size="10" fill="%234285f4" font-weight="bold">IRCTC System</text><text x="328" y="155" font-size="12" fill="%23e2e8f0" font-weight="bold">Train Search Results</text><rect x="328" y="235" width="524" height="60" rx="8" fill="%23111131"/><text x="340" y="252" font-size="10" fill="%234a5568">%23 Fastest Option</text><text x="340" y="267" font-size="10" fill="%2306b6d4">Train 22435</text><text x="428" y="267" font-size="10" fill="%23e2e8f0">- Vande Bharat Express</text><text x="340" y="282" font-size="10" fill="%2306b6d4">Availability</text><text x="428" y="282" font-size="10" fill="%23e2e8f0">: CC - AVAILABLE 42</text><text x="328" y="314" font-size="11" fill="%23d1d5db">💺 Chair Car · 🛌 Executive Class</text><rect x="310" y="374" width="80" height="24" rx="12" fill="%23ffffff" fill-opacity="0.04" stroke="%23ffffff" stroke-width="0.2" stroke-opacity="0.2"/><text x="350" y="390" font-size="10" fill="%234a5568" text-anchor="middle">✅ Book</text><rect x="290" y="694" width="860" height="44" rx="22" fill="%2312122a" stroke="%234285f4" stroke-width="0.5" stroke-opacity="0.4"/><text x="312" y="720" font-size="11" fill="%234a5568">Search more trains...</text><rect x="1142" y="696" width="30" height="40" rx="15" fill="url(%23gemg2)"/><text x="1157" y="720" font-size="14" fill="%23fff" text-anchor="middle">➤</text></g></svg>`,
    csc_travel_mobile: `data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI',sans-serif"><defs><linearGradient id="gmmbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230c0c1a"/><stop offset="100%" stop-color="%230a0a1e"/></linearGradient><linearGradient id="gemmg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%234285f4"/><stop offset="50%" stop-color="%23a855f7"/><stop offset="100%" stop-color="%23ea4335"/></linearGradient><clipPath id="gmmc"><rect width="400" height="700" rx="16"/></clipPath></defs><g clip-path="url(%23gmmc)"><rect width="400" height="700" fill="url(%23gmmbg)"/><circle cx="200" cy="300" r="250" fill="%234285f4" fill-opacity="0.03"/><rect width="400" height="28" fill="%23050510"/><text x="16" y="19" font-size="10" fill="%239ca3af">9:41</text><rect x="0" y="28" width="400" height="52" fill="%23070712"/><text x="20" y="58" font-size="22" fill="%234285f4">🚆</text><text x="50" y="57" font-size="16" fill="%23e2e8f0" font-weight="600">RailConnect</text><rect x="0" y="80" width="400" height="548" fill="%230a0a1e"/><rect x="60" y="140" width="328" height="44" rx="14" fill="%231a1a2e" stroke="%234285f4" stroke-width="0.4" stroke-opacity="0.3"/><text x="76" y="165" font-size="10" fill="%23e2e8f0">Search: Jaunpur to New Delhi</text><text x="16" y="214" font-size="18" fill="url(%23gemmg)">🚆</text><rect x="40" y="200" width="320" height="200" rx="14" fill="%230d0d22" stroke="%234285f4" stroke-width="0.3" stroke-opacity="0.3"/><text x="54" y="238" font-size="11" fill="%23e2e8f0" font-weight="bold">Search Results</text><rect x="54" y="296" width="290" height="44" rx="6" fill="%23111131"/><text x="66" y="312" font-size="9" fill="%2306b6d4">22435 </text><text x="98" y="312" font-size="9" fill="%23e2e8f0">- Vande Bharat</text><text x="66" y="328" font-size="9" fill="%234a5568">CC - AVAILABLE 42</text><rect x="12" y="642" width="300" height="44" rx="22" fill="%2312122a" stroke="%234285f4" stroke-width="0.5" stroke-opacity="0.4"/><text x="28" y="668" font-size="11" fill="%234a5568">Search more trains...</text><rect x="372" y="642" width="16" height="44" rx="8" fill="url(%23gemmg)"/><text x="380" y="668" font-size="12" fill="%23fff" text-anchor="middle">➤</text></g></svg>`,
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const useIsMobile = (query = "(max-width: 639px)") => {
	const [isMobile, setIsMobile] = useState(false)
	useEffect(() => {
		if (typeof window === "undefined") return
		const mql = window.matchMedia(query)
		const handler = (e) => setIsMobile(e.matches)
		mql.addEventListener("change", handler)
		setIsMobile(mql.matches)
		return () => mql.removeEventListener("change", handler)
	}, [query])
	return isMobile
}

const techBadge = (label, color) => (
	<span
		key={label}
		className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
		style={{
			backgroundColor: color + "18",
			borderColor: color + "44",
			color: color,
		}}
	>
		{label}
	</span>
)

// ─────────────────────────────────────────────
//  Project data (Uncle's Services)
// ─────────────────────────────────────────────
const projects = [
	{
		id: "csc_hub",
		title: "CSC Service Hub",
		subtitle: "Digital India Services & Operations",
		tagline: "Comprehensive dashboard for all Common Service Centre tasks",
		link: "http://localhost/dashboard",
		bgFrom: "#050e1c",
		bgTo: "#071524",
		accentColor: "#1cd8d2",
		glowColor: "rgba(28, 216, 210, 0.12)",
		badge: "🏛️ Govt Services",
		badgeColor: "#1cd8d2",
		tags: [
			{ label: "Digital Seva", color: "#e2e8f0" },
			{ label: "Admin Analytics", color: "#1cd8d2" },
			{ label: "Certificates", color: "#00bf8f" },
			{ label: "Razorpay", color: "#38bdf8" },
			{ label: "PAN / Passport", color: "#a78bfa" },
		],
		highlights: [
			{ icon: "🏛️", text: "10+ years of trusted operations in Shambhuganj, Jaunpur" },
			{ icon: "🧑‍💻", text: "Managed by 2 dedicated employees with Shrilal overseeing" },
			{ icon: "📄", text: "End-to-end processing of PAN, Passport, and state certificates" },
			{ icon: "💳", text: "Integrated Razorpay payment gateway for secure online fees" },
		],
	},
	{
		id: "csc_banking",
		title: "Aadhaar Banking",
		subtitle: "Multi-Bank Payment Ecosystem",
		tagline: "Cash exchange, account opening & UPI transactions",
		link: "http://localhost/dashboard",
		bgFrom: "#05100a",
		bgTo: "#061410",
		accentColor: "#00bf8f",
		glowColor: "rgba(0, 191, 143, 0.10)",
		badge: "🏦 Banking",
		badgeColor: "#00bf8f",
		tags: [
			{ label: "Fino Payment Bank", color: "#38bdf8" },
			{ label: "Airtel Bank", color: "#e2e8f0" },
			{ label: "India Post", color: "#00bf8f" },
			{ label: "AEPS", color: "#a78bfa" },
			{ label: "UPI / Cash", color: "#fbbf24" },
		],
		highlights: [
			{ icon: "💵", text: "Instant online-to-cash currency exchange via Bank, UPI, or Aadhaar" },
			{ icon: "🏦", text: "Authorized account opening for Fino & Airtel Payment Bank" },
			{ icon: "📮", text: "India Post Payment Bank services readily available" },
			{ icon: "🔒", text: "Secure Aadhaar-enabled payment system (AEPS) integration" },
		],
	},
	{
		id: "payscan",
		title: "OCR Ledger",
		subtitle: "Automated Transaction Tracking",
		tagline: "AI receipt scanning & analytics for daily cash flow",
		link: "http://localhost/admin/transactions",
		bgFrom: "#0a0c20",
		bgTo: "#0d1030",
		accentColor: "#6366f1",
		glowColor: "rgba(99, 102, 241, 0.12)",
		badge: "📊 Analytics",
		badgeColor: "#6366f1",
		tags: [
			{ label: "Transaction Tracker", color: "#38bdf8" },
			{ label: "OCR Technology", color: "#6366f1" },
			{ label: "Cash Flow", color: "#a78bfa" },
			{ label: "Admin Analytics", color: "#22c55e" },
			{ label: "Reporting", color: "#10b981" },
		],
		highlights: [
			{ icon: "📷", text: "OCR-enabled scanning for fast physical receipt logging" },
			{ icon: "📈", text: "Deep admin analytics dashboard at /admin/analytics" },
			{ icon: "✏️", text: "Edit, approve, and track daily revenue operations" },
			{ icon: "💰", text: "Daily reconciliation of cash vs online Razorpay payments" },
		],
	},
	{
		id: "chatapp",
		title: "Client Portal",
		subtitle: "Real-Time Application Tracking",
		tagline: "Live status updates for customer applications & forms",
		link: "http://localhost/status",
		bgFrom: "#0a0510",
		bgTo: "#100a18",
		accentColor: "#cf55a5",
		glowColor: "rgba(207, 85, 165, 0.10)",
		badge: "📱 Customer Facing",
		badgeColor: "#cf55a5",
		tags: [
			{ label: "Status Tracking", color: "#38bdf8" },
			{ label: "User Dashboard", color: "#cf55a5" },
			{ label: "Live Updates", color: "#22c55e" },
			{ label: "Notifications", color: "#fbbf24" },
		],
		highlights: [
			{ icon: "🔍", text: "Customers can check form status online at /status" },
			{ icon: "👤", text: "Dedicated user dashboard available at /dashboard" },
			{ icon: "⚡", text: "Automated updates for pending, approved, or rejected tasks" },
			{ icon: "⏳", text: "Reduces physical wait times and improves client satisfaction" },
		],
	},
	{
		id: "googledoc",
		title: "Notice Board",
		subtitle: "Admin Post Management",
		tagline: "Create and publish updates for center visitors and locals",
		link: "http://localhost/admin/posts/create",
		bgFrom: "#f0f4f8",
		bgTo: "#e8edf5",
		accentColor: "#2563eb",
		glowColor: "rgba(37, 99, 235, 0.08)",
		badge: "📢 Announcements",
		badgeColor: "#2563eb",
		tags: [
			{ label: "CMS", color: "#38bdf8" },
			{ label: "Post Creation", color: "#2563eb" },
			{ label: "Public Feed", color: "#6366f1" },
			{ label: "Dynamic Content", color: "#10b981" },
		],
		highlights: [
			{ icon: "✍️", text: "Rich text editor for creating informative posts and notices" },
			{ icon: "📢", text: "Publish latest news on government schemes and deadlines" },
			{ icon: "👁️", text: "Public view mode dynamically rendering at /posts/[id]" },
			{ icon: "👥", text: "Collaborative drafting between Shrilal and employees" },
		],
	},
	{
		id: "gemini",
		title: "RailConnect",
		subtitle: "Authorized Ticket Booking",
		tagline: "Fast & reliable train ticket reservations via IRCTC",
		link: "http://localhost/dashboard",
		bgFrom: "#070712",
		bgTo: "#0a0a1e",
		accentColor: "#4285f4",
		glowColor: "rgba(66, 133, 244, 0.08)",
		badge: "🚆 Travel",
		badgeColor: "#4285f4",
		tags: [
			{ label: "IRCTC API", color: "#e2e8f0" },
			{ label: "eRail Integration", color: "#4285f4" },
			{ label: "Tatkal Booking", color: "#ea4335" },
			{ label: "PNR Status", color: "#34a853" },
		],
		highlights: [
			{ icon: "🎫", text: "Official IRCTC agent platform for instant ticket generation" },
			{ icon: "⚡", text: "Hassle-free booking for regular and tatkal quotas" },
			{ icon: "🔄", text: "Check seat availability and live PNR status instantly" },
			{ icon: "💼", text: "Integrated wallet for fast payment deductions" },
		],
	},
]

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
const Projects = () => {
	const isMobile = useIsMobile()
	const sceneRef = useRef(null)

	const projectsWithImages = useMemo(
		() =>
			projects.map((p) => {
				// Map custom SVGs based on project ID
				let imgKeyDesktop = p.id + "_desktop"
				let imgKeyMobile = p.id + "_mobile"
				
				// Map the original IDs to the new SVG definitions if needed
				if(p.id === "payscan") {
					imgKeyDesktop = "payscan_desktop"
					imgKeyMobile = "payscan_mobile"
				} else if (p.id === "chatapp") {
					imgKeyDesktop = "chatapp_desktop"
					imgKeyMobile = "chatapp_mobile"
				} else if (p.id === "googledoc") {
					imgKeyDesktop = "googledoc_desktop"
					imgKeyMobile = "googledoc_mobile"
				} else if (p.id === "gemini") {
					imgKeyDesktop = "csc_travel_desktop"
					imgKeyMobile = "csc_travel_mobile"
				}

				return {
					...p,
					image: isMobile ? IMG[imgKeyMobile] : IMG[imgKeyDesktop],
				}
			}),
		[isMobile]
	)

	const { scrollYProgress } = useScroll({
		target: sceneRef,
		offset: ["start start", "end end"],
	})

	const thresholds = projectsWithImages.map((_, i) => (i + 1) / projectsWithImages.length)
	const [activeIndex, setActiveIndex] = useState(0)

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		const idx = thresholds.findIndex((t) => v <= t)
		setActiveIndex(idx === -1 ? thresholds.length - 1 : idx)
	})

	const active = projectsWithImages[activeIndex]

	// GoogleDoc/Notice Board is light theme
	const isLightTheme = active.id === "googledoc"

	return (
		<section
			ref={sceneRef}
			id="projects"
			style={{
				height: `${100 * projectsWithImages.length}vh`,
				transition: "background 700ms ease",
				background: `radial-gradient(ellipse at 20% 50%, ${active.glowColor} 0%, transparent 60%), linear-gradient(160deg, ${active.bgFrom} 0%, ${active.bgTo} 100%)`,
			}}
		>
			<div className="sticky top-0 h-screen overflow-hidden flex flex-col">

				{/* ── Header strip ── */}
				<div className="shrink-0 pt-6 pb-3 px-6 sm:px-12 flex items-center justify-between">
					<motion.div
						key={active.id + "-badge"}
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45 }}
					>
						<div className="flex items-center gap-3">
							<span
								className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
								style={{
									borderColor: active.accentColor + "44",
									color: active.accentColor,
									backgroundColor: active.accentColor + "12",
								}}
							>
								{active.badge}
							</span>
							<span className={`text-xs font-medium ${isLightTheme ? "text-gray-500" : "text-gray-500"}`}>
								{activeIndex + 1} / {projectsWithImages.length}
							</span>
						</div>
					</motion.div>

					{/* Progress pills */}
					<div className="flex gap-1.5 items-center">
						{projectsWithImages.map((p, i) => (
							<motion.div
								key={i}
								animate={{
									width: i === activeIndex ? 32 : 8,
									backgroundColor: i === activeIndex ? p.accentColor : isLightTheme ? "#d1d5db" : "#374151",
									opacity: i === activeIndex ? 1 : 0.5,
								}}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className="h-2 rounded-full"
							/>
						))}
					</div>
				</div>

				{/* ── Main layout ── */}
				<div
					className={`flex-1 flex ${isMobile ? "flex-col" : "flex-row"} items-center gap-6 px-6 sm:px-12 pb-3 overflow-hidden`}
				>

					{/* LEFT: info panel */}
					<div className={`${isMobile ? "w-full" : "w-[38%] shrink-0"} flex flex-col justify-center`}>
						{projectsWithImages.map((project, index) => (
							<div key={project.id} className={index === activeIndex ? "block" : "hidden"}>
								<AnimatePresence mode="wait">
									{activeIndex === index && (
										<motion.div
											key={project.id + "-info"}
											initial={{ opacity: 0, x: -28 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 28 }}
											transition={{ duration: 0.5, ease: "easeOut" }}
											className="flex flex-col gap-4"
										>
											{/* Title */}
											<div>
												<motion.h2
													className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
													style={{
														color: project.accentColor,
														textShadow: `0 0 40px ${project.accentColor}55`,
													}}
												>
													{project.title}
												</motion.h2>
												<p
													className="mt-1 text-lg sm:text-xl font-semibold"
													style={{ color: isLightTheme ? "#1f2937" : "#d1d5db" }}
												>
													{project.subtitle}
												</p>
												<p
													className="mt-1 text-sm"
													style={{ color: isLightTheme ? "#6b7280" : "#6b7280" }}
												>
													{project.tagline}
												</p>
											</div>

											{/* Highlights */}
											<div className="flex flex-col gap-2">
												{project.highlights.map((h, i) => (
													<motion.div
														key={i}
														className="flex items-start gap-2.5 text-sm"
														style={{ color: isLightTheme ? "#4b5563" : "#9ca3af" }}
														initial={{ opacity: 0, x: -10 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
													>
														<span className="text-base mt-0.5 shrink-0">{h.icon}</span>
														<span>{h.text}</span>
													</motion.div>
												))}
											</div>

											{/* Tech tags */}
											<div className="flex flex-wrap gap-1.5">
												{project.tags.map((t) => techBadge(t.label, t.color))}
											</div>

											{/* CTA buttons */}
											<div className="flex gap-3 mt-1 flex-wrap">
												<a
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-black transition-all hover:scale-105 shadow-lg"
													style={{
														background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}cc)`,
														boxShadow: `0 8px 32px ${project.accentColor}40`,
														color: isLightTheme ? "#fff" : "#000",
													}}
												>
													🌐 Live Portal
												</a>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						))}
					</div>

					{/* RIGHT: screenshot */}
					<div
						className={`${isMobile ? "w-full h-[40vh]" : "flex-1 h-full"} relative flex items-center justify-center`}
					>
						{projectsWithImages.map((project, index) => (
							<div
								key={project.id}
								className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
									}`}
							>
								<AnimatePresence mode="wait">
									{activeIndex === index && (
										<motion.div
											key={project.id + "-img"}
											initial={{ opacity: 0, y: 20, scale: 0.97 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -20, scale: 0.97 }}
											transition={{ duration: 0.55, ease: "easeOut" }}
											className="relative w-full h-full flex items-center justify-center"
										>
											{/* ambient glow */}
											<div
												className="absolute inset-0 rounded-2xl"
												style={{
													background: `radial-gradient(ellipse at center, ${project.accentColor}18 0%, transparent 70%)`,
													filter: "blur(30px)",
												}}
											/>
											<img
												src={project.image}
												alt={project.title}
												className={`relative z-10 rounded-xl object-contain ${isMobile ? "max-h-[36vh] w-auto" : "max-h-[70vh] max-w-full w-auto"
													}`}
												style={{
													filter: `drop-shadow(0 20px 60px ${project.accentColor}28)`,
													border: `1px solid ${project.accentColor}20`,
												}}
												loading="lazy"
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						))}
					</div>
				</div>

				{/* ── Scroll hint ── */}
				<motion.div
					className="shrink-0 pb-5 flex justify-center"
					animate={{ y: [0, 6, 0] }}
					transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
				>
					{activeIndex < projectsWithImages.length - 1 ? (
						<div className="flex flex-col items-center gap-1">
							<span
								className="text-xs"
								style={{ color: isLightTheme ? "#9ca3af" : "#4b5563" }}
							>
								scroll for next service
							</span>
							<span style={{ color: active.accentColor }}>↓</span>
						</div>
					) : (
						<div className="flex flex-col items-center gap-1">
							<span
								className="text-xs"
								style={{ color: isLightTheme ? "#9ca3af" : "#4b5563" }}
							>
								that's all the services
							</span>
							<a
								href="#contact"
								className="text-xs font-medium hover:underline"
								style={{ color: active.accentColor }}
							>
								get in touch →
							</a>
						</div>
					)}
				</motion.div>
			</div>
		</section>
	)
}

export default Projects