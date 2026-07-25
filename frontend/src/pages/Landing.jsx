import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { concertService } from '../services';
import { getImageUrl } from '../services/api';
import { formatDateShort, formatCurrency, formatCountdown } from '../utils';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ─── Import User Images ─── */
import userImg0 from '../assets/images/images.jpg';
import userImg1 from '../assets/images/images1.jpg';
import userImg2 from '../assets/images/images2.jpg';
import userImg3 from '../assets/images/images3.jpg';

/* ─── Crayon Case Band Official Discography & Signature Songs ─── */
const CRAYON_CASE_DISCOGRAPHY = [
  {
    id: 's1',
    number: '01',
    title: 'Gravits',
    englishTitle: 'Crayon Case Single',
    album: 'Crayon Case (2024)',
    duration: '4:15',
    plays: '18.4M Streams',
    type: 'Main Tour Anthem',
    desc: 'Melodic indie-rock anthem with soaring dual guitar riffs, driving rhythm section, and explosive chorus.',
    isPopular: true,
    image: userImg0
  },
  {
    id: 's2',
    number: '02',
    title: 'Gravits (Alternate Version)',
    englishTitle: 'Alternate Take',
    album: 'Crayon Case Deluxe',
    duration: '4:30',
    plays: '11.2M Streams',
    type: 'Special Version',
    desc: 'Atmospheric alternate arrangement featuring extended guitar solo and ambient reverb textures.',
    isPopular: false,
    image: userImg1
  },
  {
    id: 's3',
    number: '03',
    title: 'because,',
    englishTitle: 'because,',
    album: 'Crayon Case EP',
    duration: '3:45',
    plays: '14.9M Streams',
    type: 'Fan Favorite',
    desc: 'Intimate indie ballad driven by delicate guitar work, emotive vocals, and subtle synth undercurrents.',
    isPopular: true,
    image: userImg2
  },
  {
    id: 's4',
    number: '04',
    title: 'Lyra Intro',
    englishTitle: 'Instrumental Opening',
    album: 'Lyra Suite',
    duration: '2:10',
    plays: '9.8M Streams',
    type: 'Show Opener',
    desc: 'Pulsating ambient instrumental intro setting the theatrical mood for live stadium dates.',
    isPopular: false,
    image: userImg3
  },
  {
    id: 's5',
    number: '05',
    title: 'Neu Automobile',
    englishTitle: 'Neu Automobile',
    album: 'Crayon Case (2024)',
    duration: '4:50',
    plays: '16.3M Streams',
    type: 'High Energy Live',
    desc: 'Propulsive motorik beat and interlocking guitars driving the crowd into full stadium singalong.',
    isPopular: true,
    image: userImg0
  },
  {
    id: 's6',
    number: '06',
    title: 'hibiscus/evening scene',
    englishTitle: 'hibiscus/evening scene',
    album: 'Crayon Case EP',
    duration: '5:05',
    plays: '13.1M Streams',
    type: 'Sunset Sunset Cut',
    desc: 'Lush shoegaze and dream-pop textures evoking coastal sunset moods and rich harmonic depth.',
    isPopular: true,
    image: userImg1
  },
  {
    id: 's7',
    number: '07',
    title: 'LYRA OUTRO',
    englishTitle: 'Grand Finale',
    album: 'Lyra Suite',
    duration: '3:20',
    plays: '8.5M Streams',
    type: 'Encore Outro',
    desc: 'Climactic instrumental finale featuring feedback swells, soaring guitars, and triumphant drums.',
    isPopular: false,
    image: userImg2
  },
  {
    id: 's8',
    number: '08',
    title: 'Surabaya',
    englishTitle: 'City Anthem',
    album: 'Single Drop (2025)',
    duration: '4:18',
    plays: '21.0M Streams',
    type: 'Stadium Anthem',
    desc: 'Iconic tribute track dedicated to fans, delivering powerful live energy and soaring stadium hooks.',
    isPopular: true,
    image: userImg3
  }
];

