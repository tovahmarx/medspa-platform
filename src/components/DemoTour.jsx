// Guided Tour — 8-step modal walkthrough introducing platform features
// Shows on first visit; stores ms_tour_complete in localStorage
// Re-triggerable via showTour prop

import { useState, useEffect, useCallback } from 'react';
import { useStyles } from '../theme';

const TOUR_KEY = 'ms_tour_complete';

const STEPS = [
  {
    title: 'Welcome to your medspa platform',
    description: 'Everything you need to run a modern medspa — scheduling, charting, billing, marketing, and retention — all in one place. Let us show you around.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="12" stroke="currentColor" strokeWidth="2" />
        <path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    category: null,
  },
  {
    title: 'Dashboard',
    description: 'Your command center. See real-time KPIs — today\'s appointments, monthly revenue, active patients, and retention alerts — all at a glance with live sparkline trends.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="6" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="28" y="6" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="6" y="28" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="28" y="28" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    category: 'Overview',
  },
  {
    title: 'DM Inbox',
    description: 'A shared inbox that pulls in messages from Instagram, Facebook, and TikTok. Reply to patient inquiries without switching apps — and convert DMs into booked appointments.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M40 30a4 4 0 01-4 4H14l-8 8V10a4 4 0 014-4h26a4 4 0 014 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    category: 'Marketing',
  },
  {
    title: 'Clinical Charts',
    description: 'SOAP-format clinical notes with interactive face, body, and scalp maps. Tap to annotate injection sites, mark treatment zones, and build a visual treatment history for every patient.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M32 8h4a4 4 0 014 4v28a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="16" y="4" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="34" x2="24" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    category: 'Patients',
  },
  {
    title: 'Patient Portal',
    description: 'Your patients get their own portal at /portal — they can view upcoming appointments, sign consent forms, see before/after photos, check their wallet balance, and fill out intake forms before they arrive.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M8 42v-4a12 12 0 0124 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 26l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="28" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    category: 'Patients',
  },
  {
    title: 'Retention Engine',
    description: 'Smart alerts flag patients who are overdue for their next treatment. See lapsed patients sorted by priority, with one-click outreach via email or text to bring them back.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6C14.06 6 6 14.06 6 24s8.06 18 18 18 18-8.06 18-18S33.94 6 24 6z" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="10" r="5" fill="currentColor" opacity="0.3" />
        <circle cx="38" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    category: 'Operations',
  },
  {
    title: 'Brand Theming',
    description: 'Make the platform yours. Use the color picker at the bottom of the sidebar to choose from 8 presets or set a custom brand color. Every button, highlight, and accent updates instantly.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="14" r="4" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="28" r="4" fill="currentColor" opacity="0.45" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="28" r="4" fill="currentColor" opacity="0.65" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    category: 'System',
  },
  {
    title: "You're all set!",
    description: 'You now know the essentials. Explore each section at your own pace — and if you ever want to revisit this tour, click "Take a Tour" on the Dashboard.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    category: null,
  },
];

export default function DemoTour({ showTour, onClose }) {
  const s = useStyles();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Show on first visit if never completed (skip in embed mode)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('embed')) return;
    if (showTour) {
      setStep(0);
      setVisible(true);
      return;
    }
    const done = localStorage.getItem(TOUR_KEY);
    if (!done) {
      setVisible(true);
    }
  }, [showTour]);

  const closeTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, 'true');
    setVisible(false);
    setStep(0);
    if (onClose) onClose();
  }, [onClose]);

  const goTo = useCallback((nextStep) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 200);
  }, []);

  const next = () => {
    if (step < STEPS.length - 1) goTo(step + 1);
    else closeTour();
  };

  const back = () => {
    if (step > 0) goTo(step - 1);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'tourOverlayIn 0.3s ease',
    }}>
      {/* Glass card */}
      <div style={{
        width: '90%', maxWidth: 520,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: 24,
        boxShadow: '0 24px 80px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        opacity: animating ? 0 : 1,
        transform: animating ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(0,0,0,0.04)' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: s.accent,
            borderRadius: 3,
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: '40px 36px 28px' }}>
          {/* Category badge */}
          {current.category && (
            <div style={{
              display: 'inline-block',
              padding: '4px 12px', borderRadius: 100, marginBottom: 16,
              background: s.accentLight,
              font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1.5,
              color: s.accent,
            }}>
              {current.category}
            </div>
          )}

          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: s.accentLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.accent, marginBottom: 24,
            boxShadow: `0 4px 16px ${s.accent}20`,
          }}>
            {current.icon}
          </div>

          {/* Title */}
          <h2 style={{
            font: `600 24px ${s.FONT}`, color: s.text, marginBottom: 12,
            letterSpacing: '-0.3px', lineHeight: 1.2,
          }}>
            {current.title}
          </h2>

          {/* Description */}
          <p style={{
            font: `400 15px/1.65 ${s.FONT}`, color: s.text2, margin: 0,
          }}>
            {current.description}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 36px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Step counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? s.accent : 'rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }} />
            ))}
            <span style={{
              font: `400 11px ${s.MONO}`, color: s.text3, marginLeft: 8,
            }}>
              {step + 1}/{STEPS.length}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && !isLast && (
              <button onClick={closeTour} style={{
                ...s.pillGhost, padding: '8px 16px', fontSize: 12,
              }}>
                Skip
              </button>
            )}
            {!isFirst && (
              <button onClick={back} style={{
                ...s.pillOutline, padding: '8px 18px', fontSize: 12,
              }}>
                Back
              </button>
            )}
            <button onClick={next} style={{
              ...s.pillAccent, padding: '8px 22px', fontSize: 13,
            }}>
              {isFirst ? 'Start Tour' : isLast ? 'Explore' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes tourOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
