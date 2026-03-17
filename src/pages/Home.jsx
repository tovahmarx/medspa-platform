// Public-facing home/landing page for the medspa — the "cover" for demos
import { useNavigate } from 'react-router-dom';
import { useStyles, useTheme } from '../theme';
import { getSettings } from '../data/store';

export default function Home() {
  const s = useStyles();
  const { theme } = useTheme();
  const nav = useNavigate();
  const settings = getSettings();
  const name = settings.businessName || 'Your MedSpa';
  const tagline = settings.tagline || 'Where Science Meets Beauty';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', overflow: 'hidden', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}10 0%, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: theme.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: `700 14px ${s.FONT}`, color: theme.accentText,
          }}>
            {name[0]}
          </div>
          <span style={{ font: `600 16px ${s.FONT}`, color: '#fff' }}>{name}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => nav('/book')} style={{
            padding: '9px 22px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: '#fff', font: `500 13px ${s.FONT}`, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >Book Online</button>
          <button onClick={() => nav('/portal')} style={{
            padding: '9px 22px', borderRadius: 100, border: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff', font: `500 13px ${s.FONT}`, cursor: 'pointer',
            backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >Member Portal</button>
          <button onClick={() => nav('/')} style={{
            padding: '9px 22px', borderRadius: 100, border: 'none',
            background: theme.accent, color: theme.accentText, font: `500 13px ${s.FONT}`, cursor: 'pointer',
            boxShadow: `0 2px 16px ${theme.accent}40`, transition: 'all 0.2s',
          }}>Staff Login</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 280px)', textAlign: 'center', position: 'relative', zIndex: 10,
        padding: '0 24px',
      }}>
        <div style={{
          font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 3,
          color: theme.accent, marginBottom: 20,
        }}>{tagline}</div>

        <h1 style={{
          font: `300 64px ${s.FONT}`, color: '#fff', marginBottom: 20,
          letterSpacing: '-1.5px', lineHeight: 1.1, maxWidth: 700,
        }}>
          Your Beauty,{' '}
          <span style={{ fontWeight: 600 }}>Our Science</span>
        </h1>

        <p style={{
          font: `300 18px ${s.FONT}`, color: 'rgba(255,255,255,0.55)',
          maxWidth: 520, lineHeight: 1.6, marginBottom: 40,
        }}>
          Premium aesthetic treatments tailored to your unique goals. From injectables to body contouring — experience the difference of personalized care.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/book')} style={{
            padding: '14px 36px', borderRadius: 100, border: 'none',
            background: theme.accent, color: theme.accentText,
            font: `600 15px ${s.FONT}`, cursor: 'pointer',
            boxShadow: `0 4px 24px ${theme.accent}40`,
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${theme.accent}50`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${theme.accent}40`; }}
          >Book a Consultation</button>
          <button onClick={() => nav('/portal')} style={{
            padding: '14px 36px', borderRadius: 100, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)', font: `500 15px ${s.FONT}`,
            backdropFilter: 'blur(8px)', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          >Member Login</button>
        </div>
      </div>

      {/* Services Preview */}
      <div style={{
        padding: '60px 40px', position: 'relative', zIndex: 10,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 2, color: theme.accent, marginBottom: 8 }}>Our Services</div>
          <h2 style={{ font: `300 28px ${s.FONT}`, color: '#fff', letterSpacing: '-0.5px' }}>Comprehensive Aesthetic Care</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, maxWidth: 900, margin: '0 auto' }}>
          {[
            { name: 'Injectables', desc: 'Botox, Fillers, Sculptra' },
            { name: 'Skin', desc: 'Microneedling, Peels, IPL' },
            { name: 'Laser', desc: 'Hair Removal, Resurfacing' },
            { name: 'Body', desc: 'Contouring, CoolSculpting' },
            { name: 'Surgical', desc: 'Awake Lipo, BodyTite' },
            { name: 'Wellness', desc: 'Weight Loss, IV, HRT' },
          ].map(svc => (
            <div key={svc.name} onClick={() => nav('/book')} style={{
              padding: '24px 20px', borderRadius: 16, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = `${theme.accent}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ font: `600 15px ${s.FONT}`, color: '#fff', marginBottom: 4 }}>{svc.name}</div>
              <div style={{ font: `400 12px ${s.FONT}`, color: 'rgba(255,255,255,0.4)' }}>{svc.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '40px', textAlign: 'center', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ font: `400 13px ${s.FONT}`, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
          {name} — {settings.phone || ''} — {settings.email || ''}
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button onClick={() => nav('/book')} style={{ background: 'none', border: 'none', font: `400 12px ${s.FONT}`, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Book Online</button>
          <button onClick={() => nav('/portal')} style={{ background: 'none', border: 'none', font: `400 12px ${s.FONT}`, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Member Portal</button>
          <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', font: `400 12px ${s.FONT}`, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Staff</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          h1 { font-size: 36px !important; }
          nav { padding: 16px 20px !important; }
          nav > div:last-child { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
