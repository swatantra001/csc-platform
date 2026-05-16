"use client";
import React, { useState } from 'react'
import ParticlesBackground from '../components/ParticlesBackground'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaUserCircle, FaClipboardCheck } from 'react-icons/fa'

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const contactInfo = [
  { icon: "✉️", label: "Email",    value: "shrilalyadav@gmail.com",       href: "mailto:shrilalyadav@gmail.com" },
  { icon: "📞", label: "Phone",    value: "+91 6388964291",               href: "tel:+916388964291" },
  { icon: "📍", label: "Location", value: "Shambhuganj, Jaunpur, UP",     href: null },
  { icon: "⏰", label: "Timings",  value: "9:00 AM - 9:00 PM (Daily)",    href: null },
]

const quickLinks = [
  { icon: <FaClipboardCheck />, label: "Track Request Status", href: "/status",      color: "#1cd8d2" },
  { icon: <FaUserCircle />,     label: "User Dashboard",       href: "/dashboard",   color: "#38bdf8" },
  { icon: <FaWhatsapp />,       label: "WhatsApp Support",     href: "#",            color: "#25D366" },
]

const serviceOptions = [
  { value: "cash-exchange",   label: "Cash Withdrawal / Deposit (Aadhar/UPI)" },
  { value: "account-opening", label: "Bank Account Opening (Fino, Airtel, IPPB)" },
  { value: "irctc-booking",   label: "Train / Flight Booking (IRCTC)" },
  { value: "csc-services",    label: "CSC Certificates & Govt Services" },
  { value: "online-payment",  label: "Online Payments (Razorpay)" },
  { value: "others",          label: "Other Inquiry" },
]

