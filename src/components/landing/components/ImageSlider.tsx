
// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { getGalleryImagesAction } from "@/app/actions/admin";

// export default function ImageSlider({ isDark = false }: { isDark?: boolean }) {
// 	const [images, setImages] = useState<any[]>([]);
// 	const [currentIndex, setCurrentIndex] = useState(0);
// 	const [isLoading, setIsLoading] = useState(true);

// 	const accent = isDark ? '#f59e0b' : '#2563eb';
// 	const accent2 = isDark ? '#d97706' : '#1d4ed8';
// 	const bg = isDark ? '#020610' : '#f1f5f9';
// 	const text = isDark ? '#f1f5f9' : '#1e293b';

// 	useEffect(() => {
// 		const fetchImages = async () => {
// 			try {
// 				const data = await getGalleryImagesAction();
// 				setImages(data);
// 			} catch (err) {
// 				console.error("Failed to fetch slider images:", err);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};
// 		fetchImages();
// 	}, []);

// 	const nextSlide = useCallback(() => {
// 		if (images.length <= 1) return;
// 		setCurrentIndex((prev) => (prev + 1) % images.length);
// 	}, [images.length]);

// 	const prevSlide = () => {
// 		if (images.length <= 1) return;
// 		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
// 	};

// 	useEffect(() => {
// 		if (images.length <= 1) return;
// 		const interval = setInterval(nextSlide, 4000);
// 		return () => clearInterval(interval);
// 	}, [nextSlide, images.length]);

// 	if (isLoading) {
// 		return (
// 			<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center border-b z-10 pt-[70px]"
// 				style={{ background: bg, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
// 				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] opacity-[0.07] blur-[120px] rounded-full animate-pulse"
// 					style={{ background: accent }} />
// 				<div className="relative z-10 flex flex-col items-center gap-6">
// 					<div className="relative w-20 h-20">
// 						<div className="absolute inset-0 rounded-full border-[2px] border-transparent animate-[spin_1.5s_linear_infinite]"
// 							style={{ borderTopColor: accent, borderRightColor: accent }} />
// 						<div className="absolute inset-2 rounded-full border-[2px] border-transparent animate-[spin_2s_linear_infinite_reverse]"
// 							style={{ borderBottomColor: accent2, borderLeftColor: accent2 }} />
// 						<div className="absolute inset-0 flex items-center justify-center">
// 							<span className="font-bold text-2xl font-serif" style={{ color: text }}>S</span>
// 						</div>
// 					</div>
// 					<div className="flex flex-col items-center gap-2">
// 						<span className="font-mono tracking-[0.3em] text-xs uppercase animate-pulse" style={{ color: accent }}>
// 							Initializing Media
// 						</span>
// 						<div className="w-32 h-[2px] rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
// 							<div className="h-full w-1/2 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
// 								style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	if (images.length === 0) return null;

// 	return (
// 		<div className="relative w-full h-screen group overflow-hidden border-b z-10 pt-[70px] animate-in fade-in duration-1000"
// 			style={{ background: isDark ? '#000' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
// 			<div className="w-full h-full flex transition-transform duration-700 ease-in-out"
// 				style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
// 				{images.map((img, index) => (
// 					<div key={img.id || index} className="min-w-full h-full relative">
// 						<img src={img.url} alt={img.title || `Banner image ${index + 1}`}
// 							className="w-full h-full object-cover"
// 							loading={index === 0 ? "eager" : "lazy"} />
// 					</div>
// 				))}
// 			</div>

// 			<button onClick={prevSlide}
// 				className="absolute top-[50%] -translate-y-[50%] left-4 md:left-8 text-2xl rounded-full p-2 md:p-3 cursor-pointer hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
// 				style={{ background: 'rgba(0,0,0,0.40)', color: '#fff' }}>
// 				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
// 					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
// 				</svg>
// 			</button>

// 			<button onClick={nextSlide}
// 				className="absolute top-[50%] -translate-y-[50%] right-4 md:right-8 text-2xl rounded-full p-2 md:p-3 cursor-pointer hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
// 				style={{ background: 'rgba(0,0,0,0.40)', color: '#fff' }}>
// 				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
// 					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
// 				</svg>
// 			</button>

// 			<div className="absolute bottom-4 flex justify-center w-full gap-3 z-20">
// 				{images.map((_, slideIndex) => (
// 					<button key={slideIndex} onClick={() => setCurrentIndex(slideIndex)}
// 						className="h-2.5 rounded-full transition-all duration-300"
// 						style={{
// 							width: currentIndex === slideIndex ? 32 : 10,
// 							background: currentIndex === slideIndex ? accent : (isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.30)'),
// 							boxShadow: currentIndex === slideIndex ? `0 0 8px ${accent}` : 'none'
// 						}}
// 						aria-label={`Go to slide ${slideIndex + 1}`} />
// 				))}
// 			</div>
// 		</div>
// 	);
// }














