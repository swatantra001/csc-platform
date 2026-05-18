
import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,
  // Add this line to tell Next.js you are fine with Turbopack defaults
  turbopack: {},
 
  // Image optimization — allow Supabase storage + external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudflare.com",
      },
    ],
  },
 
  // Environment variables exposed to the browser (NEXT_PUBLIC_ prefix)
  // All other env vars are server-only — never exposed to client
  env: {
    NEXT_PUBLIC_APP_URL:            process.env.NEXT_PUBLIC_APP_URL            || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL:       process.env.NEXT_PUBLIC_SUPABASE_URL       || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || "",
    NEXT_PUBLIC_RAZORPAY_KEY_ID:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID    || "",
  },
 
  // Headers — security + CORS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(self *)" },
        ],
      },
      // Allow Razorpay iframe
      {
        source: "/pay/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
 
  // Redirects
  async redirects() {
    return [
      // Old paths
      { source: "/home",   destination: "/",         permanent: true },
      { source: "/login",  destination: "/?login=1", permanent: false },
      { source: "/logout", destination: "/api/auth/logout", permanent: false },
    ];
  },
 
  // Webpack — handle Node.js modules used in edge runtime
  webpack(config) {
    // 1. Alias sharp and onnxruntime-node so Webpack completely ignores them for the browser
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp": false,
      "onnxruntime-node": false,
    };
    
    // 2. Fallbacks for node-native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
 
  // Experimental features
  experimental: {
    // Server actions for form submissions
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL?.replace("https://", "") || "",
      ],
      bodySizeLimit: '10mb', // ✨ Increases the limit to 10MB
    },
  },
};
 
export default nextConfig;