const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-gray-600 focus:outline-none transition-all duration-200 ${
    err
      ? 'border-red-500/60 focus:border-red-400'
      : 'border-white/10 focus:border-[#1cd8d2]/60 focus:bg-white/8'
  }`

const Contact = () => {
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

  return (
    <section id='contact' className='w-full min-h-screen relative bg-black overflow-hidden text-white py-24'>
      <ParticlesBackground />

      {/* bg glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1cd8d2] opacity-[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#302b63] opacity-[0.12] blur-[140px]" />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-6 md:px-10'>

        {/* heading */}
        <motion.div className='text-center mb-14'
          initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
        >
          <span className='text-xs font-bold tracking-widest uppercase text-emerald-400'>Reach Out To Us</span>
          <h2 className='mt-2 text-4xl sm:text-5xl font-extrabold text-white'>
            Get in{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#1cd8d2]'>
              Touch
            </span>
          </h2>
          <p className='mt-3 text-gray-400 text-base max-w-xl mx-auto'>
            Have a question about a banking transaction, IRCTC booking, or need assistance with government digital services? We are here to help.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>

          {/* ── LEFT PANEL ── */}
          <motion.div className='lg:col-span-2 flex flex-col gap-6'
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            {/* intro card */}
            <div className='rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#1cd8d2]/20 to-[#302b63]/20 border border-[#1cd8d2]/20 flex items-center justify-center text-2xl'>
                  🙏
                </div>
                <div>
                  <p className='text-white font-bold'>Shrilal Yadav</p>
                  <p className='text-emerald-400 text-xs'>Certified CSC Operator · Shambhuganj</p>
                </div>
              </div>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Over 10 years of trusted service running a primary CSC center in Shambhuganj. Supported by a dedicated 2-person team to process your banking, ticketing, and online form requests promptly.
              </p>
            </div>

            {/* contact info */}
            <div className='rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm flex flex-col gap-3'>
              <p className='text-xs font-bold tracking-widest uppercase text-gray-500 mb-1'>Center Info</p>
              {contactInfo.map((c, i) => (
                <div key={i} className='flex items-center gap-3 text-sm'>
                  <span className='text-base w-6 shrink-0'>{c.icon}</span>
                  <div className='min-w-0'>
                    <p className='text-gray-500 text-xs'>{c.label}</p>
                    {c.href
                      ? <a href={c.href} target='_blank' rel='noopener noreferrer'
                          className='text-gray-300 hover:text-emerald-400 transition-colors truncate block'>
                          {c.value}
                        </a>
                      : <p className='text-gray-300'>{c.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* portal quick links */}
            <div className='rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm'>
              <p className='text-xs font-bold tracking-widest uppercase text-gray-500 mb-3'>Portal Links & Social</p>
              <div className='flex flex-col gap-2'>
                {quickLinks.map((s, i) => (
                  <motion.a key={i} href={s.href} target='_blank' rel='noopener noreferrer'
                    className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/15 transition-all duration-200 text-sm text-gray-300 hover:text-white'
                    whileHover={{ x: 4 }}
                  >
                    <span style={{ color: s.color }} className='text-base'>{s.icon}</span>
                    {s.label}
                    <span className='ml-auto text-gray-600 text-xs'>↗</span>
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
            <div className='rounded-2xl border border-white/10 bg-white/4 p-8 backdrop-blur-sm h-full'>
              <h3 className='text-xl font-bold text-white mb-6'>Send an Inquiry</h3>

              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                {/* name + email row */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs text-gray-400 mb-1.5'>
                      Your Name <span className='text-red-400'>*</span>
                    </label>
                    <input type='text' name='name' value={formData.name} onChange={handleChange}
                      placeholder='Rahul Sharma'
                      className={inputCls(errors.name)} />
                    {errors.name && <p className='text-red-400 text-xs mt-1'>{errors.name}</p>}
                  </div>
                  <div>
                    <label className='block text-xs text-gray-400 mb-1.5'>
                      Email / Phone <span className='text-red-400'>*</span>
                    </label>
                    <input type='text' name='email' value={formData.email} onChange={handleChange}
                      placeholder='you@example.com or 9876543210'
                      className={inputCls(errors.email)} />
                    {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email}</p>}
                  </div>
                </div>

                {/* service */}
                <div>
                  <label className='block text-xs text-gray-400 mb-1.5'>
                    I need help with <span className='text-red-400'>*</span>
                  </label>
                  <select name='service' value={formData.service} onChange={handleChange}
                    className={`${inputCls(errors.service)} bg-[#0a0f1e]`}
                  >
                    <option value='' disabled>Select a service</option>
                    {serviceOptions.map(o => (
                      <option key={o.value} value={o.value} className='bg-[#0a0f1e] text-white'>{o.label}</option>
                    ))}
                  </select>
                  {errors.service && <p className='text-red-400 text-xs mt-1'>{errors.service}</p>}
                </div>

                {/* amount — contextual based on service */}
                {formData.service && formData.service !== 'others' && formData.service !== 'csc-services' && (
                  <div>
                    <label className='block text-xs text-gray-400 mb-1.5'>
                      Transaction Amount (₹) <span className='text-red-400'>*</span>
                    </label>
                    <input type='text' name='amount' value={formData.amount} onChange={handleChange}
                      placeholder='e.g. 5000'
                      className={inputCls(errors.amount)} />
                    {errors.amount && <p className='text-red-400 text-xs mt-1'>{errors.amount}</p>}
                  </div>
                )}

                {/* idea / message */}
                <div>
                  <label className='block text-xs text-gray-400 mb-1.5'>
                    Additional Details / Query <span className='text-red-400'>*</span>
                  </label>
                  <textarea name='idea' rows={5} value={formData.idea} onChange={handleChange}
                    placeholder="Provide your query details, tracking reference, or what specific certificate/service you need help with..."
                    className={`${inputCls(errors.idea)} resize-none`}
                  />
                  {errors.idea && <p className='text-red-400 text-xs mt-1'>{errors.idea}</p>}
                </div>

                {/* status message */}
                {status && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-medium ${
                      status === 'success' ? 'text-emerald-400'
                      : status === 'error'   ? 'text-red-400'
                      : 'text-yellow-400'
                    }`}
                  >
                    {status === 'sending' ? '⏳ Submitting your request...'
                     : status === 'success' ? '✅ Inquiry sent! We will contact you shortly.'
                     : '❌ Something went wrong. Please try again.'}
                  </motion.p>
                )}

                {/* submit */}
                <motion.button
                  type='submit'
                  disabled={status === 'sending'}
                  className='relative w-full py-3.5 rounded-xl font-bold text-sm text-black overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  style={{ background: 'linear-gradient(135deg, #1cd8d2, #00bf8f)' }}
                  whileHover={{ boxShadow: '0 8px 32px rgba(28,216,210,0.35)' }}
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

export default Contact