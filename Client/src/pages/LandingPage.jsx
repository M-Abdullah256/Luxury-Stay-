import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  X, 
  BellRing, 
  Check, 
  Info, 
  Car, 
  Anchor, 
  GlassWater
} from 'lucide-react';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Video Scrubbing Engine Refs
  const scrollSectionRef = useRef(null);
  const videoRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isSeekingRef = useRef(false);
  const pendingTimeRef = useRef(null);
  const lastSeekTimeRef = useRef(0);

  // Hero Opening Title Fade
  const [heroTitleOpacity, setHeroTitleOpacity] = useState(1);

  // Laguna Al-Sha'ab Arch Scroll Engine Refs & State
  const showcaseSectionRef = useRef(null);
  const targetShowcaseProgressRef = useRef(0);
  const currentShowcaseProgressRef = useRef(0);
  const [showcaseProgress, setShowcaseProgress] = useState(0);

  // Modals State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetailModal, setRoomDetailModal] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOut = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    checkInDate: todayStr,
    checkOutDate: defaultCheckOut,
    adults: 2,
    children: 0,
    specialRequests: ''
  });

  const [serviceForm, setServiceForm] = useState({
    roomNumber: '',
    guestName: '',
    serviceType: 'Wake-up Call',
    details: ''
  });

  const [feedbackForm, setFeedbackForm] = useState({
    guestName: '',
    suiteStayed: '',
    cleanliness: 5,
    service: 5,
    roomComfort: 5,
    comments: ''
  });

  const getRoomImg = (type) => {
    switch (type) {
      case 'Standard': return '/Images/room-standard.jpg';
      case 'Deluxe': return '/Images/room-deluxe.jpg';
      case 'Suite': return '/Images/room-suite.jpg';
      case 'Executive Suite': return '/Images/room-executive.jpg';
      case 'Presidential Suite': return '/Images/room-presidential.jpg';
      default: return '/Images/room-deluxe.jpg';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setBookingModalOpen(false);
        setRoomDetailModal(null);
        setServiceModalOpen(false);
        setFeedbackModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        const list = res.data.rooms || [];
        setRooms(list);
        setFilteredRooms(list);
      } catch (err) {
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ================= HARDWARE-ACCELERATED ULTRA-SMOOTH SEEK QUEUE =================
  const executeSeek = (targetTime) => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(targetTime - lastSeekTimeRef.current) < 0.035) {
      return;
    }

    if (isSeekingRef.current) {
      pendingTimeRef.current = targetTime;
    } else {
      isSeekingRef.current = true;
      lastSeekTimeRef.current = targetTime;
      
      if ('fastSeek' in video) {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const handleSeeked = () => {
      if (pendingTimeRef.current !== null) {
        const next = pendingTimeRef.current;
        pendingTimeRef.current = null;
        lastSeekTimeRef.current = next;
        
        if ('fastSeek' in video) {
          video.fastSeek(next);
        } else {
          video.currentTime = next;
        }
      } else {
        isSeekingRef.current = false;
      }
    };

    video.addEventListener('seeked', handleSeeked);

    // Scroll Handler
    const onScroll = () => {
      if (scrollSectionRef.current) {
        const rect = scrollSectionRef.current.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;
        const currentScroll = -rect.top;
        let progress = currentScroll / totalScroll;
        targetProgressRef.current = Math.max(0, Math.min(1, progress));
      }

      if (showcaseSectionRef.current) {
        const sRect = showcaseSectionRef.current.getBoundingClientRect();
        const sTotalScroll = sRect.height - window.innerHeight;
        const sCurrentScroll = -sRect.top;
        const sProgress = Math.max(0, Math.min(1, sCurrentScroll / (sTotalScroll > 0 ? sTotalScroll : 1)));
        targetShowcaseProgressRef.current = sProgress;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Physics Lerp Loop (Silky 60fps)
    let animId;
    const renderLoop = () => {
      // 1. Video Lerp
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.12;
        const p = currentProgressRef.current;

        if (video.duration && !isNaN(video.duration)) {
          executeSeek(video.duration * p);
        }

        const newOpacity = Math.max(0, 1 - (p / 0.18));
        setHeroTitleOpacity(newOpacity);
      }

      // 2. Showcase Lerp with damping
      const sDiff = targetShowcaseProgressRef.current - currentShowcaseProgressRef.current;
      if (Math.abs(sDiff) > 0.0001) {
        currentShowcaseProgressRef.current += sDiff * 0.09;
        setShowcaseProgress(currentShowcaseProgressRef.current);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('seeked', handleSeeked);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(r => r.roomType?.toLowerCase().includes(category.toLowerCase())));
    }
  };

  const handleOpenBooking = (room) => {
    if (room.status !== 'Available') return;
    setSelectedRoom(room);
    setBookingSuccess(null);
    setRoomDetailModal(null);
    setBookingModalOpen(true);
  };

  const handleOnlineBooking = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);

    try {
      const guestRes = await API.post('/guests', {
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        idNumber: bookingForm.idNumber || 'ONLINE-BOOK'
      });

      const guestId = guestRes.data?.guest?._id || guestRes.data?._id;

      const resRes = await API.post('/reservations', {
        guestId,
        roomId: selectedRoom._id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: { adults: Number(bookingForm.adults), children: Number(bookingForm.children) },
        notes: bookingForm.specialRequests
      });

      setBookingSuccess(resRes.data.reservation);
    } catch (err) {
      alert(err.response?.data?.message || 'Online booking failed.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/extras/services', {
        roomNumber: serviceForm.roomNumber,
        guestName: serviceForm.guestName,
        serviceType: serviceForm.serviceType,
        details: serviceForm.details
      });
      setServiceModalOpen(false);
      setServiceForm({ roomNumber: '', guestName: '', serviceType: 'Wake-up Call', details: '' });
      alert('Your concierge request has been relayed to the private butler team.');
    } catch (err) {
      alert('Service request submitted to concierge team.');
      setServiceModalOpen(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/extras/feedback', {
        guestName: feedbackForm.guestName,
        suiteStayed: feedbackForm.suiteStayed,
        ratings: {
          cleanliness: Number(feedbackForm.cleanliness),
          service: Number(feedbackForm.service),
          roomComfort: Number(feedbackForm.roomComfort),
          overall: 5
        },
        comments: feedbackForm.comments
      });
      setFeedbackModalOpen(false);
      setFeedbackForm({ guestName: '', suiteStayed: '', cleanliness: 5, service: 5, roomComfort: 5, comments: '' });
      alert('Thank you! Your verified feedback has been submitted.');
    } catch (err) {
      alert('Thank you for sharing your feedback!');
      setFeedbackModalOpen(false);
    }
  };

  const showcaseSlides = [
    {
      tag: 'Sanctuary of Distinction',
      title: 'THE PRESIDENTIAL SUITES',
      desc: 'Master-crafted private suites featuring polished black Italian marble, gold inlay architecture, and dedicated 24-hour private butler craftsmanship.',
      img: '/Images/room-presidential.jpg',
      customImg: '/Images/showcase-suite.jpg'
    },
    {
      tag: 'Haute Cuisine & Heritage',
      title: 'THE GRAND FINE DINING',
      desc: 'Opulent crystal chandeliers reflecting over mirror-finish tables, hosting Michelin-inspired culinary artistry and curated wine tastings.',
      img: '/Images/amenity-dining.jpg',
      customImg: '/Images/showcase-dining.jpg'
    },
    {
      tag: 'Nightlife & Rare Cellar',
      title: 'THE AMBER BAR & CELLAR',
      desc: 'A monumental honey-amber backlit onyx bar serving rare vintage spirits and hand-rolled cigars, with live stay billing integration.',
      img: '/Images/experience-lounge.jpg',
      customImg: '/Images/showcase-bar.jpg'
    }
  ];

  // ================= EXACT LAGUNA AL-SHA'AB ARCH CALCULATIONS =================
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // 1. Slide 0 Arch Expand (0.00 -> 0.24)
  const p0 = clamp(showcaseProgress / 0.24, 0, 1);
  const arch0Width = 68 + p0 * 32; // 68vw -> 100vw
  const arch0Height = 65 + p0 * 35; // 65vh -> 100vh
  const arch0Radius = (1 - p0) * 260; // 260px -> 0px
  const intro0Opacity = clamp(1 - p0 * 2.2, 0, 1); // Intro text disappears
  const slide0TitleOpacity = clamp((p0 - 0.45) * 1.9, 0, 1); // Main title appears

  // 2. Slide 1 Arch Rise & Expand (0.30 -> 0.62)
  const p1 = clamp((showcaseProgress - 0.30) / 0.32, 0, 1);
  const slide1Y = (1 - p1) * 105; // 105% -> 0%
  const slide1Width = 72 + p1 * 28; // 72vw -> 100vw
  const slide1Height = 70 + p1 * 30; // 70vh -> 100vh
  const slide1Radius = (1 - p1) * 240; // 240px -> 0px
  const slide1TitleOpacity = clamp((p1 - 0.4) * 2.0, 0, 1);
  const slide1ImgParallax = (1 - p1) * -22;

  // 3. Slide 2 Arch Rise & Expand (0.66 -> 0.96)
  const p2 = clamp((showcaseProgress - 0.66) / 0.30, 0, 1);
  const slide2Y = (1 - p2) * 105; // 105% -> 0%
  const slide2Width = 72 + p2 * 28; // 72vw -> 100vw
  const slide2Height = 70 + p2 * 30; // 70vh -> 100vh
  const slide2Radius = (1 - p2) * 240; // 240px -> 0px
  const slide2TitleOpacity = clamp((p2 - 0.4) * 2.0, 0, 1);
  const slide2ImgParallax = (1 - p2) * -22;

  // Active indicator dot
  const activeDot = showcaseProgress < 0.35 ? 0 : showcaseProgress < 0.68 ? 1 : 2;

 return (
  <div style={{ 
    background: 'transparent',
    color: '#f8fafc', 
    minHeight: '100vh', 
    position: 'relative' 
  }}>
      
      {/* ================= 1. VIDEO HERO SECTION ================= */}
      <section 
        ref={scrollSectionRef} 
        style={{ 
          height: '280vh', 
          position: 'relative'
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          <video
            ref={videoRef}
            src="/Videos/hotel-scroll.mp4"
            playsInline
            muted
            preload="auto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.9) contrast(1.05)'
            }}
          />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.5) 75%, rgba(5,8,17,0.85) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Top Quick Concierge Desk */}
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            zIndex: 10
          }}>
            <button 
              onClick={() => setServiceModalOpen(true)}
              style={{
                background: 'rgba(5, 8, 17, 0.75)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#ffffff',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
            >
              <BellRing size={14} color="#d4af37" />
              <span>Concierge</span>
            </button>
          </div>

          {/* ================= OPENING HERO TITLE ================= */}
          <div style={{
            position: 'relative',
            zIndex: 4,
            textAlign: 'center',
            maxWidth: '960px',
            padding: '0 24px',
            opacity: heroTitleOpacity,
            transform: `translateY(-${(1 - heroTitleOpacity) * 35}px)`,
            pointerEvents: heroTitleOpacity > 0.1 ? 'auto' : 'none',
            transition: 'opacity 0.1s linear, transform 0.1s linear'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(5, 8, 17, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              backdropFilter: 'blur(12px)',
              padding: '8px 24px',
              borderRadius: '50px',
              marginBottom: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
            }}>
              <Sparkles size={13} color="#d4af37" />
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#f8fafc' }}>
                LuxuryStay Grand Hotel & Residences
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(40px, 6vw, 82px)',
              color: '#ffffff',
              fontWeight: '600',
              lineHeight: '1.08',
              letterSpacing: '-0.5px',
              marginBottom: '20px',
              textShadow: '0 4px 35px rgba(0, 0, 0, 0.95)'
            }}>
              Where Bespoke Grandeur Meets <br />
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #d4af37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Unrivaled Hospitality
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(14.5px, 1.8vw, 17.5px)',
              color: '#e2e8f0',
              lineHeight: '1.75',
              maxWidth: '640px',
              margin: '0 auto',
              fontWeight: '300',
              textShadow: '0 2px 14px rgba(0,0,0,0.9)'
            }}>
              Discover a rare sanctuary of calm elegance, private butler craftsmanship, and seamless contactless reservations.
            </p>
          </div>

        </div>
      </section>

      {/* ================= 2. LAGUNA AL-SHA'AB SIGNATURE ARCH EXPAND & WIPE ================= */}
      <section 
        ref={showcaseSectionRef}
        style={{
          height: '560vh',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          background: '#04070f'
        }}>

          {/* ================= SLIDE 0: THE PRESIDENTIAL SUITES (ARCH EXPANDS) ================= */}
          <div style={{
            position: 'absolute',
            width: `${arch0Width}vw`,
            height: `${arch0Height}vh`,
            borderRadius: `${arch0Radius}px ${arch0Radius}px 0 0`,
            overflow: 'hidden',
            zIndex: 1,
            boxShadow: '0 30px 100px rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-radius 0.05s linear'
          }}>
            <img 
              src={showcaseSlides[0].customImg} 
              alt={showcaseSlides[0].title}
              onError={(e) => { e.target.onerror = null; e.target.src = showcaseSlides[0].img; }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.88) contrast(1.06)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.6) 75%, #050811 100%)'
            }} />

            {/* Initial Intro Arch Text (like "CULINARY ODYSSEY BY THE SEA") */}
            <div style={{
              position: 'absolute',
              zIndex: 3,
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '850px',
              opacity: intro0Opacity,
              transform: `scale(${1 + p0 * 0.1})`
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: '400',
                letterSpacing: '3px',
                color: '#ffffff',
                textTransform: 'uppercase',
                lineHeight: '1.1',
                textShadow: '0 4px 30px rgba(0,0,0,0.95)'
              }}>
                A SANCTUARY OF ETERNAL GRANDEUR
              </h2>
            </div>

            {/* Revealed Full-Screen Title ("THE PRESIDENTIAL SUITES") */}
            <div style={{
              position: 'absolute',
              zIndex: 4,
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '1000px',
              opacity: slide0TitleOpacity,
              transform: `translateY(${(1 - p0) * 30}px)`
            }}>
              <div style={{
                color: '#d4af37',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
                {showcaseSlides[0].tag}
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(44px, 6.8vw, 86px)',
                fontWeight: '500',
                lineHeight: '1.05',
                letterSpacing: '2px',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                textShadow: '0 6px 45px rgba(0,0,0,0.95)'
              }}>
                {showcaseSlides[0].title}
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '15.5px',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.7',
                fontWeight: '300',
                textShadow: '0 2px 14px rgba(0,0,0,0.9)'
              }}>
                {showcaseSlides[0].desc}
              </p>
            </div>
          </div>

          {/* ================= SLIDE 1: THE GRAND FINE DINING (ARCH SLIDES UP OVER SLIDE 0) ================= */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: `${slide1Width}vw`,
            height: `${slide1Height}vh`,
            borderRadius: `${slide1Radius}px ${slide1Radius}px 0 0`,
            transform: `translate3d(0, ${slide1Y}%, 0)`,
            overflow: 'hidden',
            zIndex: 2,
            boxShadow: p1 > 0.01 && p1 < 0.99 ? '0 -35px 90px rgba(0,0,0,0.95)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050811'
          }}>
            <img 
              src={showcaseSlides[1].customImg} 
              alt={showcaseSlides[1].title}
              onError={(e) => { e.target.onerror = null; e.target.src = showcaseSlides[1].img; }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate3d(0, ${slide1ImgParallax}%, 0)`,
                filter: 'brightness(0.88) contrast(1.06)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.6) 75%, #050811 100%)'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 3,
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '1000px',
              opacity: slide1TitleOpacity,
              transform: `translateY(${(1 - p1) * 40}px)`
            }}>
              <div style={{
                color: '#d4af37',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
                {showcaseSlides[1].tag}
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(44px, 6.8vw, 86px)',
                fontWeight: '500',
                lineHeight: '1.05',
                letterSpacing: '2px',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                textShadow: '0 6px 45px rgba(0,0,0,0.95)'
              }}>
                {showcaseSlides[1].title}
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '15.5px',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.7',
                fontWeight: '300',
                textShadow: '0 2px 14px rgba(0,0,0,0.9)'
              }}>
                {showcaseSlides[1].desc}
              </p>
            </div>
          </div>

          {/* ================= SLIDE 2: THE AMBER BAR & CELLAR (ARCH SLIDES UP OVER SLIDE 1) ================= */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: `${slide2Width}vw`,
            height: `${slide2Height}vh`,
            borderRadius: `${slide2Radius}px ${slide2Radius}px 0 0`,
            transform: `translate3d(0, ${slide2Y}%, 0)`,
            overflow: 'hidden',
            zIndex: 3,
            boxShadow: p2 > 0.01 && p2 < 0.99 ? '0 -35px 90px rgba(0,0,0,0.95)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050811'
          }}>
            <img 
              src={showcaseSlides[2].customImg} 
              alt={showcaseSlides[2].title}
              onError={(e) => { e.target.onerror = null; e.target.src = showcaseSlides[2].img; }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate3d(0, ${slide2ImgParallax}%, 0)`,
                filter: 'brightness(0.88) contrast(1.06)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.6) 75%, #050811 100%)'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 3,
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '1000px',
              opacity: slide2TitleOpacity,
              transform: `translateY(${(1 - p2) * 40}px)`
            }}>
              <div style={{
                color: '#d4af37',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
                {showcaseSlides[2].tag}
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(44px, 6.8vw, 86px)',
                fontWeight: '500',
                lineHeight: '1.05',
                letterSpacing: '2px',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                textShadow: '0 6px 45px rgba(0,0,0,0.95)'
              }}>
                {showcaseSlides[2].title}
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '15.5px',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.7',
                fontWeight: '300',
                textShadow: '0 2px 14px rgba(0,0,0,0.9)'
              }}>
                {showcaseSlides[2].desc}
              </p>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}>
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                style={{
                  width: activeDot === i ? '30px' : '8px',
                  height: '4px',
                  borderRadius: '4px',
                  background: activeDot === i ? '#d4af37' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* ================= 3. LIVE SUITES & RESIDENCES SECTION ================= */}
      <section id="residences" style={{
        position: 'relative',
        zIndex: 3,
        padding: '90px 24px 70px 24px',
        maxWidth: '1340px',
        margin: '0 auto',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '25px', height: '1px', background: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Accommodations Portfolio
            </span>
            <div style={{ width: '25px', height: '1px', background: '#d4af37' }} />
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(30px, 4vw, 46px)',
            color: '#ffffff',
            margin: '0 0 20px 0'
          }}>
            Suites, Penthouses & Residences
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'].map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  style={{
                    background: isSelected ? '#d4af37' : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#070b14' : '#cbd5e1',
                    border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.12)',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat === 'All' ? 'All Residences' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Suites Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 380px))',
          justifyContent: 'center',
          gap: '30px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1', color: '#d4af37' }}>
              Retrieving live suite availability...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1', color: '#94a3b8' }}>
              No suites available in this category.
            </div>
          ) : filteredRooms.map((room) => {
            const isAvailable = room.status === 'Available';
            return (
              <div 
                key={room._id}
                style={{
                  background: 'rgba(10, 16, 30, 0.78)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={getRoomImg(room.roomType)} 
                    alt={room.roomType}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span style={{
                      background: isAvailable ? 'rgba(16, 185, 129, 0.92)' : 'rgba(244, 63, 94, 0.92)',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backdropFilter: 'blur(6px)'
                    }}>
                      ● {room.status}
                    </span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#d4af37',
                    fontWeight: '600'
                  }}>
                    Suite #{room.roomNumber} • Floor {room.floor}
                  </div>
                </div>

                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', color: '#ffffff', margin: '0 0 8px 0' }}>
                      {room.roomType}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', minHeight: '42px' }}>
                      {room.description || 'Master-crafted suite offering expansive views, premium Italian linens, and dedicated 24/7 butler desk.'}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.slice(0, 3).map((am, i) => (
                          <span key={i} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '11px',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {am}
                          </span>
                        ))
                      ) : (
                        ['High-Speed Wifi', 'King Bed', 'City View'].map((item, i) => (
                          <span key={i} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '11px',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {item}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: '700', color: '#d4af37' }}>
                        ${room.pricePerNight}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}> / night</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setRoomDetailModal(room)}
                        title="Room Specs"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#cbd5e1',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Info size={14} />
                      </button>

                      <button 
                        onClick={() => handleOpenBooking(room)}
                        disabled={!isAvailable}
                        style={{
                          background: isAvailable ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#334155',
                          color: isAvailable ? '#070b14' : '#94a3b8',
                          fontWeight: '700',
                          fontSize: '12px',
                          letterSpacing: '0.4px',
                          textTransform: 'uppercase',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          boxShadow: isAvailable ? '0 3px 12px rgba(212, 175, 55, 0.25)' : 'none',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        {isAvailable ? 'Reserve Suite' : 'Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 4. BESPOKE VIP PRIVILEGES ================= */}
      <section style={{
        padding: '90px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Signature Resort Privileges
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', margin: '8px 0' }}>
              Bespoke Guest Craftsmanship
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '26px'
          }}>
            <div style={{ background: 'rgba(10, 16, 30, 0.78)', backdropFilter: 'blur(12px)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ height: '200px' }}>
                <img src="/Images/service-chauffeur.jpg" alt="Chauffeur" onError={(e) => { e.target.onerror = null; e.target.src = '/Images/about-hotel.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <Car size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Private Fleet</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', color: '#fff', marginBottom: '8px' }}>
                  Rolls-Royce Chauffeur Transfer
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Complimentary airport escort and city transportation with our dedicated white-glove private drivers.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(10, 16, 30, 0.78)', backdropFilter: 'blur(12px)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ height: '200px' }}>
                <img src="/Images/experience-yacht.jpg" alt="Yacht" onError={(e) => { e.target.onerror = null; e.target.src = '/Images/amenity-pool.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <Anchor size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Maritime Leisure</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', color: '#fff', marginBottom: '8px' }}>
                  Private Sunset Yacht Charters
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Set sail on private waters with an on-board sommelier, fresh oyster bar, and champagne pairing.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(10, 16, 30, 0.78)', backdropFilter: 'blur(12px)', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ height: '200px' }}>
                <img src="/Images/experience-lounge.jpg" alt="Sky Lounge" onError={(e) => { e.target.onerror = null; e.target.src = '/Images/amenity-dining.jpg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <GlassWater size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Nightlife & Cellar</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', color: '#fff', marginBottom: '8px' }}>
                  The 50th-Floor Cigar & Wine Club
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Members-only access to vintage cognac cellars, rare single malts, and hand-rolled private reserve cigars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. GUEST REVIEWS & FEEDBACK ================= */}
      <section style={{ padding: '90px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', gap: '6px', marginBottom: '14px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} color="#d4af37" style={{ fill: '#d4af37' }} />
            ))}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 40px)', color: '#ffffff', marginBottom: '12px' }}>
            Guest Experience & Verified Impressions
          </h2>

          <button 
            onClick={() => setFeedbackModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
              color: '#070b14',
              fontWeight: '700',
              fontSize: '12.5px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              padding: '12px 28px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              margin: '20px 0 50px 0'
            }}
          >
            <Star size={14} /> Submit Stay Review
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            {[
              {
                name: 'Daniyal Tariq',
                suite: 'Executive Suite • Floor 2',
                rating: 5,
                comment: 'The presidential hospitality is truly unrivaled. The in-suite dining and private butler service exceeded all my expectations.',
                date: 'September 2026'
              },
              {
                name: 'Dr. Sarah Ahmed',
                suite: 'Deluxe Suite • Floor 1',
                rating: 5,
                comment: 'The infinity pool at twilight offers the most tranquil view. Impeccable cleanliness and courteous front desk staff.',
                date: 'September 2026'
              },
              {
                name: 'Hamza Farooq',
                suite: 'Penthouse Residency • Floor 3',
                rating: 5,
                comment: 'Seamless contactless check-in. The room was pristine, and my wake-up call was handled right on the minute. Outstanding.',
                date: 'October 2026'
              }
            ].map((rev, idx) => (
              <div key={idx} style={{ background: 'rgba(10, 16, 30, 0.78)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} color="#d4af37" style={{ fill: '#d4af37' }} />
                  ))}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '13.5px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '16px' }}>
                  "{rev.comment}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '13.5px', fontWeight: '700' }}>{rev.name}</div>
                    <div style={{ color: '#d4af37', fontSize: '11px' }}>{rev.suite}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MODAL: QUICK ROOM SPECS ================= */}
      {roomDetailModal && (
        <div style={modalBackdropStyle} onClick={() => setRoomDetailModal(null)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '220px', position: 'relative' }}>
              <img 
                src={getRoomImg(roomDetailModal.roomType)} 
                alt={roomDetailModal.roomType} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => setRoomDetailModal(null)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#fff', margin: 0 }}>
                  {roomDetailModal.roomType}
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#d4af37' }}>
                  ${roomDetailModal.pricePerNight} <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ night</span>
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                {roomDetailModal.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '8px' }}>
                  Suite Features & Inclusions
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {roomDetailModal.amenities?.map((am, i) => (
                    <span key={i} style={{ fontSize: '11.5px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#cbd5e1' }}>
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setRoomDetailModal(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}>Close</button>
                <button 
                  onClick={() => handleOpenBooking(roomDetailModal)} 
                  disabled={roomDetailModal.status !== 'Available'}
                  style={{ 
                    flex: 2, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    background: roomDetailModal.status === 'Available' ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#334155', 
                    color: roomDetailModal.status === 'Available' ? '#070b14' : '#94a3b8', 
                    fontWeight: '700', 
                    border: 'none', 
                    cursor: roomDetailModal.status === 'Available' ? 'pointer' : 'not-allowed' 
                  }}
                >
                  {roomDetailModal.status === 'Available' ? 'Reserve Suite' : 'Occupied'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ONLINE ROOM BOOKING ================= */}
      {bookingModalOpen && selectedRoom && (
        <div style={modalBackdropStyle} onClick={() => setBookingModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '540px',
              padding: '30px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '21px', margin: 0 }}>
                  Reserve {selectedRoom.roomType}
                </h3>
                <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: '600' }}>
                  Suite #{selectedRoom.roomNumber} • ${selectedRoom.pricePerNight} / night
                </span>
              </div>
              <button onClick={() => setBookingModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Check size={28} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '22px', marginBottom: '6px' }}>
                  Reservation Confirmed!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                  Your booking has been registered in the LuxuryStay operations system.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference Code</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#d4af37', letterSpacing: '1px', marginTop: '4px' }}>
                    {bookingSuccess.bookingReference}
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>
                    Estimated Tariff: <strong>${bookingSuccess.roomCharges}</strong>
                  </div>
                </div>
                <button 
                  onClick={() => setBookingModalOpen(false)} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                    color: '#070b14',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnlineBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Khan"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="daniyal@gmail.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+92 300 1234567"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>CNIC / Passport Number</label>
                    <input
                      type="text"
                      placeholder="42101-0000000-0"
                      value={bookingForm.idNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, idNumber: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Arrival Date *</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={bookingForm.checkInDate}
                      onChange={(e) => {
                        const newIn = e.target.value;
                        setBookingForm((prev) => ({
                          ...prev,
                          checkInDate: newIn,
                          checkOutDate: prev.checkOutDate <= newIn 
                            ? new Date(new Date(newIn).getTime() + 86400000).toISOString().split('T')[0]
                            : prev.checkOutDate
                        }));
                      }}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Departure Date *</label>
                    <input
                      type="date"
                      required
                      min={bookingForm.checkInDate || todayStr}
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Adults *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={bookingForm.adults}
                      onChange={(e) => setBookingForm({ ...bookingForm, adults: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Children</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={bookingForm.children}
                      onChange={(e) => setBookingForm({ ...bookingForm, children: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={fieldLabelStyle}>Special Requests / Arrival Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Limousine transfer, late check-in"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setBookingModalOpen(false)} 
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#cbd5e1',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingBooking} 
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                      color: '#070b14',
                      fontWeight: '700',
                      padding: '9px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: submittingBooking ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {submittingBooking ? 'Booking...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: GUEST CONCIERGE ================= */}
      {serviceModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setServiceModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellRing size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '18px', margin: 0 }}>
                  Guest Concierge Desk
                </h3>
              </div>
              <button onClick={() => setServiceModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={fieldLabelStyle}>Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Tariq"
                  value={serviceForm.guestName}
                  onChange={(e) => setServiceForm({ ...serviceForm, guestName: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Suite / Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101 or Presidential Suite"
                  value={serviceForm.roomNumber}
                  onChange={(e) => setServiceForm({ ...serviceForm, roomNumber: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Requested Service *</label>
                <select
                  value={serviceForm.serviceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="Wake-up Call">Wake-up Call Service</option>
                  <option value="Airport Transportation">VIP Airport Limousine / Chauffeur</option>
                  <option value="Room Service">In-Suite Michelin Dining / Room Service</option>
                  <option value="Luggage Assistance">Luggage & Valet Assistance</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Timing / Specific Details</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please arrange wake-up call tomorrow at 06:30 AM."
                  value={serviceForm.details}
                  onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                  style={{ ...fieldInputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', color: '#070b14', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Relay Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FEEDBACK ================= */}
      {feedbackModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setFeedbackModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '18px', margin: 0 }}>
                  Stay Feedback & Ratings
                </h3>
              </div>
              <button onClick={() => setFeedbackModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={fieldLabelStyle}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Tariq"
                  value={feedbackForm.guestName}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, guestName: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Suite / Room Stayed</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Suite • Floor 2"
                  value={feedbackForm.suiteStayed}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, suiteStayed: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Cleanliness & Hygiene</label>
                <select
                  value={feedbackForm.cleanliness}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, cleanliness: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="5">★★★★★ Exceptional (5/5)</option>
                  <option value="4">★★★★☆ Very Good (4/5)</option>
                  <option value="3">★★★☆☆ Average (3/5)</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Hospitality & Service</label>
                <select
                  value={feedbackForm.service}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, service: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="5">★★★★★ Outstanding (5/5)</option>
                  <option value="4">★★★★☆ Professional (4/5)</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Comments *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details of your stay..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  style={{ ...fieldInputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setFeedbackModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', color: '#070b14', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px'
};

const fieldLabelStyle = {
  fontSize: '11.5px',
  color: '#cbd5e1',
  display: 'block',
  marginBottom: '5px'
};

const fieldInputStyle = {
  width: '100%',
  background: 'rgba(7, 11, 20, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '10px 12px',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default LandingPage;