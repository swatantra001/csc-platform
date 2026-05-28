// import type { Metadata, Viewport } from "next";
// import { AuthProvider } from "@/components/AuthProvider";
// import "./globals.css"; // <--- ✨ THIS IS THE MISSING MAGIC LINE ✨

// // ── Metadata ───────────────────────────────────────────────────────────────
// export const metadata: Metadata = {
//   title: {
//     default: "श्रीलाल जन सेवा केंद्र, बक्सा | Srilal Sahaj Jan Seva Kendra, Shambhuganj — Jaunpur, UP",
//     template: "%s |Srilal Sahaj Jan Seva Kendra Shambhuganj",
//   },
//   description:
//     "Government-certified Common Service Centre in Shambhuganj, Jaunpur, Uttar Pradesh. Aadhaar, PAN, tickets, money transfer, scholarships and 30+ services.",
//   keywords: [
//     "CSC Shambhuganj", "Srilal Sahaj Jan Seva Kendra Jaunpur", "Aadhaar center Jaunpur",
//     "PAN card Jaunpur", "Common Service Centre UP", "श्रीलाल जन सेवा केंद्र बक्सा",
//   ],
//   authors: [{ name: "Srilal Sahaj Jan Seva Kendra, Shambhuganj" }],
//   creator: "Srilal Sahaj Jan Seva Kendra, Shambhuganj",
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_APP_URL || "https://csc-shambhuganj.vercel.app"
//   ),
//   openGraph: {
//     type: "website",
//     locale: "hi_IN",
//     alternateLocale: "en_IN",
//     siteName: "Srilal Sahaj Jan Seva Kendra, Shambhuganj",
//     title: "श्रीलाल जन सेवा केंद्र, शंभूगंज — Jaunpur UP",
//     description: "30+ government & financial services. Aadhaar, PAN, tickets, money transfer.",
//   },
//   robots: { index: true, follow: true },
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
//     { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
//   ],
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 5,
// };

// // ── Root Layout ────────────────────────────────────────────────────────────
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="hi" suppressHydrationWarning>
//       <head>
//         {/* Google Fonts — preconnect for performance */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link
//           rel="preconnect"
//           href="https://fonts.gstatic.com"
//           crossOrigin="anonymous"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700;900&family=Noto+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Sans+Devanagari:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap"
//           rel="stylesheet"
//         />

//         <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

//         {/* ✅ FIXED: Inline theme script using raw HTML to prevent Next.js crashes */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function() {
//                 try {
//                   var theme = localStorage.getItem("csc_theme");
//                   if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
//                     document.documentElement.classList.add("dark");
//                   }
//                 } catch (e) {}
//               })();
//             `,
//           }}
//         />
//       </head>

//       <body
//         style={{
//           margin: 0,
//           padding: 0,
//           fontFamily:
//             "'Noto Sans', 'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif",
//           WebkitFontSmoothing: "antialiased",
//           MozOsxFontSmoothing: "grayscale",
//         }}
//       >
//         {/* Global CSS variables injected here for theme consistency */}
//         <style>{`
//           :root {
//             --color-accent:      #c45c1a;
//             --color-accent-dark: #a34a12;
//             --color-navy:        #1a3a5c;
//             --color-green:       #1a7a3a;
//             --color-gold:        #c8860a;
//             --color-red:         #c0392b;
//             --color-teal:        #00c8a0;
//             --font-serif:        'Noto Serif Devanagari', 'Lora', serif;
//             --font-sans:         'Noto Sans', 'Noto Sans Devanagari', 'IBM Plex Sans', sans-serif;
//             --font-mono:         'JetBrains Mono', 'IBM Plex Mono', monospace;
//           }
//           *, *::before, *::after { box-sizing: border-box; }
//           html { scroll-behavior: smooth; }
//           body { min-height: 100vh; }
//           ::selection { background: rgba(196, 92, 26, 0.2); }
//           /* Scrollbar */
//           ::-webkit-scrollbar       { width: 5px; height: 5px; }
//           ::-webkit-scrollbar-track { background: transparent; }
//           ::-webkit-scrollbar-thumb { background: #c8bfb0; border-radius: 3px; }
//           .dark ::-webkit-scrollbar-thumb { background: #3a3830; }
//           /* Focus ring */
//           :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
//           /* Remove default button/input styles */
//           button, input, textarea, select {
//             font-family: inherit;
//             font-size: inherit;
//           }
//           /* Prevent layout shift from scrollbar */
//           html { scrollbar-gutter: stable; }
//           .leaflet-tile-pane {
//   filter: invert(1) hue-rotate(180deg) contrast(0.9) brightness(0.85) saturate(0.8);
// }
//         `}</style>

//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }




