"use client";

/**
 * ImageSlider.tsx — REDESIGNED for
 * D:\csc-platform\src\components\landing\components\ImageSlider.tsx
 *
 * Extension is .tsx, so this file is TSX (types kept). Same props as
 * before: ImageSlider({ isDark = false }: { isDark?: boolean }).
 *
 * DESIGN (a redesign, not the old layout cleaned up):
 * A gallery slider, not a loading show. The old loading state was
 * the loudest thing on the page — two spinning rings, a serif "S",
 * "Initializing Media" and a pinging gradient bar — for a gallery
 * that usually loads in a blink. The slider itself is unchanged in
 * behaviour, just quieter: plain loading text, always-visible arrows
 * (the old ones only appeared on hover, so touch and keyboard users
 * never saw them), dots with a current state, and the auto-advance
 * pauses while someone is looking at a slide.
 *
 * KEPT, exactly as supplied:
 * - The gallery fetch: getGalleryImagesAction from
 *   @/app/actions/admin, error logged to console, isLoading cleared
 *   in `finally`.
 * - nextSlide / prevSlide (wrap around, no-op when 1 or 0 images).
 * - Auto-advance every 4 seconds, only when there is more than
 *   one image.
 * - Empty gallery renders nothing; loading renders the loading state.
 * - First image eager, the rest lazy; alt from img.title, falling
 *   back to "Banner image N".
 * - The slide track (translateX by currentIndex) — no motion library.
 *
 * CHANGED, small and safe:
 * - Loading state: one small spinner and the words "Loading
 *   gallery…". The glow blob, the double rings, the serif "S", the
 *   "Initializing Media" label and the pinging bar are gone.
 * - Arrows: lucide ChevronLeft / ChevronRight, always visible, with
 *   aria-labels (the old ones had none). The old arrows also scaled
 *   110% on hover; they don't now.
 * - Dots: the active dot is solid blue, the rest are neutral — no
 *   glow shadow. Each dot has aria-current on the active one.
 * - Auto-advance pauses on hover and on focus inside the slider, so
 *   it never slides away from someone reading a caption. It resumes
 *   when the pointer leaves.
 * - Captions: the image title was only used as alt text. If an image
 *   has a title, it now also shows as a small caption at the bottom
 *   left — that is the gallery's own data, not invented copy.
 * - One accent in both themes (blue), instead of blue light / amber
 *   dark. The isDark prop is still accepted and synced to the `dark`
 *   class, like every other section.
 *
 * NOTE ON THE TOP PADDING: the pt-[70px] is kept exactly as
 * supplied — it compensated for the old fixed header. If you applied
 * the new sticky Navbar.jsx, that padding is now a 70px dead gap
 * above the slider and you can delete the pt-[70px] class. If you
 * are still on the old fixed header, leave it.
 *
 * No new file is needed. Setup: tailwind.config.js -> darkMode: "class".
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGalleryImagesAction } from "@/app/actions/admin";

export default function ImageSlider({ isDark = false }: { isDark?: boolean }) {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Keep the parent's isDark prop as the source of truth, and sync it
  // to the `dark` class so Tailwind's dark: variants work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImagesAction();
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch slider images:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const nextSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, images.length, isPaused]);

  if (isLoading) {
    return (
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center border-b border-slate-200 bg-slate-100 pt-[70px] dark:border-slate-800 dark:bg-[#0b1220]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700 dark:border-slate-700 dark:border-t-blue-400"
          role="status"
          aria-label="Loading gallery"
        />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading gallery…</p>
      </div>
    );
  }

  if (images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Centre gallery"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative z-10 h-[calc(100vh-105px)] w-full overflow-hidden border-b border-slate-200 bg-white pt-[0px] dark:border-slate-800 dark:bg-black"
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={img.id || index} className="relative h-full min-w-full">
            <img
              src={img.url}
              alt={img.title || `Banner image ${index + 1}`}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Caption — the gallery image's own title, when it has one */}
      {current?.title && (
        <p className="absolute bottom-14 left-4 z-20 max-w-[80%] rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white md:left-8">
          {current.title}
        </p>
      )}

      <button
        onClick={prevSlide}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 md:left-8 md:p-3"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next image"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 md:right-8 md:p-3"
      >
        <ChevronRight className="h-6 w-6" aria-hidden />
      </button>

      <div className="absolute bottom-4 z-20 flex w-full justify-center gap-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={currentIndex === slideIndex}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex
                ? "w-8 bg-blue-700 dark:bg-blue-500"
                : "w-2.5 bg-black/30 dark:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
