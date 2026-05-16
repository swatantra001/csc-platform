import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { 
  Building2, Clock, Award, Users, CreditCard, Train, 
  Landmark, Smartphone, ShieldCheck, Mail, Phone, MapPin, 
  ExternalLink, BarChart, FileText, CheckCircle, Upload,
  Fingerprint, Wallet, Banknote, UserCheck, ScrollText, FileCheck,
  Plane, Bus, Car, Zap, Wifi, ShieldPlus, HeartPulse, Database, Monitor, Activity,
  FileCheck2,
  BarChart2,
  FileTextIcon,
  ScrollTextIcon,
  CheckCircle2,
  Users2Icon,
  CheckCircle2Icon,
  UploadIcon,
  FileCheck2Icon,
  BarChart2Icon,
  ExternalLinkIcon
} from 'lucide-react';

// ── Background Glows ──
const glows = [
  "-top-10 -left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
  "bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[100px]"
];

// ── Hero Stats ──
const stats = [
  { label: "Location", value: "Shambhuganj, Jaunpur" },
  { label: "Experience", value: "10+ Years" },
  { label: "Certification", value: "CSC Certified" },
  { label: "Availability", value: "9 AM - 9 PM Daily" },
  { label: "Dedicated Staff", value: "2 Employees" },
  { label: "Role", value: "Block Operator, Shambhuganj" },
];

// ── Service Categories (Adapted from Skills.jsx) ──
const categories = [
    {
        label: "Financial Services",
        color: "from-cyan-500/20 to-teal-500/20",
        border: "border-cyan-500/20",
        accent: "text-cyan-400",
        items: [
            { icon: <Fingerprint size={18} />, name: "AePS (Aadhar ATM)" },
            { icon: <Landmark size={18} />, name: "Account Opening" },
            { icon: <Wallet size={18} />, name: "Money Transfer" },
            { icon: <Banknote size={18} />, name: "Cash Withdrawal" },
        ]
    },
    {
        label: "E-Governance",
        color: "from-emerald-500/20 to-green-500/20",
        border: "border-emerald-500/20",
        accent: "text-emerald-400",
        items: [
            { icon: <FileText size={18} />, name: "PAN Card" },
            { icon: <UserCheck size={18} />, name: "Voter ID" },
            { icon: <ScrollText size={18} />, name: "Ration Card" },
            { icon: <FileCheck size={18} />, name: "PM Kisan Samman" },
        ]
    },
    {
        label: "Travel & Transport",
        color: "from-violet-500/20 to-purple-500/20",
        border: "border-violet-500/20",
        accent: "text-violet-400",
        items: [
            { icon: <Train size={18} />, name: "IRCTC Train Booking" },
            { icon: <Plane size={18} />, name: "Flight Tickets" },
            { icon: <Bus size={18} />, name: "Bus Booking" },
            { icon: <Car size={18} />, name: "Vehicle Challan" },
        ]
    },
    {
        label: "Utility Payments",
        color: "from-orange-500/20 to-amber-500/20",
        border: "border-orange-500/20",
        accent: "text-orange-400",
        items: [
            { icon: <Zap size={18} />, name: "Electricity Bill" },
            { icon: <Smartphone size={18} />, name: "Mobile Recharge" },
            { icon: <Wifi size={18} />, name: "Broadband/DTH" },
            { icon: <CreditCard size={18} />, name: "Credit Card Bill" },
        ]
    },
    {
        label: "Insurance & Taxes",
        color: "from-pink-500/20 to-rose-500/20",
        border: "border-pink-500/20",
        accent: "text-pink-400",
        items: [
            { icon: <ShieldCheck size={18} />, name: "Motor Insurance" },
            { icon: <HeartPulse size={18} />, name: "Health Insurance" },
            { icon: <ShieldPlus size={18} />, name: "Life Insurance" },
            { icon: <FileText size={18} />, name: "ITR Filing" },
        ]
    },
    {
        label: "Digital Infrastructure",
        color: "from-sky-500/20 to-blue-500/20",
        border: "border-sky-500/20",
        accent: "text-sky-400",
        items: [
            { icon: <Upload size={18} />, name: "OCR Processing" },
            { icon: <Database size={18} />, name: "Admin Analytics" },
            { icon: <Monitor size={18} />, name: "User Dashboards" },
            { icon: <Activity size={18} />, name: "Live Status Tracking" },
        ]
    },
];

// ── Flat List for Marquee ──
const marqueeSkills = categories.flatMap(c => c.items);