import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "श्रीलाल सहज जन सेवा केंद्र, शंभूगंज, जौनपुर | Srilal Sahaj Jan Seva Kendra, Shambhuganj — Jaunpur, UP",
    template: "%s | Srilal Sahaj Jan Seva Kendra Shambhuganj",
  },
  description:
    "सरकारी प्रमाणित सामान्य सेवा केंद्र (CSC) — शंभूगंज, जौनपुर, उत्तर प्रदेश। आधार, पैन कार्ड, टिकट बुकिंग, मनी ट्रांसफर, छात्रवृत्ति, बिल भुगतान और 30+ डिजिटल सेवाएं। Government-certified Common Service Centre in Shambhuganj, Jaunpur, UP. Aadhaar, PAN, tickets, money transfer, scholarships & 30+ services.",
  keywords: [
    // Brand / Owner
    "srilal csc",
    "srilalcsc",
    "srilalsahaj",
    "srilal yadav",
    "srilalyadav",
    "swatantra maurya",
    "swatantramaurya",
    "Srilal Sahaj Jan Seva Kendra",
    "श्रीलाल सहज जन सेवा केंद्र",
    "श्रीलाल सीएससी",
    "श्रीलाल यादव",
    "स्वतंत्र मौर्य",

    // Location + CSC
    "shambhuganj csc",
    "csc shambhuganj",
    "csc shambhuganj jaunpur",
    "common service center in shambhuganj",
    "common service centre in shambhuganj",
    "common service center in jaunpur",
    "common service centre in jaunpur",
    "csc jaunpur",
    "csc center jaunpur",
    "csc centre jaunpur",
    "csc jaunpur up",
    "सीएससी शंभूगंज",
    "सीएससी जौनपुर",
    "सामान्य सेवा केंद्र शंभूगंज",
    "सामान्य सेवा केंद्र जौनपुर",

    // Sahaj / Jan Seva
    "sahaj jan seva kendra",
    "sahaj janseva kendra",
    "sahaj jan seva kendra in shambhuganj",
    "sahaj jan seva kendra in jaunpur",
    "jan seva kendra shambhuganj",
    "jan seva kendra jaunpur",
    "सहज जन सेवा केंद्र",
    "सहज जन सेवा केंद्र शंभूगंज",
    "सहज जन सेवा केंद्र जौनपुर",
    "जन सेवा केंद्र शंभूगंज",
    "जन सेवा केंद्र जौनपुर",

    // Services
    "shambhuganj computer course",
    "computer course shambhuganj",
    "computer course jaunpur",
    "typing center shambhuganj",
    "typing centre shambhuganj",
    "aadhaar center shambhuganj",
    "aadhaar centre shambhuganj",
    "aadhaar center jaunpur",
    "pan card shambhuganj",
    "pan card jaunpur",
    "ticket booking shambhuganj",
    "money transfer shambhuganj",
    "bill payment shambhuganj",
    "scholarship form shambhuganj",
    "ration card shambhuganj",
    "voter id shambhuganj",
    "driving license shambhuganj",
    "कंप्यूटर कोर्स शंभूगंज",
    "कंप्यूटर कोर्स जौनपुर",
    "टाइपिंग सेंटर शंभूगंज",
    "आधार केंद्र शंभूगंज",
    "पैन कार्ड शंभूगंज",
    "टिकट बुकिंग शंभूगंज",
    "मनी ट्रांसफर शंभूगंज",
    "बिल पेमेंट शंभूगंज",
    "छात्रवृत्ति फॉर्म शंभूगंज",
    "राशन कार्ड शंभूगंज",
    "वोटर आईडी शंभूगंज",
    "ड्राइविंग लाइसेंस शंभूगंज",

    // Government schemes
    "ayushman bharat shambhuganj",
    "pm kisan shambhuganj",
    "pm kisan jaunpur",
    "e shram card shambhuganj",
    "e shram jaunpur",
    "pension yojana shambhuganj",
    "birth certificate shambhuganj",
    "death certificate shambhuganj",
    "caste certificate shambhuganj",
    "income certificate shambhuganj",
    "domicile certificate shambhuganj",
    "आयुष्मान भारत शंभूगंज",
    "पीएम किसान शंभूगंज",
    "ई श्रम कार्ड शंभूगंज",
    "पेंशन योजना शंभूगंज",
    "जन्म प्रमाण पत्र शंभूगंज",
    "मृत्यु प्रमाण पत्र शंभूगंज",
    "जाति प्रमाण पत्र शंभूगंज",
    "आय प्रमाण पत्र शंभूगंज",
    "निवास प्रमाण पत्र शंभूगंज",

    // WhatsApp-style / Local
    "shambhuganj sarkari seva",
    "shambhuganj sarkari kendra",
    "jaunpur sarkari seva",
    "jaunpur sarkari kendra",
    "digital seva kendra shambhuganj",
    "digital seva kendra jaunpur",
    "jan suvidha kendra shambhuganj",
    "jan suvidha kendra jaunpur",
    "e mitra shambhuganj",
    "e mitra jaunpur",
    "csc near me jaunpur",
    "csc near me shambhuganj",
    "nearest csc center jaunpur",
    "nearest csc center shambhuganj",
    "शंभूगंज सरकारी सेवा",
    "शंभूगंज सरकारी केंद्र",
    "जौनपुर सरकारी सेवा",
    "जौनपुर सरकारी केंद्र",
    "डिजिटल सेवा केंद्र शंभूगंज",
    "डिजिटल सेवा केंद्र जौनपुर",
    "जन सुविधा केंद्र शंभूगंज",
    "जन सुविधा केंद्र जौनपुर",
    "ई मित्र शंभूगंज",
    "ई मित्र जौनपुर",
    "मेरे पास सीएससी केंद्र जौनपुर",
    "नजदीकी सीएससी केंद्र शंभूगंज",
  ],
  authors: [{ name: "Srilal Sahaj Jan Seva Kendra, Shambhuganj" }],
  creator: "Srilal Sahaj Jan Seva Kendra, Shambhuganj",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://csc-shambhuganj.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: "en_IN",
    siteName: "Srilal Sahaj Jan Seva Kendra, Shambhuganj",
    title: "श्रीलाल सहज जन सेवा केंद्र, शंभूगंज — Jaunpur UP",
    description: "30+ government & financial services. Aadhaar, PAN, tickets, money transfer.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Srilal Sahaj Jan Seva Kendra - CSC Shambhuganj Jaunpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srilal Sahaj Jan Seva Kendra, Shambhuganj — Jaunpur, UP",
    description: "Government-certified CSC center. Aadhaar, PAN, tickets, money transfer & 30+ services.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/icon-512x512.png" },
    ],
  },
  alternates: {
    canonical: "/",
    languages: {
      "hi-IN": "/hi",
      "en-IN": "/en",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "government services",
  classification: "Common Service Centre",
  referrer: "origin-when-cross-origin",
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Shambhuganj, Jaunpur",
    "geo.position": "25.7461;82.6837",
    "ICBM": "25.7461, 82.6837",
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

        {/* Inline theme script */}
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

        {/* Structured Data — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOffice",
              name: "Srilal Sahaj Jan Seva Kendra",
              alternateName: ["Srilal CSC", "श्रीलाल सहज जन सेवा केंद्र", "Srilal Sahaj Janseva Kendra"],
              description: "Government-certified Common Service Centre (CSC) in Shambhuganj, Jaunpur, Uttar Pradesh. Aadhaar, PAN, tickets, money transfer, scholarships and 30+ digital services.",
              url: "https://srilalsahaj.co.in",
              logo: "https://srilalsahaj.co.in/favicon.ico",
              image: "https://srilalsahaj.co.in/og-image.jpg",
              telephone: "+91-9005623112",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Shambhuganj",
                addressLocality: "Jaunpur",
                addressRegion: "Uttar Pradesh",
                postalCode: "222001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 25.7461,
                longitude: 82.6837,
              },
              areaServed: {
                "@type": "City",
                name: "Jaunpur",
                containedInPlace: {
                  "@type": "State",
                  name: "Uttar Pradesh",
                },
              },
              serviceType: [
                "Aadhaar Services",
                "PAN Card Services",
                "Ticket Booking",
                "Money Transfer",
                "Bill Payment",
                "Scholarship Forms",
                "Computer Courses",
                "Government Scheme Registration",
              ],
              openingHours: ["Mo-Sa 09:00-18:00"],
              priceRange: "₹",
              sameAs: [
                "https://wa.me/919005623112",
              ],
              founder: {
                "@type": "Person",
                name: "Swatantra Maurya",
                alternateName: "Srilal Yadav",
              },
              isPartOf: {
                "@type": "Organization",
                name: "Common Service Centre Scheme",
                url: "https://csc.gov.in",
              },
            }),
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
        {/* Global CSS variables */}
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
          ::-webkit-scrollbar       { width: 5px; height: 5px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #c8bfb0; border-radius: 3px; }
          .dark ::-webkit-scrollbar-thumb { background: #3a3830; }
          :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
          button, input, textarea, select {
            font-family: inherit;
            font-size: inherit;
          }
          html { scrollbar-gutter: stable; }
          .leaflet-tile-pane {
            filter: invert(1) hue-rotate(180deg) contrast(0.9) brightness(0.85) saturate(0.8);
          }
        `}</style>

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}