
"use client";
import React, { useState } from 'react'
import ParticlesBackground from '../components/ParticlesBackground'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaUserCircle, FaClipboardCheck } from 'react-icons/fa'

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// ════════════════════════════════════════════════════════════════════════════════
// THEME TOKENS (matches your reference exactly)
// ════════════════════════════════════════════════════════════════════════════════
const THEME = {
  light: {
    pageBg: '#f1f5f9',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentLight: '#eff6ff',
    accentBorder: '#bfdbfe',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    cardShadow: '0 1px 4px rgba(0,0,0,0.07)',
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputFocusBorder: '#3b82f6',
    inputText: '#1e293b',
    inputPlaceholder: '#94a3b8',
    divider: '#e2e8f0',
    btnPrimary: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    btnPrimaryText: '#ffffff',
    btnPrimaryGlow: 'rgba(37,99,235,0.35)',
    error: '#dc2626',
    errorBg: 'rgba(220,38,38,0.08)',
    success: '#15803d',
    successBg: 'rgba(21,128,61,0.08)',
    warning: '#b45309',
    glow1: 'rgba(37,99,235,0.06)',
    glow2: 'rgba(29,78,216,0.10)',
  },
  dark: {
    pageBg: '#060b14',
    textPrimary: '#f1f5f9',
    textSecondary: 'rgba(255,255,255,0.55)',
    textMuted: 'rgba(255,255,255,0.28)',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentLight: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.25)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    cardShadow: '0 1px 4px rgba(0,0,0,0.3)',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.08)',
    inputFocusBorder: 'rgba(245,158,11,0.5)',
    inputText: '#f1f5f9',
    inputPlaceholder: 'rgba(255,255,255,0.25)',
    divider: 'rgba(255,255,255,0.06)',
    btnPrimary: 'linear-gradient(135deg,#f59e0b,#d97706)',
    btnPrimaryText: '#000000',
    btnPrimaryGlow: 'rgba(245,158,11,0.35)',
    error: '#f87171',
    errorBg: 'rgba(239,68,68,0.10)',
    success: '#22c55e',
    successBg: 'rgba(21,128,61,0.15)',
    warning: '#fbbf24',
    glow1: 'rgba(245,158,11,0.05)',
    glow2: 'rgba(180,83,9,0.08)',
  },
};

const contactInfo = [
  { icon: "✉️", label: "Email",    value: "sahaj9005623112@gmail.com",       href: "mailto:sahaj9005623112@gmail.com" },
  { icon: "📞", label: "Phone",    value: "+91 9005623112",               href: "tel:+919005623112" },
  { icon: "📍", label: "Location", value: "Shambhuganj, Jaunpur, UP",     href: null },
  { icon: "⏰", label: "Timings",  value: "9:00 AM - 9:00 PM (Daily)",    href: null },
]

const quickLinks = [
  { icon: <FaClipboardCheck />, label: "Track Request Status", href: "/status",      colorLight: "#2563eb", colorDark: "#f59e0b" },
  { icon: <FaUserCircle />,     label: "User Dashboard",       href: "/dashboard",   colorLight: "#3b82f6", colorDark: "#fbbf24" },
  { icon: <FaWhatsapp />,       label: "WhatsApp Support",     href: "#",            colorLight: "#16a34a", colorDark: "#22c55e" },
]

const serviceOptions = [
  { value: "cash-exchange",   label: "Cash Withdrawal / Deposit (Aadhar/UPI)" },
  { value: "account-opening", label: "Bank Account Opening (Fino, Airtel, IPPB)" },
  { value: "irctc-booking",   label: "Train / Flight Booking (IRCTC)" },
  { value: "csc-services",    label: "CSC Certificates & Govt Services" },
  { value: "online-payment",  label: "Online Payments (Razorpay)" },
  { value: "others",          label: "Other Inquiry" },
]