/* ─── Fallback Featured Shows Using Official Songs & User Uploaded Images ─── */
const DEFAULT_SHOWS = [
  {
    id: 'c1',
    number: '01',
    title: "CRAYON CASE '26",
    subtitle: "LIVE AT GBK STADIUM",
    modelName: "GBK STADIUM JAKARTA",
    desc: "Experience the monumental live tour of Crayon Case. Featuring state-of-the-art stage setup, immersive surround acoustics, and an unforgettable 3-hour setlist.",
    setlist: [
      "1. Lyra Intro (Atmospheric Concert Opening)",
      "2. Gravits (Main Arena Anthem & Guitar Solos)",
      "3. because, (Acoustic Center Stage)",
      "4. Neu Automobile (High Energy Rhythm Cut)",
      "5. Surabaya (Grand Finale Encore)"
    ],
    highlights: [
      "100% Official StageCase Ticket Pass",
      "Inspired by 1970s classic rock stage aesthetics",
      "Interactive 3D Seat Map & instant booking",
      "VIP meet & greet pass with merchandise bundle",
      "Dolby Atmos live acoustics & front-row access"
    ],
    specs: [
      "Venue Capacity: 77,193 Spectators",
      "Stage Dimensions: 40m x 25m Dual-wing",
      "Sound System: L-Acoustics K1 Line Array",
      "Doors Open: 17:00 WIB | Show Starts: 19:30 WIB",
      "Age Restriction: 12+ (Under 16 with guardian)"
    ],
    image: userImg0,
    guitarImage: userImg1,
    date: "2026-10-15",
    location: "Jakarta, Indonesia",
    startingPrice: 350000,
    slug: "crayon-case-gbk-2026"
  },
  {
    id: 'c2',
    number: '02',
    title: "VINTAGE SOUNDS '26",
    subtitle: "BALI SOUNDSTAGE ARENA",
    modelName: "BALI SOUNDSTAGE",
    desc: "An acoustic and electric symphony by the coastline. Intimate venue setting designed for music purists and dedicated fans.",
    setlist: [
      "1. hibiscus/evening scene (Sunset Beachfront Intro)",
      "2. Gravits (Alternate Version) (Unplugged Take)",
      "3. because, (Intimate Reverb Solo)",
      "4. Neu Automobile (Coastline Live Jam)",
      "5. LYRA OUTRO (Beachside Finale)"
    ],
    highlights: [
      "Exclusive beachfront open-air auditorium",
      "Custom acoustic tuning for crisp frequency clarity",
      "Includes complimentary welcome drink & vinyl pass",
      "Private VIP seating lounges available",
      "Express QR pass entry at dedicated gate"
    ],
    specs: [
      "Venue Capacity: 12,000 Spectators",
      "Acoustic Rating: Studio Quality Sound Field",
      "Lighting: Custom Vintage Par-Can Array",
      "Doors Open: 16:30 WITA | Show Starts: 19:00 WITA",
      "Parking: On-site VIP parking space included"
    ],
    image: userImg1,
    guitarImage: userImg2,
    date: "2026-11-20",
    location: "Bali, Indonesia",
    startingPrice: 450000,
    slug: "vintage-sounds-bali"
  },
  {
    id: 'c3',
    number: '03',
    title: "NEON ELECTRIC TOUR",
    subtitle: "BANDUNG AMPHITHEATER",
    modelName: "BANDUNG AMPHITHEATER",
    desc: "High energy, pulse-pounding rhythm and visuals. Crayon Case presents their rawest performance of the year.",
    setlist: [
      "1. Lyra Intro (Electric Overdrive Prelude)",
      "2. Surabaya (Amphitheater Special Singalong)",
      "3. Gravits (Heavy Arena Solos)",
      "4. hibiscus/evening scene (Shoegaze Cut)",
      "5. LYRA OUTRO (Pyrotechnic Grand Finale)"
    ],
    highlights: [
      "360-degree center stage arrangement",
      "Ultra-fast mobile QR check-in",
      "Exclusive event shirt & tour poster bundle",
      "Elevated tribune sightlines from all angles",
      "Dedicated food & beverage hall access"
    ],
    specs: [
      "Venue Capacity: 25,000 Spectators",
      "Stage Setup: Dynamic Rotating Center Arena",
      "Visual Effects: Laser & Pyrotechnic Sync",
      "Doors Open: 17:30 WIB | Show Starts: 20:00 WIB",
      "Transit: 5 mins from Bandung Central Station"
    ],
    image: userImg2,
    guitarImage: userImg3,
    date: "2026-12-05",
    location: "Bandung, Indonesia",
    startingPrice: 300000,
    slug: "neon-electric-bandung"
  }
];

