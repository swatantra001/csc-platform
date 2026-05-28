
"use client";
import { useState, useEffect, useCallback } from "react";
import { getGalleryImagesAction } from "@/app/actions/admin";

export default function ImageSlider({ isDark = false }: { isDark?: boolean }) {
	const [images, setImages] = useState<any[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const accent = isDark ? '#f59e0b' : '#2563eb';
	const accent2 = isDark ? '#d97706' : '#1d4ed8';
	const bg = isDark ? '#020610' : '#f1f5f9';
	const text = isDark ? '#f1f5f9' : '#1e293b';

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
		if (images.length <= 1) return;
		const interval = setInterval(nextSlide, 4000);
		return () => clearInterval(interval);
	}, [nextSlide, images.length]);

	if (isLoading) {
		return (
			<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center border-b z-10 pt-[70px]"
				style={{ background: bg, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] opacity-[0.07] blur-[120px] rounded-full animate-pulse"
					style={{ background: accent }} />
				<div className="relative z-10 flex flex-col items-center gap-6">
					<div className="relative w-20 h-20">
						<div className="absolute inset-0 rounded-full border-[2px] border-transparent animate-[spin_1.5s_linear_infinite]"
							style={{ borderTopColor: accent, borderRightColor: accent }} />
						<div className="absolute inset-2 rounded-full border-[2px] border-transparent animate-[spin_2s_linear_infinite_reverse]"
							style={{ borderBottomColor: accent2, borderLeftColor: accent2 }} />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="font-bold text-2xl font-serif" style={{ color: text }}>S</span>
						</div>
					</div>
					<div className="flex flex-col items-center gap-2">
						<span className="font-mono tracking-[0.3em] text-xs uppercase animate-pulse" style={{ color: accent }}>
							Initializing Media
						</span>
						<div className="w-32 h-[2px] rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
							<div className="h-full w-1/2 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
								style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (images.length === 0) return null;

	return (
		<div className="relative w-full h-screen group overflow-hidden border-b z-10 pt-[70px] animate-in fade-in duration-1000"
			style={{ background: isDark ? '#000' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }}>
			<div className="w-full h-full flex transition-transform duration-700 ease-in-out"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
				{images.map((img, index) => (
					<div key={img.id || index} className="min-w-full h-full relative">
						<img src={img.url} alt={img.title || `Banner image ${index + 1}`}
							className="w-full h-full object-cover"
							loading={index === 0 ? "eager" : "lazy"} />
					</div>
				))}
			</div>

			<button onClick={prevSlide}
				className="absolute top-[50%] -translate-y-[50%] left-4 md:left-8 text-2xl rounded-full p-2 md:p-3 cursor-pointer hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
				style={{ background: 'rgba(0,0,0,0.40)', color: '#fff' }}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>

			<button onClick={nextSlide}
				className="absolute top-[50%] -translate-y-[50%] right-4 md:right-8 text-2xl rounded-full p-2 md:p-3 cursor-pointer hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
				style={{ background: 'rgba(0,0,0,0.40)', color: '#fff' }}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			<div className="absolute bottom-4 flex justify-center w-full gap-3 z-20">
				{images.map((_, slideIndex) => (
					<button key={slideIndex} onClick={() => setCurrentIndex(slideIndex)}
						className="h-2.5 rounded-full transition-all duration-300"
						style={{
							width: currentIndex === slideIndex ? 32 : 10,
							background: currentIndex === slideIndex ? accent : (isDark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.30)'),
							boxShadow: currentIndex === slideIndex ? `0 0 8px ${accent}` : 'none'
						}}
						aria-label={`Go to slide ${slideIndex + 1}`} />
				))}
			</div>
		</div>
	);
}