export default function Contact({ isDark = false }) {
  const T = isDark ? THEME.dark : THEME.light;

  const [formData, setFormData] = useState({ name: '', email: '', service: '', amount: '', idea: '' })
  const [errors,   setErrors]   = useState({})
  const [status,   setStatus]   = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'amount' && value && !/^\d+$/.test(value)) return
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const req = ['name', 'email', 'service', 'idea']
    const errs = {}
    req.forEach(f => !formData[f].trim() && (errs[f] = 'Required'))
    if (formData.service && formData.service !== 'others' && formData.service !== 'csc-services' && !formData.amount.trim())
      errs.amount = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        ...formData, from_name: formData.name, reply_to: formData.email,
      }, PUBLIC_KEY)
      setStatus('success')
      setFormData({ name: '', email: '', service: '', amount: '', idea: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans ${err
      ? `border-[${T.error}] focus:border-[${T.error}]`
      : `border-[${T.inputBorder}] focus:border-[${T.inputFocusBorder}] focus:shadow-[0_0_0_3px_${isDark ? 'rgba(245,158,11,0.10)' : 'rgba(59,130,246,0.10)'}]`
    }`

  return (
    <section id='contact' className='w-full min-h-screen relative overflow-hidden py-24' style={{ background: T.pageBg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s, color 0.4s' }}>
      <ParticlesBackground />

      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: T.glow1 }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: T.glow2 }} />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-6 md:px-10'>

        {/* ── Section Header ── */}
        <motion.div className='text-center mb-14'
          initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
        >
          <span className='text-[11px] font-bold tracking-[0.2em] uppercase' style={{ color: T.accent }}>Reach Out To Us</span>
          <h2 className='mt-2 text-4xl sm:text-5xl font-extrabold' style={{ fontFamily: "'DM Serif Display', serif", color: T.textPrimary }}>
            Get in{' '}
            <style dangerouslySetInnerHTML={{
                                    __html: `
                                            .gradient-text {
                                                display: inline-block;
                                                background: ${T.nameGrad};
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                -webkit-text-fill-color: transparent;
                                                text-fill-color: transparent;
                                                color: transparent;
                                        }
                                        `
                                }}
                                />
            <span className='gradient-text'>
              Touch
            </span>
          </h2>
          <p className='mt-3 text-base max-w-xl mx-auto' style={{ color: T.textSecondary }}>
            Have a question about a banking transaction, IRCTC booking, or need assistance with government digital services? We are here to help.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>

          {/* ── LEFT PANEL ── */}
          <motion.div className='lg:col-span-2 flex flex-col gap-6'
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            {/* Operator Card */}
            <div className='rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1'
              style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0'
                  style={{
                    background: isDark ? 'rgba(245,158,11,0.12)' : '#eff6ff',
                    border: `1px solid ${isDark ? 'rgba(245,158,11,0.20)' : '#bfdbfe'}`,
                  }}>
                  🙏
                </div>
                <div>
                  <p className='font-bold text-base' style={{ color: T.textPrimary }}>Srilal Yadav</p>
                  <p className='text-[11px] font-bold tracking-wider uppercase mt-0.5' style={{ color: T.accent }}>Certified CSC Operator · Shambhuganj</p>
                </div>
              </div>
              <p className='text-sm leading-relaxed' style={{ color: T.textSecondary }}>
                Over 10 years of trusted service running a primary CSC center in Shambhuganj. Supported by a dedicated 2-person team to process your banking, ticketing, and online form requests promptly.
              </p>
            </div>

            {/* Contact Info Card */}
            <div className='rounded-2xl p-6 backdrop-blur-sm' style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
              <p className='text-[11px] font-bold tracking-[0.2em] uppercase mb-4' style={{ color: T.textMuted }}>Center Info</p>
              <div className='flex flex-col gap-3'>
                {contactInfo.map((c, i) => (
                  <div key={i} className='flex items-center gap-3 text-sm'>
                    <span className='text-base w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
                      style={{ background: T.accentLight, color: T.accent }}>
                      {c.icon}
                    </span>
                    <div className='min-w-0'>
                      <p className='text-[11px] font-bold uppercase tracking-wider' style={{ color: T.textMuted }}>{c.label}</p>
                      {c.href
                        ? <a href={c.href} target='_blank' rel='noopener noreferrer'
                            className='transition-colors truncate block font-medium' style={{ color: T.textSecondary }}
                            onMouseEnter={e => (e.currentTarget).style.color = T.accent}
                            onMouseLeave={e => (e.currentTarget).style.color = T.textSecondary}>
                            {c.value}
                          </a>
                        : <p className='font-medium' style={{ color: T.textSecondary }}>{c.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className='rounded-2xl p-6 backdrop-blur-sm' style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
              <p className='text-[11px] font-bold tracking-[0.2em] uppercase mb-4' style={{ color: T.textMuted }}>Portal Links & Social</p>
              <div className='flex flex-col gap-2'>
                {quickLinks.map((s, i) => (
                  <motion.a key={i} href={s.href} target='_blank' rel='noopener noreferrer'
                    className='flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group'
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                      color: T.textSecondary,
                    }}
                    whileHover={{ x: 4, borderColor: T.accentBorder }}
                    onMouseEnter={e => { (e.currentTarget).style.color = T.textPrimary; }}
                    onMouseLeave={e => { (e.currentTarget).style.color = T.textSecondary; }}
                  >
                    <span style={{ color: isDark ? s.colorDark : s.colorLight }} className='text-base'>{s.icon}</span>
                    {s.label}
                    <span className='ml-auto text-xs opacity-40 group-hover:opacity-100 transition-opacity' style={{ color: T.textMuted }}>↗</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.div className='lg:col-span-3'
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          >
            <div className='rounded-2xl p-8 backdrop-blur-sm h-full' style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, boxShadow: T.cardShadow }}>
              <h3 className='text-xl font-bold mb-6' style={{ color: T.textPrimary, fontFamily: "'DM Serif Display', serif" }}>Send an Inquiry</h3>

              <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

                {/* Name + Email Row */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-[11px] font-bold uppercase tracking-wider mb-2' style={{ color: T.textMuted }}>
                      Your Name <span style={{ color: T.error }}>*</span>
                    </label>
                    <input type='text' name='name' value={formData.name} onChange={handleChange}
                      placeholder='Rahul Sharma'
                      className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans'
                      style={{
                        background: T.inputBg,
                        borderColor: errors.name ? T.error : T.inputBorder,
                        color: T.inputText,
                      }}
                    />
                    {errors.name && <p className='text-xs mt-1.5 font-medium' style={{ color: T.error }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className='block text-[11px] font-bold uppercase tracking-wider mb-2' style={{ color: T.textMuted }}>
                      Email / Phone <span style={{ color: T.error }}>*</span>
                    </label>
                    <input type='text' name='email' value={formData.email} onChange={handleChange}
                      placeholder='you@example.com or 9876543210'
                      className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans'
                      style={{
                        background: T.inputBg,
                        borderColor: errors.email ? T.error : T.inputBorder,
                        color: T.inputText,
                      }}
                    />
                    {errors.email && <p className='text-xs mt-1.5 font-medium' style={{ color: T.error }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Service Select */}
                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider mb-2' style={{ color: T.textMuted }}>
                    I need help with <span style={{ color: T.error }}>*</span>
                  </label>
                  <select name='service' value={formData.service} onChange={handleChange}
                    className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans appearance-none cursor-pointer'
                    style={{
                      background: T.inputBg,
                      borderColor: errors.service ? T.error : T.inputBorder,
                      color: formData.service ? T.inputText : T.inputPlaceholder,
                    }}
                  >
                    <option value='' disabled style={{ color: T.inputPlaceholder }}>Select a service</option>
                    {serviceOptions.map(o => (
                      <option key={o.value} value={o.value} style={{ background: T.cardBg, color: T.inputText }}>{o.label}</option>
                    ))}
                  </select>
                  {errors.service && <p className='text-xs mt-1.5 font-medium' style={{ color: T.error }}>{errors.service}</p>}
                </div>

                {/* Amount (conditional) */}
                {formData.service && formData.service !== 'others' && formData.service !== 'csc-services' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className='block text-[11px] font-bold uppercase tracking-wider mb-2' style={{ color: T.textMuted }}>
                      Transaction Amount (₹) <span style={{ color: T.error }}>*</span>
                    </label>
                    <input type='text' name='amount' value={formData.amount} onChange={handleChange}
                      placeholder='e.g. 5000'
                      className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans'
                      style={{
                        background: T.inputBg,
                        borderColor: errors.amount ? T.error : T.inputBorder,
                        color: T.inputText,
                      }}
                    />
                    {errors.amount && <p className='text-xs mt-1.5 font-medium' style={{ color: T.error }}>{errors.amount}</p>}
                  </motion.div>
                )}

                {/* Message */}
                <div>
                  <label className='block text-[11px] font-bold uppercase tracking-wider mb-2' style={{ color: T.textMuted }}>
                    Additional Details / Query <span style={{ color: T.error }}>*</span>
                  </label>
                  <textarea name='idea' rows={5} value={formData.idea} onChange={handleChange}
                    placeholder="Provide your query details, tracking reference, or what specific certificate/service you need help with..."
                    className='w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all duration-200 font-sans resize-none'
                    style={{
                      background: T.inputBg,
                      borderColor: errors.idea ? T.error : T.inputBorder,
                      color: T.inputText,
                    }}
                  />
                  {errors.idea && <p className='text-xs mt-1.5 font-medium' style={{ color: T.error }}>{errors.idea}</p>}
                </div>

                {/* Status Message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className='flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium'
                    style={{
                      background: status === 'success' ? T.successBg : status === 'error' ? T.errorBg : isDark ? 'rgba(245,158,11,0.10)' : '#fef3c7',
                      color: status === 'success' ? T.success : status === 'error' ? T.error : T.warning,
                      border: `1px solid ${status === 'success' ? (isDark ? 'rgba(21,128,61,0.3)' : '#86efac') : status === 'error' ? (isDark ? 'rgba(239,68,68,0.25)' : '#fecaca') : isDark ? 'rgba(245,158,11,0.20)' : '#fde68a'}`,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>
                      {status === 'sending' ? '⏳' : status === 'success' ? '✅' : '❌'}
                    </span>
                    {status === 'sending' ? 'Submitting your request...'
                     : status === 'success' ? 'Inquiry sent! We will contact you shortly.'
                     : 'Something went wrong. Please try again.'}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={status === 'sending'}
                  className='relative w-full py-3.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{
                    background: T.btnPrimary,
                    color: T.btnPrimaryText,
                    boxShadow: 'none',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: `0 8px 24px ${T.btnPrimaryGlow}` }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'sending' ? 'Sending...' : '🚀 Submit Inquiry'}
                </motion.button>

              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}