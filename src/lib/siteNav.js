/**
 * siteNav.js — NEW FILE. Create it at:
 *   D:\csc-platform\src\lib\siteNav.js
 *
 * Shared navigation content for the whole site. Navbar.jsx (and every
 * page that needs the menu) imports NAV and TOP_BAR from here, so the
 * menu is written once and stays the same everywhere.
 *
 * CONTENT source: the friend's site, New Computer Institute, Wazidpur
 * (from Swatantra's screenshots, 2026-11-07). Its menu was:
 *   HOME
 *   ABOUT US — Director's Desk, Manager's Desk, Public Disclosure,
 *     Achievements, Infrastructure, Vision And Mission, About Us
 *   GALLERY — Photos Gallery, Videos Gallery
 *   FACILITIES & ACTIVITES — Labs, Events, Social Activites, Academic Activites
 *   COURSES — Diploma, Certificate, Short-Term, Degree
 *   INSTITUTE — Admission Procedure, Admission Inquiry, Fees Structure,
 *     Download Certificate, Exam Informations
 *   CONTACT US
 *   Top bar: phone, email, social icons, My Account.
 *   Footer strip: Call / WhatsApp / Email + postal address.
 *
 * ADAPTED to a CSC centre — content only, the UI is independent:
 * - "Courses" does not exist at a CSC centre, so it becomes Services
 *   (the six things the centre actually does).
 * - "Institute" does not exist either, so it becomes Citizen Help
 *   (how to apply, charges, track, download, notices, FAQs).
 * - Director's Desk / Manager's Desk become Operator's Desk
 *   (Srilal Yadav). Public Disclosure becomes Notices & Updates.
 * - Facilities are the centre's counters, not labs/events.
 * - Nothing is copied from the friend's site except this structure:
 *   no NCI branding, phone, email, address, courses or fees.
 * - Route spelling: "/galary" is kept as-is (that is how the app
 *   spells the route). Do not "fix" it in a link.
 *
 * Each dropdown item can carry an optional `note` — a one-line hint
 * shown under the label in the menu. Anchors (#about, #services …)
 * are sections on the homepage; /status, /login, /posts, /courses,
 * /galary, /notifications, /delivery are real app routes.
 */

export const CENTRE = {
  name: "Shri Lal Sahaj Jan Seva Kendra",
  shortName: "Jan Seva Kendra",
  place: "Shambhuganj, Jaunpur",
  state: "Uttar Pradesh",
  operator: "Srilal Yadav",
  phoneDisplay: "90056 23112",
  phoneHref: "tel:+919005623112",
  whatsappHref: "https://wa.me/919005623112",
  email: "sahaj9005623112@gmail.com",
  hours: "9:00 AM – 9:00 PM, every day",
};

export const TOP_BAR = {
  phone: { label: "90056 23112", href: "tel:+919005623112" },
  email: { label: "sahaj9005623112@gmail.com", href: "mailto:sahaj9005623112@gmail.com" },
  hours: "9:00 AM – 9:00 PM, every day",
  location: "Shambhuganj, Jaunpur, Uttar Pradesh",
  track: { label: "Track Request", href: "/status" },
  account: { label: "My Account", href: "/login" },
};

export const NAV = [
  { label: "Home", href: "#home" },
  {
    label: "About",
    href: "#about",
    children: [
      { label: "About the Centre", href: "#about" },
      { label: "Operator's Desk", href: "#operator", note: "Srilal Yadav" },
      { label: "Vision & Mission", href: "#about" },
      { label: "Our Team", href: "#operator", note: "Srilal + 2 staff" },
      { label: "Achievements", href: "#operator" },
      { label: "Infrastructure", href: "#facilities" },
    ],
  },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Banking & AePS", href: "#services-banking" },
      { label: "E-Governance & Certificates", href: "#services-governance" },
      { label: "Travel & IRCTC", href: "#services-travel" },
      { label: "Utility Payments", href: "#services-utility" },
      { label: "Insurance & ITR", href: "#services-insurance" },
      { label: "Digital Services", href: "#services-digital" },
    ],
  },
  {
    label: "Gallery",
    href: "#gallery",
    children: [
      { label: "Photo Gallery", href: "#gallery" },
      { label: "Video Gallery", href: "/galary" },
    ],
  },
  {
    label: "Facilities",
    href: "#facilities",
    children: [
      { label: "Banking Counter", href: "#facilities" },
      { label: "E-Governance Counter", href: "#facilities" },
      { label: "Travel Desk", href: "#facilities" },
      { label: "Printing & Scanning", href: "#facilities" },
      { label: "Help Desk", href: "#contact" },
    ],
  },
  {
    label: "Citizen Help",
    href: "#how-it-works",
    children: [
      { label: "How to Apply", href: "#how-it-works" },
      { label: "Service Charges", href: "#charges" },
      { label: "Track Your Request", href: "/status" },
      { label: "Download Certificate / Receipt", href: "/status" },
      { label: "Notices & Updates", href: "#notices" },
      { label: "All Posts", href: "/posts", note: "Every notice and post" },
      { label: "FAQs", href: "#contact", note: "Ask at the counter or on WhatsApp" },
    ],
  },
  { label: "Contact", href: "#contact" },
];

export const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About the Centre", href: "#about" },
  { label: "Photo Gallery", href: "#gallery" },
  { label: "Video Gallery", href: "/galary" },
  { label: "Notices & Updates", href: "#notices" },
  { label: "Track Your Request", href: "/status" },
  { label: "Contact", href: "#contact" },
];
