
"use client";
import { useState, useEffect } from "react";

import CustomCursor from "@/components/landing/components/CustomCursor";
import Navbar from "@/components/landing/components/Navbar";
import ImageSlider from "@/components/landing/components/ImageSlider";

import About from "@/components/landing/sections/About";
import Skills from "@/components/landing/sections/Skills";
import Projects from "@/components/landing/sections/Projects";
import Home from "@/components/landing/sections/Home";
import Experience from "@/components/landing/sections/Experience";
import Contact from "@/components/landing/sections/Contact";
import Footer from "@/components/landing/sections/Footer";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  // Init theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("csc_theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Single toggle function — shared with Navbar
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("csc_theme", newDark ? "dark" : "light");
  };

  const pageBg = isDark ? '#060b14' : '#f1f5f9';
  const pageText = isDark ? '#f1f5f9' : '#1e293b';

  return (
    <main className="relative min-h-screen" style={{ background: pageBg, color: pageText, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      <CustomCursor isDark={isDark} />
      
      {/* Pass isDark AND toggleTheme to Navbar */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <ImageSlider isDark={isDark} />
      
      <Home isDark={isDark} />
      <About isDark={isDark} />
      <Skills isDark={isDark} />
      <Projects isDark={isDark} />
      <Experience isDark={isDark} />
      <Contact isDark={isDark} />
      <Footer isDark={isDark} />

      <div className="flex justify-center py-10">
        <a href="/dashboard"
          className="px-8 py-4 rounded-lg font-bold text-xl transition hover:-translate-y-0.5"
          style={{
            background: isDark ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color: isDark ? '#000' : '#fff',
            boxShadow: isDark ? '0 4px 20px rgba(245,158,11,0.35)' : '0 4px 20px rgba(37,99,235,0.30)'
          }}>
          Enter Jan Seva Kendra App →
        </a>
      </div>
    </main>
  );
}