/* ─── Ticket Tiers Color Swatches (Using User Palette Hex Codes) ─── */
const TIER_SWATCHES = [
  { name: 'VVIP Pass', color: '#343C4E', bgName: 'Primary Dark', price: 'Rp 1.500.000', desc: 'Front row experience + soundcheck access & band meet pass.' },
  { name: 'VIP Pass', color: '#2A629C', bgName: 'Secondary Royal', price: 'Rp 850.000', desc: 'Dedicated entrance, premium seating zone & merch bundle.' },
  { name: 'Tribune', color: '#8DA7CC', bgName: 'Surface Steel', price: 'Rp 500.000', desc: 'Numbered seating with elevated sightlines across the whole venue.' },
  { name: 'Festival', color: '#728EB7', bgName: 'Background Slate', price: 'Rp 350.000', desc: 'Standing area closest to the stage. Feel the energy of live music.' }
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  {
    quote: "Hearing 'Gravits' and 'Surabaya' live in front of the main stage was an unforgettable experience. Crayon Case delivered!",
    name: 'Ariana D.',
    city: 'Jakarta',
    tier: 'VVIP Member',
  },
  {
    quote: "StageCase made securing Crayon Case tour tickets effortless. Clean interface, fast seat selection, zero hassle.",
    name: 'Bima R.',
    city: 'Bandung',
    tier: 'VIP Pass',
  },
  {
    quote: "The live transition from 'Lyra Intro' to 'Neu Automobile' was pure genius. StageCase QR check-in took less than 10 seconds.",
    name: 'Clara M.',
    city: 'Surabaya',
    tier: 'Tribune Pass',
  },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: 'How do I receive my concert e-tickets?',
    a: 'Once your payment proof is submitted and verified, your digital QR code e-ticket will instantly be available under "My Tickets" and sent via email notification.',
  },
  {
    q: 'Can I pick my exact seats during booking?',
    a: 'Yes! StageCase features an interactive seat selection layout for seated categories where you can pick your preferred row and seat number.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept direct bank transfers (BCA, Mandiri) as well as GoPay and QRIS digital wallet payments.',
  },
  {
    q: 'Can I transfer or cancel my ticket reservation?',
    a: 'Ticket transfers are supported via your account profile up to 48 hours before the performance doors open.',
  },
];

