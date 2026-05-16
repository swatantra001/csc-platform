import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css"; // <--- ✨ THIS IS THE MISSING MAGIC LINE ✨

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "श्रीलाल जन सेवा केंद्र, बक्सा | Shreelal Jan Seva Kendra, Shambhuganj — Jaunpur, UP",
    template: "%s |Shreelal Jan Seva Kendra Shambhuganj",
  },
  description:
    "Government-certified Common Service Centre in Shambhuganj, Jaunpur, Uttar Pradesh. Aadhaar, PAN, tickets, money transfer, scholarships and 30+ services.",
  keywords: [
    "CSC Shambhuganj", "Shreelal Jan Seva Kendra Jaunpur", "Aadhaar center Jaunpur",
    "PAN card Jaunpur", "Common Service Centre UP", "श्रीलाल जन सेवा केंद्र बक्सा",
  ],
  authors: [{ name: "Shreelal Jan Seva Kendra, Shambhuganj" }],
  creator: "Shreelal Jan Seva Kendra, Shambhuganj",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://csc-shambhuganj.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: "en_IN",
    siteName: "Shreelal Jan Seva Kendra, Shambhuganj",
    title: "श्रीलाल जन सेवा केंद्र, शंभूगंज — Jaunpur UP",
    description: "30+ government & financial services. Aadhaar, PAN, tickets, money transfer.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        {/* Google Fonts — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700;900&family=Noto+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Sans+Devanagari:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />

        {/* ✅ FIXED: Inline theme script using raw HTML to prevent Next.js crashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("csc_theme");
                  if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                    document.documentElement.classList.add("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            "'Noto Sans', 'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {/* Global CSS variables injected here for theme consistency */}
        <style>{`
          :root {
            --color-accent:      #c45c1a;
            --color-accent-dark: #a34a12;
            --color-navy:        #1a3a5c;
            --color-green:       #1a7a3a;
            --color-gold:        #c8860a;
            --color-red:         #c0392b;
            --color-teal:        #00c8a0;
            --font-serif:        'Noto Serif Devanagari', 'Lora', serif;
            --font-sans:         'Noto Sans', 'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif;
            --font-mono:         'JetBrains Mono', 'IBM Plex Mono', monospace;
          }
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { min-height: 100vh; }
          ::selection { background: rgba(196, 92, 26, 0.2); }
          /* Scrollbar */
          ::-webkit-scrollbar       { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #c8bfb0; border-radius: 3px; }
          .dark ::-webkit-scrollbar-thumb { background: #3a3830; }
          /* Focus ring */
          :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
          /* Remove default button/input styles */
          button, input, textarea, select {
            font-family: inherit;
            font-size: inherit;
          }
          /* Prevent layout shift from scrollbar */
          html { scrollbar-gutter: stable; }
        `}</style>

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}