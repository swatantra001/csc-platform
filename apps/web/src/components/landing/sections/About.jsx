import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Clock, Award, Users, CreditCard, Train, 
  Landmark, Smartphone, ShieldCheck, Mail, Phone, MapPin, 
  ExternalLink, BarChart, FileText, CheckCircle, Upload
} from 'lucide-react';

const glows = [
  "-top-10 -left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
  "bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[100px]"
];

const stats = [
  { label: "Location", value: "Shambhuganj, Jaunpur" },
  { label: "Experience", value: "10+ Years" },
  { label: "Certification", value: "CSC Certified" },
  { label: "Availability", value: "9 AM - 9 PM Daily" },
  { label: "Dedicated Staff", value: "2 Employees" },
  { label: "Role", value: "Block Operator, Shambhuganj" },
];

const highlights = [
  { 
    icon: <Landmark className="w-8 h-8" />, 
    title: "Digital Banking & Cash", 
    desc: "Seamless cash exchange via Bank Transfer, UPI, and Aadhar. Account opening via Fino, Airtel & India Post Payment Banks." 
  },
  { 
    icon: <ShieldCheck className="w-8 h-8" />, 
    title: "E-Governance Services", 
    desc: "Comprehensive CSC center facilities. Everything from government form filling to official certificate generation." 
  },
  { 
    icon: <Train className="w-8 h-8" />, 
    title: "IRCTC Authorized", 
    desc: "Own platform for official IRCTC e-rail ticket booking and travel management for local citizens." 
  },
];

const portals = [
  { title: "Admin Analytics", desc: "View center growth and revenue metrics.", link: "http://localhost/admin/analytics", icon: <BarChart /> },
  { title: "OCR Transactions", desc: "Add & manage automated cash transactions.", link: "http://localhost/admin/transactions", icon: <Upload /> },
  { title: "User Dashboard", desc: "Client portal for managing their requests.", link: "http://localhost/dashboard", icon: <Users /> },
  { title: "Request Status", desc: "Live tracking of user applications.", link: "http://localhost/status", icon: <CheckCircle /> },
  { title: "Create Notice/Post", desc: "Admin portal to broadcast updates.", link: "http://localhost/admin/posts/create", icon: <FileText /> },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00bf8f] selection:text-white font-sans overflow-x-hidden">
      
      {/* Hero / About Section */}
      <section id="about" className="relative pt-32 pb-24 min-h-screen flex items-center">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {glows.map((glow, i) => (
            <div key={i} className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] animate-pulse ${glow}`} />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 md:px-10 lg:px-12 flex flex-col gap-16">
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-stretch gap-10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            {/* Photo Placeholder */}
            <motion.div
              className="relative shrink-0 w-[160px] h-[160px] md:w-[210px] md:h-[210px] rounded-2xl overflow-hidden shadow-2xl bg-[#111]"
              style={{ boxShadow: "0 0 40px rgba(28,216,210,0.18), 0 0 0 1px rgba(28,216,210,0.15)" }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1cd8d2]/30 to-[#302b63]/30 z-10 pointer-events-none" />
              {/* Replace src with uncle's actual photo */}
              <img src="/m1.png" alt="Shrilal Yadav" className="w-full h-full object-cover opacity-80" />
            </motion.div>

            {/* Identity */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <motion.span
                className="inline-block mb-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              >
                Shambhuganj Block Operator · CSC Center Owner
              </motion.span>

              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2] pb-2">
                Shrilal Yadav
              </h2>

              <p className="mt-2 text-lg sm:text-xl text-white/80 font-semibold flex items-center justify-center md:justify-start gap-2">
                Empowering Rural India Digitally <Award className="w-5 h-5 text-[#00bf8f]" />
              </p>

              <p className="mt-4 text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl">
                I operate a comprehensive CSC center in Shambhuganj, providing essential financial, travel, and governance services. With over <span className="text-emerald-400 font-medium">10 years of trusted operations</span> and a dedicated team of 2 employees, we bridge the digital divide while I continue my core duties at the Shambhuganj office.
              </p>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                {stats.map((item, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
                  >
                    <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* About Narrative */}
          <motion.div
            className="text-center md:text-left pt-8 border-t border-white/10"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] to-[#00bf8f]">Journey & Passion</span>
            </h3>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-4xl">
              I am incredibly keen on my work and love serving my community. Operating from 9 AM to 9 PM, my center ensures nobody in Shambhuganj is left behind in the digital age. Even while I am fulfilling my official duties as an operator at Shambhuganj, my two trusted employees manage the CSC center on my behalf, ensuring uninterrupted service delivery.
            </p>
            <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-4xl flex items-center gap-2 justify-center md:justify-start">
              <CreditCard className="w-5 h-5 text-[#1cd8d2]" /> We proudly accept secure online payments via Razorpay.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}