// ── Portals ──
const portals = [
	{ title: "User Dashboard", desc: "Client portal for managing their requests.", link: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, icon: <Users2Icon /> },
	{ title: "Request Status", desc: "Live tracking of user applications.", link: `${process.env.NEXT_PUBLIC_APP_URL}/status`, icon: <CheckCircle2Icon /> },
	{ title: "See all posts/notices", desc: "Browse latest updates and announcements.", link: `${process.env.NEXT_PUBLIC_APP_URL}/posts`, icon: <ScrollTextIcon /> },
	{ title: "See all galary images", desc: "Browse the galary of works.", link: `${process.env.NEXT_PUBLIC_APP_URL}/galary`, icon: <ExternalLinkIcon /> },
	{ title: "See all notifications", desc: "Browse latest notifications.", link: `${process.env.NEXT_PUBLIC_APP_URL}/notifications`, icon: <ExternalLinkIcon /> },
	{ title: "Upload the galary image", desc: "Admin portal to upload galary images.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/galary`, icon: <UploadIcon /> },
	{ title: "Create Notice/Post", desc: "Admin portal to broadcast updates.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/posts/create`, icon: <FileTextIcon /> },
	{ title: "Update/Delete Posts", desc: "Admin portal to manage existing posts.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/posts`, icon: <FileCheck2Icon /> },
	{ title: "Admin Analytics", desc: "View center growth and revenue metrics.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/analytics`, icon: <BarChart2Icon /> },
	{ title: "OCR Transactions", desc: "Add & manage automated cash transactions.", link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/transactions`, icon: <UploadIcon /> },
];


export default function App() {
  const [scrolled, setScrolled] = useState(false);

  // Marquee Refs and State
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const touchY = useRef(null);
  const [dir, setDir] = useState(-1);
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);

  const repeated = [...marqueeSkills, ...marqueeSkills];

  // Scroll detection for Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Marquee Activation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.1);
    }, { threshold: [0.1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wheel/Touch controls for Marquee
  useEffect(() => {
    if (!active) return;
    const onWheel = (e) => setDir(e.deltaY > 0 ? -1 : 1);
    const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
    const onTouchMove = (e) => {
        if (touchY.current == null) return;
        const delta = e.touches[0].clientY - touchY.current;
        setDir(delta > 0 ? 1 : -1);
        touchY.current = e.touches[0].clientY;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
    };
  }, [active]);

  // Animation Loop for Marquee
  useEffect(() => {
    let id;
    let last = performance.now();
    const SPEED = 65;
    const tick = (now) => {
        const dt = (now - last) / 1000;
        last = now;
        let next = x.get() + SPEED * dir * dt;
        const loop = trackRef.current?.scrollWidth / 2 || 0;
        if (loop) {
            if (next <= -loop) next += loop;
            else if (next >= 0) next -= loop;
        }
        x.set(next);
        id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [dir, x]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00bf8f] selection:text-white font-sans overflow-x-hidden">

      {/* ── Services / Expertise Section (Adapted from Skills.jsx) ── */}
      <section ref={sectionRef} id="services" className="w-full py-24 flex flex-col items-center justify-center relative bg-black text-white overflow-hidden border-t border-white/5">
        
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-15 blur-[130px] animate-pulse" />
            <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] opacity-15 blur-[130px] animate-pulse delay-500" />
        </div>

        <motion.h2
            className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] z-10"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            Expertise & Services
        </motion.h2>
        <motion.p
            className="mt-2 mb-12 text-gray-400 text-base sm:text-lg z-10"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
        >
            Financial · E-Governance · Travel · Utilities
        </motion.p>

        {/* Category Grid */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {categories.map((cat, ci) => (
                <motion.div
                    key={ci}
                    className={`rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color} p-5 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07 * ci, duration: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${cat.accent}`}>{cat.label}</h3>
                    <div className="flex flex-wrap gap-2">
                        {cat.items.map((skill, si) => (
                            <motion.div
                                key={si}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 hover:border-white/25 hover:bg-white/10 transition-all duration-200 cursor-default"
                                whileHover={{ scale: 1.06 }}
                            >
                                <span className={`text-base ${cat.accent}`}>{skill.icon}</span>
                                <span>{skill.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Marquee Strip */}
        <div className="relative w-full overflow-hidden z-10 py-4">
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

            <motion.div
                ref={trackRef}
                style={{ x, whiteSpace: "nowrap", willChange: "transform" }}
                className="flex gap-12 text-[#1cd8d2] items-center"
            >
                {repeated.map((skill, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center gap-2 min-w-[120px] hover:text-emerald-400 transition-colors duration-200 group"
                        title={skill.name}
                    >
                        <span className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-[#1cd8d2]/10 transition-all duration-300 drop-shadow-[0_0_8px_rgba(28,216,210,0.3)]">
                            {React.cloneElement(skill.icon, { size: 32 })}
                        </span>
                        <p className="text-sm font-medium text-gray-300 group-hover:text-white">{skill.name}</p>
                    </div>
                ))}
            </motion.div>
        </div>

        {/* Tie-Ups / Certifications (Adapted from Coursework) */}
        <motion.div
            className="relative z-10 mt-16 flex flex-wrap justify-center gap-3 px-6 max-w-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <p className="w-full text-center text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-2">Authorized Banking Partners & Certifications</p>
            {["CSC VLE Certified", "Fino Payment Bank Partner", "Airtel Payments Bank", "India Post Payments Bank (IPPB)", "IRCTC Authorized Agent"].map((c, i) => (
                <span key={i} className="px-5 py-2 rounded-full border border-[#00bf8f]/30 bg-[#00bf8f]/5 text-gray-200 text-sm font-medium hover:border-[#1cd8d2]/60 hover:bg-[#1cd8d2]/10 transition-all duration-200">
                    {c}
                </span>
            ))}
        </motion.div>
      </section>

      {/* ── Internal Portals / Software Section ── */}
      <section id="portals" className="relative py-24 bg-[#050505]">
        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]">Infrastructure</span>
              </h3>
              <p className="text-gray-400 max-w-xl">
                Custom platforms built to streamline our CSC operations, manage cash flow via OCR, and provide full transparency to our users.
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#302b63]/30 border border-[#302b63] text-[#1cd8d2] text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1cd8d2] animate-pulse" /> Live Local Environment
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map((portal, i) => (
              <motion.a
                href={portal.link}
                target="_blank"
                rel="noreferrer"
                key={i}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#1cd8d2]/40 hover:bg-gradient-to-br from-white/10 to-transparent transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-white/5 text-gray-300 group-hover:text-[#1cd8d2] group-hover:bg-[#1cd8d2]/10 transition-colors">
                      {portal.icon}
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{portal.title}</h4>
                  <p className="text-sm text-gray-400">{portal.desc}</p>
                </div>
                <div className="mt-6 text-xs font-mono text-gray-500 truncate group-hover:text-[#00bf8f] transition-colors">
                  {portal.link}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}