export default function Landing() {
  const [currentShowIdx, setCurrentShowIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('setlist'); // 'highlights' | 'setlist' | 'specs'
  const [activeTierIdx, setActiveTierIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [playingSongId, setPlayingSongId] = useState('s1');

  // Fetch upcoming concerts from backend API
  const { data: concertsData } = useQuery({
    queryKey: ['upcoming-concerts'],
    queryFn: () => concertService.list({ limit: 6, status: 'upcoming' }),
    select: d => d.data.data,
  });

  const backendConcerts = concertsData || [];
  
  // Combine backend concerts with user-image split showcase items
  const featuredList = backendConcerts.length > 0
    ? backendConcerts.map((c, i) => ({
        id: c.id,
        number: `0${i + 1}`,
        title: c.title.toUpperCase(),
        subtitle: c.venue ? `${c.venue.name}, ${c.venue.city}`.toUpperCase() : 'LIVE TOUR 2026',
        modelName: c.venue?.name || 'CONCERT ARENA',
        desc: c.description || DEFAULT_SHOWS[0].desc,
        setlist: DEFAULT_SHOWS[i % DEFAULT_SHOWS.length].setlist,
        highlights: DEFAULT_SHOWS[i % DEFAULT_SHOWS.length].highlights,
        specs: DEFAULT_SHOWS[i % DEFAULT_SHOWS.length].specs,
        image: c.poster ? getImageUrl(c.poster, 'posters') : [userImg0, userImg1, userImg2, userImg3][i % 4],
        guitarImage: [userImg1, userImg2, userImg3, userImg0][i % 4],
        date: c.date,
        location: c.venue ? `${c.venue.name}, ${c.venue.city}` : 'Indonesia',
        startingPrice: c.ticketCategories?.length ? Math.min(...c.ticketCategories.map(cat => parseFloat(cat.price))) : 350000,
        slug: c.slug
      }))
    : DEFAULT_SHOWS;

  const activeShow = featuredList[currentShowIdx] || DEFAULT_SHOWS[0];

  // Countdown timer for active show
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!activeShow?.date) return;
    const interval = setInterval(() => {
      setCountdown(formatCountdown(activeShow.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeShow]);

  const handleNextShow = () => {
    setCurrentShowIdx((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrevShow = () => {
    setCurrentShowIdx((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  return (
    <div className="min-h-screen bg-[#728EB7] text-[#F5F3F5] flex flex-col relative overflow-x-hidden selection:bg-[#2A629C] selection:text-[#F5F3F5] font-sans">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          1. EDITORIAL SPLIT-SCREEN HERO SECTION (USER IMAGES INTEGRATED)
          Left Half: Primary Dark Navy (#343C4E)
          Right Half: Secondary Royal Steel Blue (#2A629C)
          Center: Overlapping Hero Featured Visual
          Zero Gradients!
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen pt-20 flex flex-col lg:flex-row overflow-hidden border-b border-[#F5F3F5]/15">
        
        {/* ─── LEFT SIDE (PRIMARY DARK NAVY #343C4E) ─── */}
        <div className="w-full lg:w-1/2 bg-[#343C4E] relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 border-r border-[#F5F3F5]/15">
          
          {/* Vertical rotated text on left margin */}
          <div className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-4 text-[10px] font-mono tracking-[0.3em] uppercase text-[#D3CCD0]/60 writing-vertical">
            <span>STAGECASE • CRAYON CASE TOUR 2026</span>
            <div className="w-8 h-[1px] bg-[#F5F3F5]/20" />
            <span>COPYRIGHT © 2026</span>
          </div>

          {/* Background Watermark Number (e.g. "01") */}
          <div className="absolute top-12 right-12 text-[140px] sm:text-[180px] lg:text-[220px] font-black text-[#F5F3F5]/[0.05] leading-none select-none pointer-events-none font-display">
            {activeShow.number}
          </div>

          {/* Top Left Menu Bar */}
          <div className="relative z-10 flex items-center justify-between xl:pl-10">
            <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#D3CCD0]">
              <span className="text-[#8DA7CC] font-bold">Concerts</span>
              <span className="hover:text-[#F5F3F5] cursor-pointer transition-colors">Discography</span>
              <span className="hover:text-[#F5F3F5] cursor-pointer transition-colors">Setlist</span>
              <span className="hover:text-[#F5F3F5] cursor-pointer transition-colors font-mono">Passes</span>
            </div>
          </div>

          {/* Center Main Left Content */}
          <div className="my-12 lg:my-16 space-y-6 relative z-10 max-w-lg xl:pl-10">
            {/* Dropdown Selector */}
            <div className="relative inline-block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D3CCD0] hover:text-[#F5F3F5] uppercase transition-colors py-1.5 px-3.5 border border-[#F5F3F5]/20 bg-[#2A629C]/30"
              >
                <span>Browse By Concert</span>
                <span className="text-[#8DA7CC]">▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#343C4E] border border-[#F5F3F5]/25 shadow-2xl z-30 py-2">
                  {featuredList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentShowIdx(idx);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs uppercase font-mono tracking-wider transition-colors flex items-center justify-between ${
                        idx === currentShowIdx ? 'bg-[#2A629C] text-[#F5F3F5] font-bold' : 'text-[#D3CCD0] hover:bg-[#F5F3F5]/10'
                      }`}
                    >
                      <span>{item.modelName}</span>
                      <span className="text-[10px] opacity-60">{item.number}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Giant Title */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#F5F3F5] tracking-tight uppercase leading-none">
                {activeShow.title}
              </h1>
              <p className="font-mono text-[#8DA7CC] tracking-widest text-sm uppercase font-bold">
                {activeShow.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-[#D3CCD0] text-xs sm:text-sm leading-relaxed max-w-md">
              {activeShow.desc}
            </p>

            {/* Navigation Buttons: Prev / Next */}
            <div className="flex items-center gap-8 pt-4">
              <button
                onClick={handlePrevShow}
                className="text-xs font-mono uppercase tracking-widest text-[#D3CCD0] hover:text-[#F5F3F5] transition-colors flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Prev Show</span>
              </button>
              <span className="text-[#F5F3F5]/20 text-xs">|</span>
              <button
                onClick={handleNextShow}
                className="text-xs font-mono uppercase tracking-widest text-[#D3CCD0] hover:text-[#F5F3F5] transition-colors flex items-center gap-2 group"
              >
                <span>Next Show</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Bottom Left Footer Tag */}
          <div className="relative z-10 flex items-center gap-4 text-[11px] text-[#D3CCD0]/60 font-mono xl:pl-10">
            <span>SHOW {activeShow.number} / 0{featuredList.length}</span>
            <div className="h-3 w-[1px] bg-[#F5F3F5]/20" />
            <span className="text-[#8DA7CC] font-semibold">{activeShow.location}</span>
          </div>
        </div>

        {/* ─── CENTER OVERLAPPING HERO FEATURED VISUAL (USING USER IMAGES) ─── */}
        <div className="relative lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:w-[380px] xl:w-[440px] h-[350px] lg:h-[580px] z-20 flex items-center justify-center pointer-events-none my-6 lg:my-0">
          <div className="relative w-full h-full p-4 flex items-center justify-center">
            {/* Visual Box with Sharp Ticket Stub Border */}
            <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] h-[340px] lg:h-[520px] bg-[#343C4E] border-4 border-[#F5F3F5]/30 shadow-2xl overflow-hidden pointer-events-auto group">
              
              {/* Ticket Notch Cutouts */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#728EB7] border-r-2 border-[#F5F3F5]/30 z-30" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#728EB7] border-l-2 border-[#F5F3F5]/30 z-30" />

              <img
                key={activeShow.id}
                src={activeShow.image}
                alt={activeShow.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
              />
              
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 bg-[#2A629C] text-[#F5F3F5] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 border border-[#F5F3F5]/20 z-20">
                CRAYON CASE LIVE '26
              </div>

              {/* Bottom Quick Price Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-[#343C4E] p-4 border-t-2 border-dashed border-[#F5F3F5]/30 flex items-center justify-between z-20">
                <div>
                  <p className="text-[10px] text-[#D3CCD0] uppercase font-mono">Pass Starts From</p>
                  <p className="text-[#F5F3F5] font-bold text-sm font-mono">{formatCurrency(activeShow.startingPrice)}</p>
                </div>
                <Link
                  to={`/concerts/${activeShow.slug}`}
                  className="bg-[#8DA7CC] text-[#343C4E] font-bold text-xs px-4 py-2 uppercase tracking-wider hover:bg-[#F5F3F5] transition-colors"
                >
                  Book Seat
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE (SECONDARY ROYAL STEEL BLUE #2A629C) ─── */}
        <div className="w-full lg:w-1/2 bg-[#2A629C] relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10">
          
          {/* Top Right Header & Search Bar */}
          <div className="relative z-10 flex items-center justify-end gap-6 text-xs font-semibold uppercase tracking-wider text-[#F5F3F5]">
            <span className="hover:text-[#343C4E] cursor-pointer transition-colors">Band Bio</span>
            <span className="hover:text-[#343C4E] cursor-pointer transition-colors">Contact</span>
            <span className="text-sm cursor-pointer hover:scale-110 transition-transform">🔍</span>
            <span className="text-sm cursor-pointer hover:scale-110 transition-transform">📍</span>
          </div>

          {/* Center Main Right Content */}
          <div className="my-10 lg:my-14 space-y-8 relative z-10 max-w-lg ml-auto xl:pr-10">
            
            {/* Newsletter Subscription Box */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold tracking-widest text-[#F5F3F5]">
                Subscribe to Crayon Case Tour Alerts
              </label>
              <form
                onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Crayon Case presale notifications!'); setEmailInput(''); }}
                className="flex items-center bg-[#F5F3F5] border border-[#343C4E]/30 p-1"
              >
                <input
                  type="email"
                  placeholder="Enter Email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs text-[#343C4E] placeholder:text-[#343C4E]/60 font-sans focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#343C4E] hover:bg-[#1E232E] text-[#F5F3F5] px-4 py-2 text-xs font-mono font-bold transition-colors"
                >
                  &gt;
                </button>
              </form>
            </div>

            {/* Ticket Tier Color Selector Swatches */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#F5F3F5] block">
                Category Pass Tier
              </span>
              <div className="flex items-center gap-3">
                {TIER_SWATCHES.map((swatch, idx) => (
                  <button
                    key={swatch.name}
                    onClick={() => setActiveTierIdx(idx)}
                    title={`${swatch.name} - ${swatch.price}`}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      idx === activeTierIdx ? 'border-[#F5F3F5] scale-110 shadow-lg' : 'border-[#343C4E]/40 hover:border-[#F5F3F5]/70'
                    }`}
                    style={{ backgroundColor: swatch.color }}
                  >
                    {idx === activeTierIdx && (
                      <span className="w-2 h-2 rounded-full bg-[#F5F3F5] block" />
                    )}
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-[#F5F3F5] ml-2 uppercase">
                  {TIER_SWATCHES[activeTierIdx].name} ({TIER_SWATCHES[activeTierIdx].price})
                </span>
              </div>
            </div>

            {/* Tabs: Setlist vs Highlights vs Specs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-2 border-b border-[#F5F3F5]/30 pb-2">
                <button
                  onClick={() => setActiveTab('setlist')}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-colors border ${
                    activeTab === 'setlist'
                      ? 'bg-[#F5F3F5] text-[#343C4E] border-[#F5F3F5]'
                      : 'bg-[#343C4E]/40 text-[#F5F3F5] border-[#F5F3F5]/20 hover:bg-[#343C4E]/60'
                  }`}
                >
                  Setlist
                </button>
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-colors border ${
                    activeTab === 'highlights'
                      ? 'bg-[#F5F3F5] text-[#343C4E] border-[#F5F3F5]'
                      : 'bg-[#343C4E]/40 text-[#F5F3F5] border-[#F5F3F5]/20 hover:bg-[#343C4E]/60'
                  }`}
                >
                  Highlights
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-colors border ${
                    activeTab === 'specs'
                      ? 'bg-[#F5F3F5] text-[#343C4E] border-[#F5F3F5]'
                      : 'bg-[#343C4E]/40 text-[#F5F3F5] border-[#F5F3F5]/20 hover:bg-[#343C4E]/60'
                  }`}
                >
                  Specs
                </button>
              </div>

              {/* Tab Content List */}
              <ul className="space-y-2 text-xs font-sans text-[#F5F3F5]/90 leading-relaxed min-h-[140px]">
                {activeTab === 'setlist' ? (
                  activeShow.setlist.map((song, idx) => (
                    <li key={idx} className="flex items-start gap-2 font-mono font-semibold">
                      <span className="text-[#343C4E] font-bold">🎵</span>
                      <span>{song}</span>
                    </li>
                  ))
                ) : activeTab === 'highlights' ? (
                  activeShow.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#343C4E] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  activeShow.specs.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#343C4E] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Quick Action Link */}
            <div className="pt-2">
              <Link
                to={`/concerts/${activeShow.slug}`}
                className="inline-block bg-[#343C4E] text-[#F5F3F5] font-mono text-xs font-bold uppercase tracking-widest px-8 py-3.5 border border-[#F5F3F5]/20 hover:bg-[#1E232E] transition-colors"
              >
                Reserve Crayon Case Seats →
              </Link>
            </div>
          </div>

          {/* Bottom Right Footer Links & Socials */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono uppercase text-[#F5F3F5]/80 border-t border-[#F5F3F5]/20 pt-4 xl:pr-10">
            <div className="flex items-center gap-6">
              <span className="hover:text-[#343C4E] cursor-pointer transition-colors">Tour Rules</span>
              <span className="hover:text-[#343C4E] cursor-pointer transition-colors">Entry Guide</span>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-xs">
              <span className="hover:text-[#343C4E] cursor-pointer">🎵</span>
              <span className="hover:text-[#343C4E] cursor-pointer">📷</span>
              <span className="hover:text-[#343C4E] cursor-pointer">🐦</span>
              <span className="hover:text-[#343C4E] cursor-pointer">🎧</span>
            </div>
          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. CRAYON CASE OFFICIAL DISCOGRAPHY & LIVE TRACKLIST SECTION
          Official Song Titles: Gravits, Gravits (Alternate), because,, Lyra Intro, Neu Automobile, hibiscus/evening scene, LYRA OUTRO, Surabaya
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#728EB7] border-b border-[#F5F3F5]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-l-4 border-[#343C4E] pl-4">
            <div>
              <span className="text-[#343C4E] font-mono text-xs uppercase font-bold tracking-widest block mb-1">
                Official Discography & Live Tracklist
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F5F3F5] uppercase tracking-tight">
                Crayon Case Signature Songs
              </h2>
              <p className="text-[#D3CCD0] text-xs sm:text-sm font-sans mt-1">
                Listen to the core discography performed live on the 2026 StageCase World Tour.
              </p>
            </div>
            <div className="bg-[#343C4E] border border-[#F5F3F5]/20 px-4 py-2 text-xs font-mono text-[#F5F3F5]">
              <span className="text-[#8DA7CC] font-bold">8 Tracks</span> Featured Live
            </div>
          </div>

          {/* Song Tracklist Table / Cards */}
          <div className="space-y-4">
            {CRAYON_CASE_DISCOGRAPHY.map((song) => {
              const isPlaying = playingSongId === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => setPlayingSongId(song.id)}
                  className={`relative p-4 sm:p-5 border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden ${
                    isPlaying
                      ? 'bg-[#343C4E] border-[#2A629C] shadow-2xl text-[#F5F3F5]'
                      : 'bg-[#8DA7CC] border-[#343C4E] hover:border-[#2A629C] text-[#343C4E]'
                  }`}
                >
                  {/* Notched Side Cuts */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#728EB7] border-r-2 border-[#343C4E]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#728EB7] border-l-2 border-[#343C4E]" />

                  {/* Left Song Info with Thumbnail */}
                  <div className="flex items-center gap-4">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-14 h-14 object-cover border border-[#F5F3F5]/30 flex-shrink-0"
                    />

                    {/* Play/Pause Button */}
                    <button
                      className={`w-9 h-9 rounded-none flex items-center justify-center font-mono font-bold text-xs transition-colors border flex-shrink-0 ${
                        isPlaying
                          ? 'bg-[#2A629C] text-[#F5F3F5] border-[#2A629C]'
                          : 'bg-[#343C4E] text-[#F5F3F5] border-[#F5F3F5]/20 hover:bg-[#2A629C]'
                      }`}
                    >
                      {isPlaying ? '❚❚' : '▶'}
                    </button>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-bold ${isPlaying ? 'text-[#8DA7CC]' : 'text-[#343C4E]/60'}`}>
                          {song.number}
                        </span>
                        <h3 className={`font-display font-bold text-base uppercase tracking-tight ${isPlaying ? 'text-[#F5F3F5]' : 'text-[#343C4E]'}`}>
                          {song.title}
                        </h3>
                        {song.isPopular && (
                          <span className="bg-[#2A629C] text-[#F5F3F5] text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#F5F3F5]/20">
                            ★ Live Anthem
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-sans mt-0.5 ${isPlaying ? 'text-[#D3CCD0]' : 'text-[#343C4E]/80'}`}>
                        {song.album} • <span className="font-mono font-semibold text-[#2A629C]">{song.type}</span>
                      </p>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <div className={`hidden lg:block max-w-sm text-xs font-sans leading-relaxed ${isPlaying ? 'text-[#D3CCD0]' : 'text-[#343C4E]/80'}`}>
                    {song.desc}
                  </div>

                  {/* Right Song Stats & Tour Link */}
                  <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-xs">
                    <div className="text-right">
                      <p className={`font-bold ${isPlaying ? 'text-[#F5F3F5]' : 'text-[#343C4E]'}`}>{song.duration}</p>
                      <p className={`text-[10px] ${isPlaying ? 'text-[#D3CCD0]' : 'text-[#343C4E]/60'}`}>{song.plays}</p>
                    </div>

                    <Link
                      to="/concerts"
                      className="bg-[#343C4E] hover:bg-[#2A629C] text-[#F5F3F5] font-bold text-[11px] px-3.5 py-2 uppercase tracking-wider border border-[#F5F3F5]/20 transition-colors"
                    >
                      Hear Live →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. UPCOMING TOUR DATES (NOTCHED TICKET STUB CARDS WITH USER IMAGES)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#343C4E] border-b border-[#F5F3F5]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 border-l-4 border-[#2A629C] pl-4">
            <div>
              <span className="text-[#8DA7CC] font-mono text-xs uppercase font-bold tracking-widest block mb-1">
                Official Schedule
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F5F3F5] uppercase tracking-tight">
                Crayon Case Tour Dates
              </h2>
            </div>
            <Link
              to="/concerts"
              className="bg-[#2A629C] hover:bg-[#1E4F82] text-[#F5F3F5] font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 transition-colors"
            >
              View Full Tour List →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredList.slice(0, 3).map((show, idx) => (
              <div
                key={show.id}
                className="relative bg-[#8DA7CC] border-2 border-[#343C4E] flex flex-col justify-between group hover:border-[#2A629C] transition-all duration-300 shadow-2xl text-[#343C4E] overflow-hidden"
              >
                {/* Ticket Side Cutout Notches */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#343C4E] border-r-2 border-[#F5F3F5]/30 z-20" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#343C4E] border-l-2 border-[#F5F3F5]/30 z-20" />

                {/* Ticket Top Serial Header */}
                <div className="bg-[#343C4E] text-[#F5F3F5] px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center justify-between border-b border-[#F5F3F5]/20">
                  <span>STAGECASE PASS #{2026 + (idx * 48)}</span>
                  <span className="bg-[#2A629C] px-2 py-0.5 text-[9px]">{show.number}</span>
                </div>

                <div className="relative aspect-video overflow-hidden bg-[#343C4E]">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute top-3 left-3 bg-[#2A629C] text-[#F5F3F5] font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#F5F3F5]/20">
                    {formatDateShort(show.date)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[#2A629C] font-mono text-xs font-bold uppercase tracking-widest mb-1">
                      LIVE PERFORMANCE
                    </p>
                    <h3 className="font-display font-black text-xl text-[#343C4E] uppercase tracking-tight group-hover:text-[#2A629C] transition-colors">
                      {show.title}
                    </h3>
                    <p className="text-xs font-sans text-[#343C4E]/80 mt-1">
                      📍 {show.location}
                    </p>
                  </div>

                  {/* Dotted Tear Perforated Line */}
                  <div className="pt-4 border-t-2 border-dashed border-[#343C4E]/30 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-[#343C4E]/60 uppercase font-bold">Starts from</p>
                      <p className="font-mono font-black text-[#343C4E] text-base">
                        {formatCurrency(show.startingPrice)}
                      </p>
                    </div>
                    <Link
                      to={`/concerts/${show.slug}`}
                      className="bg-[#343C4E] hover:bg-[#2A629C] text-[#F5F3F5] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors border border-[#F5F3F5]/20"
                    >
                      Get Pass
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. INTERACTIVE COUNTDOWN SECTION (PALETTE MATTE BLOCK)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#728EB7] border-b border-[#F5F3F5]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-[#343C4E] border-2 border-[#F5F3F5]/25 p-8 sm:p-12 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="bg-[#2A629C] text-[#F5F3F5] font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#F5F3F5]/20 inline-block">
                  Next Live Performance Countdown
                </span>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-[#F5F3F5] uppercase tracking-tight">
                  {activeShow.title}
                </h2>
                <p className="text-[#D3CCD0] text-xs sm:text-sm font-sans">
                  {formatDateShort(activeShow.date)} • {activeShow.location}
                </p>
                <Link
                  to={`/concerts/${activeShow.slug}`}
                  className="inline-block bg-[#2A629C] hover:bg-[#1E4F82] text-[#F5F3F5] font-mono text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors border border-[#F5F3F5]/20"
                >
                  Book Priority Seats
                </Link>
              </div>

              {/* Countdown Numbers Grid */}
              <div className="lg:col-span-6 grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'DAYS', value: countdown.days },
                  { label: 'HOURS', value: countdown.hours },
                  { label: 'MINUTES', value: countdown.minutes },
                  { label: 'SECONDS', value: countdown.seconds },
                ].map((item) => (
                  <div key={item.label} className="bg-[#728EB7] border border-[#F5F3F5]/20 p-4">
                    <p className="font-mono font-black text-2xl sm:text-4xl text-[#F5F3F5]">
                      {String(item.value).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] font-mono text-[#343C4E] font-bold tracking-widest mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. TICKET CATEGORIES MATRIX (NOTCHED TICKET STUB DESIGN)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#343C4E] border-b border-[#F5F3F5]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[#8DA7CC] font-mono text-xs uppercase font-bold tracking-widest block">
              Seating Options
            </span>
            <h2 className="font-display font-black text-3xl text-[#F5F3F5] uppercase tracking-tight">
              Ticket Tier Breakdown
            </h2>
            <p className="text-[#D3CCD0] text-xs sm:text-sm font-sans">
              Choose your preferred seating category for Crayon Case live concerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIER_SWATCHES.map((tier) => (
              <div
                key={tier.name}
                className="relative bg-[#8DA7CC] border-2 border-[#343C4E] p-6 flex flex-col justify-between hover:border-[#2A629C] transition-colors text-[#343C4E] overflow-hidden"
              >
                {/* Ticket Notch Cutouts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#343C4E]" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#343C4E]" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-xl text-[#343C4E] uppercase">{tier.name}</h3>
                    <div className="w-4 h-4 rounded-full border border-[#343C4E]/40" style={{ backgroundColor: tier.color }} />
                  </div>
                  <p className="font-mono font-bold text-2xl text-[#2A629C]">{tier.price}</p>
                  <p className="text-xs text-[#343C4E]/80 leading-relaxed font-sans">{tier.desc}</p>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-[#343C4E]/30 mt-6">
                  <Link
                    to="/concerts"
                    className="block bg-[#343C4E] hover:bg-[#2A629C] text-[#F5F3F5] font-mono text-xs font-bold uppercase tracking-wider text-center py-3 px-4 transition-colors border border-[#F5F3F5]/20"
                  >
                    Select Category
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. FAN REVIEWS & FAQ (NOTCHED SOLID CARDS)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#728EB7] border-b border-[#F5F3F5]/15">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-16">
          
          {/* Reviews Grid */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[#343C4E] font-mono text-xs uppercase font-bold tracking-widest block">
                Verified Reviews
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F5F3F5] uppercase tracking-tight">
                What Concertgoers Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((item, i) => (
                <div key={i} className="relative bg-[#343C4E] border border-[#F5F3F5]/20 p-6 flex flex-col justify-between text-[#F5F3F5] overflow-hidden">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#728EB7]" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#728EB7]" />

                  <p className="text-xs text-[#D3CCD0] leading-relaxed italic mb-6">"{item.quote}"</p>
                  <div className="pt-4 border-t border-[#F5F3F5]/20 flex items-center justify-between font-mono">
                    <div>
                      <p className="text-xs font-bold text-[#F5F3F5]">{item.name}</p>
                      <p className="text-[10px] text-[#D3CCD0]/60">{item.city}</p>
                    </div>
                    <span className="bg-[#2A629C] text-[#F5F3F5] text-[9px] font-bold px-2 py-0.5 uppercase">
                      {item.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8 pt-8">
            <div className="text-center space-y-2">
              <span className="text-[#343C4E] font-mono text-xs uppercase font-bold tracking-widest block">
                Help & Info
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F5F3F5] uppercase tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-[#343C4E] border border-[#F5F3F5]/20 text-[#F5F3F5]">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left p-4 font-mono font-bold text-[#F5F3F5] text-xs sm:text-sm uppercase tracking-wide"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#8DA7CC] text-lg ml-4 font-bold">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="text-xs text-[#D3CCD0] p-4 pt-0 leading-relaxed border-t border-[#F5F3F5]/10 font-sans">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
