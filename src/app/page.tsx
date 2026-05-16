'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCount(target: number, active: boolean, dur = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, active, dur]);
  return v;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const Chk = ({ cls = '' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Product',        href: '#product' },
    { label: 'How It Works',   href: '#how-it-works' },
    { label: 'Technology',     href: '#technology' },
    { label: 'Markets',        href: '#markets' },
  ];

  return (
    <>
      {/* Promo strip */}
      <div className="fixed top-0 inset-x-0 z-50 bg-brand-teal-deep text-center py-2 px-4">
        <p className="text-xs text-on-dark-muted">
          <span className="text-brand-green font-semibold">NOVA</span>
          {' '}— AI Fall Detection System · Currently in Development & Ideation Phase ·{' '}
          <a href="#waitlist" className="text-brand-green underline underline-offset-2 font-medium">
            Join the Waitlist →
          </a>
        </p>
      </div>

      {/* Nav */}
      <nav className={`fixed top-8 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur border-b border-hairline shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/nova_logo.png"
              alt="NOVA"
              width={150}
              height={66}
              className={`object-contain transition-all ${scrolled ? '' : 'brightness-0 invert'}`}
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-steel hover:text-ink' : 'text-white/75 hover:text-white'
                }`}
              >{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#waitlist"
              className="hidden md:inline-block bg-brand-green text-on-primary font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 active:scale-95 transition-all"
            >
              Request Demo
            </a>
            <button onClick={() => setOpen(!open)} className="md:hidden p-1.5" aria-label="Menu">
              <svg className={`w-5 h-5 ${scrolled ? 'text-ink' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-hairline px-6 py-4 flex flex-col gap-4">
            {links.map(l => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-steel hover:text-ink" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#waitlist" className="bg-brand-green text-on-primary font-semibold text-sm text-center py-3 rounded-full">
              Request Demo
            </a>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [in_, setIn] = useState(false);
  useEffect(() => { setTimeout(() => setIn(true), 80); }, []);

  const delay = () => `transition-all duration-700 ${in_ ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  return (
    <section className="relative min-h-screen bg-brand-teal-deep flex items-center overflow-hidden pt-16">
      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[15%] left-[8%]  w-[520px] h-[520px] rounded-full bg-brand-green/7  blur-[110px] animate-orb1" />
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-brand-green-mid/10 blur-[90px]  animate-orb2" />
        <div className="absolute top-[55%] left-[38%] w-[320px] h-[320px] rounded-full bg-brand-green/4  blur-[70px]" style={{ animation: 'orb1 22s ease-in-out infinite reverse' }} />
      </div>

      {/* hero.png atmospheric bg */}
      <div className="absolute inset-0">
        <Image src="/images/hero.png" alt="" fill className="object-cover object-center opacity-10" priority aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-deep via-brand-teal-deep/85 to-brand-teal-deep/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-teal-deep via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* TEXT SIDE */}
        <div>
          <div className={`inline-flex items-center gap-2 glass-green rounded-full px-4 py-1.5 mb-8 ${delay()}`}
               style={{ transitionDelay: '0ms' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green text-[10px] font-bold tracking-[1.2px] uppercase">
              Fall Detection · Prevention · Response
            </span>
          </div>

          <h1 className={`text-[clamp(2.8rem,5.5vw,4.2rem)] font-medium text-white leading-[1.08] tracking-[-1.5px] mb-5 ${delay()}`}
              style={{ transitionDelay: '100ms' }}>
            The intelligent<br />
            <span className="gradient-text-green">fall safety system</span><br />
            for everyone.
          </h1>

          <p className={`text-[1.05rem] text-on-dark-muted leading-relaxed max-w-[480px] mb-8 ${delay()}`}
             style={{ transitionDelay: '200ms' }}>
            NOVA fuses a smart vest, precision smartwatch, and AI-powered app into a three-state safety model — monitoring, predicting, and responding to fall events in real time.
          </p>

          {/* 3-State mini preview */}
          <div className={`flex gap-2 mb-10 flex-wrap ${delay()}`} style={{ transitionDelay: '300ms' }}>
            {[
              { label: 'Normal',  dot: 'bg-brand-green',  desc: 'Passive monitoring' },
              { label: 'At Risk', dot: 'bg-amber-400',    desc: 'Early warning' },
              { label: 'Fall',    dot: 'bg-red-400',      desc: 'Emergency response' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 glass-dark rounded-full px-3 py-1.5">
                <span className={`w-2 h-2 rounded-full ${s.dot} animate-state`} />
                <span className="text-on-dark text-xs font-semibold">{s.label}</span>
                <span className="text-on-dark-muted text-xs hidden sm:inline">— {s.desc}</span>
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 mb-12 ${delay()}`} style={{ transitionDelay: '400ms' }}>
            <a href="#waitlist"
              className="group bg-brand-green text-on-primary font-semibold text-sm px-7 py-4 rounded-full animate-pulse-g hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              Request a Demo
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href="#product"
              className="border border-white/25 text-white font-medium text-sm px-7 py-4 rounded-full hover:border-white/50 hover:bg-white/5 transition-all text-center"
            >
              Explore the System
            </a>
          </div>

          <div className={`flex flex-wrap gap-x-6 gap-y-2 ${delay()}`} style={{ transitionDelay: '500ms' }}>
            {['99.8% Detection Accuracy', 'Sub-100ms Response', 'HIPAA Compliant', 'Edge AI Inference'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-on-dark-muted text-xs">
                <Chk cls="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* VIDEO SIDE */}
        <div className={`flex justify-center lg:justify-end ${delay()}`} style={{ transitionDelay: '400ms' }}>
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-brand-green/50 via-brand-green-mid/25 to-transparent blur-sm animate-border-g" />

            <div className="relative w-[320px] sm:w-[380px] lg:w-[420px] aspect-square rounded-3xl overflow-hidden bg-canvas-dark border border-brand-green/20 animate-float">
              <Image
                src="/images/hero.png"
                alt="NOVA Guardian system"
                fill
                className="object-cover object-center"
                priority
              />

              {/* Corner brackets */}
              {(['top-3 left-3 border-t-2 border-l-2 rounded-tl', 'top-3 right-3 border-t-2 border-r-2 rounded-tr', 'bottom-3 left-3 border-b-2 border-l-2 rounded-bl', 'bottom-3 right-3 border-b-2 border-r-2 rounded-br'] as const).map((c, i) => (
                <div key={i} className={`absolute ${c} w-5 h-5 border-brand-green/70`} />
              ))}

              {/* Status pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-dark rounded-full px-3 py-1 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span className="text-on-dark text-[10px] font-bold tracking-widest uppercase">Live Monitoring</span>
              </div>

              {/* Bottom metrics */}
              <div className="absolute bottom-4 inset-x-4 glass-dark rounded-xl p-3 grid grid-cols-3 divide-x divide-white/10 text-center">
                {[['99.8%','Accuracy'],['<30s','Alert Time'],['24/7','Active']].map(([v,l]) => (
                  <div key={l}>
                    <div className="text-brand-green text-sm font-bold">{v}</div>
                    <div className="text-on-dark-muted text-[10px]">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-8 top-[28%] glass-dark rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-green/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <div className="text-brand-green text-xs font-bold">Normal State</div>
                  <div className="text-on-dark-muted text-[10px]">All vitals stable</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-[28%] glass-dark rounded-2xl p-3 shadow-xl animate-float" style={{ animationDelay: '2.4s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-400/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <div>
                  <div className="text-red-400 text-xs font-bold">Alert Sent</div>
                  <div className="text-on-dark-muted text-[10px]">3 contacts notified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHO stat strip */}
      <div className="absolute bottom-0 inset-x-0 glass-dark border-t border-white/8 py-3">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            ['684,000', 'fall-related deaths per year (WHO, 2021)'],
            ['37M+',    'serious fall injuries annually worldwide'],
            ['#2',      'cause of unintentional injury deaths globally'],
          ].map(([n, d]) => (
            <div key={n} className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-brand-green font-bold text-sm">{n}</span>
              <span className="text-on-dark-muted text-xs">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── THREE-STATE MODEL ────────────────────────────────────────────────────────

function ThreeStateSection() {
  const { ref, visible } = useReveal();
  const [activeState, setActiveState] = useState(0);

  const states = [
    {
      key:     'normal',
      label:   'Normal',
      emoji:   '🟢',
      dot:     'bg-brand-green',
      ring:    'ring-brand-green/40',
      bg:      'bg-[#f0fdf9]',
      border:  'border-brand-green/30',
      hdr:     'text-brand-green-dark',
      ctaBg:   'bg-brand-green text-on-primary',
      headline: 'Baseline monitoring & stability tracking.',
      desc:    'During the Normal state, NOVA continuously samples motion data from the vest\'s 12 IMU sensors and cross-references with watch vitals. No intervention is triggered — the system silently builds a personalized baseline for each user, enabling smarter anomaly detection over time.',
      actions: ['Passive motion & vitals logging', 'Personalized baseline construction', 'Activity & step count tracking', 'Sleep quality monitoring', 'Health trend analytics'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      key:     'risk',
      label:   'At Risk',
      emoji:   '🟡',
      dot:     'bg-amber-400',
      ring:    'ring-amber-400/40',
      bg:      'bg-amber-50',
      border:  'border-amber-300/50',
      hdr:     'text-amber-700',
      ctaBg:   'bg-amber-400 text-white',
      headline: 'Prevention layer — intervene before an accident.',
      desc:    'The At Risk state is NOVA\'s most innovative feature: a prevention layer that detects elevated instability, abnormal gait patterns, or concerning vitals before a fall occurs. This state enables proactive intervention and is what sets NOVA apart from reactive fall/no-fall systems.',
      actions: ['Early instability & fatigue detection', 'Behavioral prompts (rest, sit, hydrate)', 'Caregiver & safety officer check-in alerts', 'Abnormal gait pattern flagging', 'Scheduled follow-up workflows (B2B)'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      key:     'fall',
      label:   'Fall',
      emoji:   '🔴',
      dot:     'bg-red-400',
      ring:    'ring-red-400/40',
      bg:      'bg-red-50',
      border:  'border-red-300/50',
      hdr:     'text-red-700',
      ctaBg:   'bg-red-400 text-white',
      headline: 'Emergency workflow — alert, locate, respond.',
      desc:    'When a fall is confirmed, NOVA triggers a 30-second confirmation window. If unacknowledged, the system dispatches push notifications with real-time GPS location to up to 10 emergency contacts, logs the incident with full sensor context, and enables one-tap 911 dispatch via the app.',
      actions: ['30-second confirmation window before alert', 'Real-time GPS location broadcast', 'Push notifications to up to 10 contacts', 'Structured incident log with sensor context', 'One-tap 911 escalation'],
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ];

  const s = states[activeState];

  return (
    <section id="how-it-works" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal text-center mb-16 ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-5">
            <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">Core Innovation</span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-ink tracking-[-0.5px] mb-4">
            A three-state operational safety model.
          </h2>
          <p className="text-lg text-steel max-w-2xl mx-auto">
            Unlike traditional fall/no-fall binary systems, NOVA introduces an <strong className="text-ink">At Risk</strong> prevention layer — the critical difference between reacting to falls and preventing them.
          </p>
        </div>

        {/* State selector */}
        <div className="flex justify-center gap-3 mb-12">
          {states.map((st, i) => (
            <button
              key={st.key}
              onClick={() => setActiveState(i)}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all ${
                activeState === i
                  ? `${st.bg} ${st.border} ${st.hdr} border ring-2 ${st.ring} ring-offset-2`
                  : 'bg-white border-hairline text-steel hover:border-ink/20 hover:text-ink'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              {st.label}
            </button>
          ))}
        </div>

        {/* Active state detail */}
        <div className={`grid lg:grid-cols-2 gap-10 items-center rounded-[20px] p-8 md:p-12 border transition-all duration-500 ${s.bg} ${s.border} border`}>
          {/* Left */}
          <div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              activeState === 0 ? 'bg-brand-green/15 text-brand-green-dark' :
              activeState === 1 ? 'bg-amber-400/15 text-amber-700' :
              'bg-red-400/15 text-red-700'
            }`}>
              {s.icon}
            </div>
            <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${s.hdr}`}>
              State {activeState + 1} of 3 — {s.label}
            </div>
            <h3 className="text-2xl font-medium text-ink mb-4 leading-snug">{s.headline}</h3>
            <p className="text-steel text-[0.95rem] leading-relaxed mb-7">{s.desc}</p>
            <ul className="space-y-2.5">
              {s.actions.map(a => (
                <li key={a} className="flex items-start gap-2.5 text-sm text-charcoal">
                  <Chk cls={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    activeState === 0 ? 'text-brand-green' :
                    activeState === 1 ? 'text-amber-500' :
                    'text-red-400'
                  }`} />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — visual */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[340px]">
              {/* State diagram */}
              <div className="bg-white rounded-2xl border border-hairline p-6 shadow-sm">
                <div className="text-xs text-stone font-semibold uppercase tracking-widest text-center mb-6">System State Flow</div>

                <div className="flex flex-col gap-3">
                  {states.map((st, i) => (
                    <div
                      key={st.key}
                      onClick={() => setActiveState(i)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        activeState === i
                          ? `${st.bg} ${st.border} border-2`
                          : 'bg-surface-soft border-hairline opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activeState === i
                          ? (i === 0 ? 'bg-brand-green/20 text-brand-green-dark' : i === 1 ? 'bg-amber-400/20 text-amber-700' : 'bg-red-400/20 text-red-700')
                          : 'bg-hairline text-steel'
                      }`}>
                        {st.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${activeState === i ? 'text-ink' : 'text-slate'}`}>{st.label}</div>
                        <div className="text-xs text-stone truncate">
                          {['Passive monitoring', 'Prevention layer', 'Emergency response'][i]}
                        </div>
                      </div>
                      {activeState === i && (
                        <div className={`ml-auto w-2 h-2 rounded-full ${st.dot} animate-state`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-hairline text-center">
                  <div className="text-xs text-stone">Current Active State</div>
                  <div className={`text-lg font-bold mt-1 ${s.hdr}`}>{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCT HARDWARE ─────────────────────────────────────────────────────────

function ProductSection() {
  const { ref, visible } = useReveal();
  const [tab, setTab] = useState(0);

  const products = [
    {
      name:    'Guardian Vest',
      tagline: 'Core Motion Sensor',
      tagBg:   'bg-brand-green text-on-primary',
      video:   '/video/vest_rotation.mp4',
      still:   '/images/vest.png',
      specs: [
        ['Sensors',    '12 IMU (accelerometer + gyroscope)'],
        ['Response',   'Sub-100ms fall detection'],
        ['Battery',    '72-hour continuous operation'],
        ['Water',      'IP67 waterproof rated'],
        ['Sizes',      'XS · S · M · L · XL · XXL'],
        ['Fabric',     'Breathable, machine-washable'],
        ['Comms',      'BLE 5.2 + LTE backup'],
      ],
      desc: 'Engineered with 12 precision IMU sensors across a lightweight, breathable vest, the Guardian Vest continuously captures motion and body orientation data. Real-world designed for multi-rate sensor fusion, dropout tolerance, and edge-inference — not just controlled lab conditions.',
    },
    {
      name:    'Smart Companion Watch',
      tagline: 'Biometric & GPS Monitor',
      tagBg:   'bg-accent-blue text-white',
      video:   '/video/watch_rotation.mp4',
      still:   '/images/watch.png',
      specs: [
        ['Biometrics', 'Heart rate, SpO₂, stress index'],
        ['Location',   'GPS + GLONASS + BeiDou'],
        ['Battery',    '5-day active, 10-day standby'],
        ['Water',      '50m water resistance'],
        ['SOS',        'Hardware emergency button'],
        ['Display',    'Always-on AMOLED, 1.4"'],
        ['Comms',      'BLE 5.2 + Wi-Fi + LTE'],
      ],
      desc: 'Provides continuous vital sign monitoring to complement the vest\'s motion data. Heart rate and SpO₂ contextualise fall severity, while GPS enables real-time location sharing. A dedicated SOS hardware button allows manual emergency activation independent of AI detection.',
    },
    {
      name:    'NOVA Mobile App',
      tagline: 'AI Command Center',
      tagBg:   'bg-accent-purple text-white',
      video:   null,
      still:   '/images/app_ui.png',
      specs: [
        ['Platforms',  'iOS 16+ · Android 12+'],
        ['AI',         'On-device neural network inference'],
        ['Contacts',   'Up to 10 emergency contacts'],
        ['Sharing',    'Real-time GPS location feed'],
        ['Reports',    'Health trend & incident analytics'],
        ['Access',     'Caregiver portal with role-based views'],
        ['SOS',        'One-tap 911 dispatch'],
      ],
      desc: 'The NOVA app is the system\'s intelligence layer. It fuses sensor streams from the vest and watch using a proprietary neural network, classifies the tri-state model in real time, delivers behavioral guidance in the At Risk state, and orchestrates the full emergency workflow on Fall detection.',
    },
  ];

  const p = products[tab];

  return (
    <section id="product" className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal text-center mb-14 ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-5">
            <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">The Complete System</span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-ink tracking-[-0.5px] mb-4">
            Three components. One integrated system.
          </h2>
          <p className="text-lg text-steel max-w-xl mx-auto">
            Each component is engineered independently for modular optimization, then fused by the AI layer for a complete safety picture.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center gap-2 mb-10">
          {products.map((pr, i) => (
            <button key={pr.name} onClick={() => setTab(i)}
              className={`text-sm font-semibold px-5 py-2.5 rounded-full border transition-all ${
                tab === i ? 'bg-ink text-on-dark border-ink' : 'bg-white border-hairline text-steel hover:text-ink hover:border-ink/25'
              }`}
            >
              {pr.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-white rounded-[20px] border border-hairline p-8 md:p-12 shadow-sm">
          {/* Media */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[360px] aspect-square rounded-2xl overflow-hidden bg-surface-soft border border-hairline">
              {p.video ? (
                <>
                  <video key={p.video} autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={p.video} type="video/mp4" />
                  </video>
                  {/* scan line */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-green/50 to-transparent animate-scan" />
                  </div>
                </>
              ) : (
                <Image src={p.still} alt={p.name} fill className="object-contain p-6" />
              )}

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${p.tagBg}`}>
                  {p.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-medium text-ink mb-3">{p.name}</h3>
            <p className="text-steel leading-relaxed text-[0.95rem] mb-8">{p.desc}</p>

            {/* Spec table */}
            <div className="rounded-xl border border-hairline overflow-hidden">
              <div className="bg-surface-soft px-4 py-2.5 border-b border-hairline">
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone">Technical Specifications</span>
              </div>
              <div className="divide-y divide-hairline">
                {p.specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] px-4 py-2.5">
                    <span className="text-xs font-semibold text-stone uppercase tracking-wide">{k}</span>
                    <span className="text-sm text-charcoal">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FULL PRODUCT PHOTO ───────────────────────────────────────────────────────

function ProductInUseSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-0 bg-white overflow-hidden">
      <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal grid lg:grid-cols-2 min-h-[560px] ${visible ? 'visible' : ''}`}>
        {/* Image */}
        <div className="relative min-h-[400px] lg:min-h-0">
          <Image
            src="/images/full_product_use.png"
            alt="Person wearing the full NOVA system"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:to-white hidden lg:block" />
        </div>

        {/* Text */}
        <div className="flex items-center bg-white px-10 py-16 lg:px-16">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">Real-World Ready</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-ink tracking-[-0.5px] mb-5 leading-snug">
              Designed for daily life, not just lab conditions.
            </h2>
            <p className="text-steel leading-relaxed mb-8">
              NOVA is engineered for real deployment conditions — where sensor streams differ in sampling rates, connectivity may drop, and data can arrive late or incomplete. The system incorporates timestamp alignment, window-based aggregation, and missingness-aware inference so it doesn&apos;t degrade when moving from curated data to real streaming data.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Modular hardware', 'Vest & watch optimised independently'],
                ['Edge AI', 'On-device inference, reduced cloud dependency'],
                ['Mismatch-tolerant', 'Handles dropped packets & rate differences'],
                ['Privacy-first', 'Minimal raw data leaving the user device'],
              ].map(([title, desc]) => (
                <div key={title} className="bg-surface-green rounded-xl p-4 border border-brand-green/20">
                  <div className="text-sm font-semibold text-ink mb-1">{title}</div>
                  <div className="text-xs text-steel leading-snug">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WATCH DETAIL ─────────────────────────────────────────────────────────────

function WatchDetailSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal-left ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">Biometric Context</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium text-ink tracking-[-0.5px] mb-5 leading-snug">
            Context-aware decisioning<br />reduces false positives.
          </h2>
          <p className="text-steel leading-relaxed mb-8 text-[0.95rem]">
            NOVA treats fall detection as a <strong className="text-ink">decision-quality problem</strong>, not a simple thresholding task. High-confidence motion signals from the vest are validated against watch vitals and GPS context — significantly reducing false alarms that erode user trust and long-term adoption.
          </p>
          <div className="space-y-4">
            {[
              { label: 'Motion Layer',  desc: 'Vest IMU data: acceleration, gyroscope, body orientation', color: 'bg-brand-green/10 text-brand-green-dark border-brand-green/25' },
              { label: 'Vitals Layer',  desc: 'Watch: heart rate spike, SpO₂ drop, stress anomalies',     color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/25' },
              { label: 'Context Layer', desc: 'GPS location, time of day, prior risk-state history',       color: 'bg-accent-purple/10 text-accent-purple border-accent-purple/25' },
              { label: 'AI Decision',   desc: 'Multi-layer fusion → Normal / At Risk / Fall classification', color: 'bg-ink/5 text-ink border-hairline' },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-start gap-3 p-4 rounded-xl border ${row.color}`}>
                <div className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{row.label}</div>
                  <div className="text-xs opacity-80">{row.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`reveal-right flex justify-center ${visible ? 'visible' : ''}`}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-green/15 via-brand-green/5 to-transparent blur-2xl" />
            <div className="relative w-[280px] sm:w-[340px] animate-float-b">
              <Image
                src="/images/watch_detail.png"
                alt="NOVA Smart Companion Watch — detail view"
                width={340}
                height={420}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── INNOVATION PILLARS ────────────────────────────────────────────────────────

function TechSection() {
  const { ref, visible } = useReveal();

  const pillars = [
    {
      letter: 'A',
      title:  'Trust Engineering via Context-Aware Decisioning',
      color:  'text-brand-green bg-brand-green/10 border-brand-green/25',
      dot:    'bg-brand-green',
      desc:   'Multi-layer validation (motion + vitals + GPS) dramatically reduces false positives — the #1 reason users abandon wearables. Better decisions build long-term trust and retention.',
    },
    {
      letter: 'B',
      title:  'Prevention-First Product Logic',
      color:  'text-amber-700 bg-amber-400/10 border-amber-400/25',
      dot:    'bg-amber-400',
      desc:   'The "At Risk" state delivers value before accidents occur. Early warnings, behavioral guidance, and institutional escalation workflows make NOVA useful every day — not just in emergencies.',
    },
    {
      letter: 'C',
      title:  'Real-Deployment Multi-Rate Fusion',
      color:  'text-accent-blue bg-accent-blue/10 border-accent-blue/25',
      dot:    'bg-accent-blue',
      desc:   'Timestamp alignment, window-based aggregation, resampling/interpolation, and missingness-aware inference ensure NOVA performs in real streaming conditions — not just curated datasets.',
    },
    {
      letter: 'D',
      title:  'Edge-Friendly AI Strategy',
      color:  'text-accent-purple bg-accent-purple/10 border-accent-purple/25',
      dot:    'bg-accent-purple',
      desc:   'Mobile-first inference reduces latency, cloud dependency, operational cost, and data privacy risk. Supports a flexible growth path from lightweight pilots to hybrid edge–cloud architectures.',
    },
    {
      letter: 'E',
      title:  'Mass Production Readiness',
      color:  'text-brand-green-mid bg-brand-green-mid/10 border-brand-green-mid/25',
      dot:    'bg-brand-green-mid',
      desc:   'Modular hardware design, BOM-optimised components, app-centred deployment, and multi-channel go-to-market (B2C, B2B, institutional) enable NOVA to scale from prototype to mass rollout.',
    },
  ];

  return (
    <section id="technology" className="py-28 bg-brand-teal-deep relative overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal text-center mb-16 ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-1.5 mb-5">
            <span className="text-brand-green text-[10px] font-bold tracking-[1.2px] uppercase">Innovation Pillars</span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-on-dark tracking-[-0.5px] mb-4">
            Five pillars that make NOVA<br />
            <span className="gradient-text-green">deployable at scale.</span>
          </h2>
          <p className="text-on-dark-muted text-lg max-w-2xl mx-auto">
            Solving the "scaling problem" in wearables requires more than a good model — it requires a system that people trust, can use effortlessly, and that can be manufactured and deployed affordably.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <PillarCard key={p.letter} pillar={p} delay={i * 100} />
          ))}
          {/* Span last card full width on 3-col if only 5 pillars */}
          <div className="sm:col-span-2 lg:col-span-3 grid lg:grid-cols-3 gap-5 contents" />
        </div>

        {/* Roadmap strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { phase: 'Phase 1', label: 'Ideation',   active: false,  done: true },
            { phase: 'Phase 2', label: 'Prototype',  active: true, done: false },
            { phase: 'Phase 3', label: 'Pilot',      active: false, done: false },
            { phase: 'Phase 4', label: 'Mass Rollout', active: false, done: false },
          ].map((ph) => (
            <div key={ph.phase} className={`rounded-xl p-4 border text-center transition-all ${
              ph.active ? 'bg-brand-green/15 border-brand-green/40 glass-green' : 'glass-dark border-white/8'
            }`}>
              <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${ph.active ? 'text-brand-green' : 'text-on-dark-muted'}`}>
                {ph.phase}
              </div>
              <div className={`text-sm font-medium ${ph.active ? 'text-on-dark' : 'text-on-dark-muted'}`}>
                {ph.label}
              </div>
              {ph.active && (
                <div className="mt-2 text-[10px] text-brand-green font-semibold flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  Current
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, delay }: { pillar: { letter: string; title: string; color: string; dot: string; desc: string }; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift bg-canvas-dark rounded-[16px] p-7 border border-white/8 ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center border text-base font-bold mb-5 ${pillar.color}`}>
        {pillar.letter}
      </div>
      <h3 className="text-base font-semibold text-on-dark mb-3 leading-snug">{pillar.title}</h3>
      <p className="text-sm text-on-dark-muted leading-relaxed">{pillar.desc}</p>
    </div>
  );
}

// ─── MARKETS ──────────────────────────────────────────────────────────────────

function MarketsSection() {
  const { ref, visible } = useReveal();

  const markets = [
    {
      icon: '🏠',
      title: 'Consumer (B2C)',
      tag: 'Primary Market',
      tagBg: 'bg-brand-green text-on-primary',
      desc: 'Individuals aged 60+ and their families seeking independent living safety. Direct-to-consumer hardware + subscription model.',
      points: ['Home & active lifestyle use', 'Family-managed caregiver portal', 'Monthly or annual subscription', 'Free shipping + 30-day trial'],
      border: 'border-brand-green/30',
      bg: 'hover:bg-brand-green-soft',
    },
    {
      icon: '🏢',
      title: 'Enterprise (B2B)',
      tag: 'Growth Market',
      tagBg: 'bg-accent-blue text-white',
      desc: 'Workplaces, campuses, and construction sites where fall risk is an occupational liability. Institutional deployment with safety officer workflows.',
      points: ['Safety officer escalation rules', 'Bulk device management dashboard', 'Custom alert workflows', 'Compliance & incident logging'],
      border: 'border-accent-blue/30',
      bg: 'hover:bg-accent-blue/5',
    },
    {
      icon: '🏥',
      title: 'Institutional',
      tag: 'Future Market',
      tagBg: 'bg-accent-purple text-white',
      desc: 'Aged care facilities, rehabilitation centres, and hospital discharge programs. Requires regulatory clearance and deeper integration with care workflows.',
      points: ['Aged care & rehab integration', 'Clinical-grade incident logging', 'EMR/EHR data compatibility', 'HIPAA + regulatory compliance'],
      border: 'border-accent-purple/30',
      bg: 'hover:bg-accent-purple/5',
    },
  ];

  return (
    <section id="markets" className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal text-center mb-14 ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-5">
            <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">Target Markets</span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-ink tracking-[-0.5px] mb-4">
            Built to scale across three channels.
          </h2>
          <p className="text-lg text-steel max-w-xl mx-auto">
            Multi-channel go-to-market enables NOVA to grow from consumer pilots to institutional deployments without re-engineering the core product.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {markets.map((m, i) => (
            <MarketCard key={m.title} market={m} delay={i * 130} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketCard({ market, delay }: { market: { icon: string; title: string; tag: string; tagBg: string; desc: string; points: string[]; border: string; bg: string }; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift bg-white rounded-[16px] border ${market.border} p-8 transition-colors ${market.bg} ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-5">{market.icon}</div>
      <div className="mb-3">
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${market.tagBg}`}>
          {market.tag}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-ink mb-3">{market.title}</h3>
      <p className="text-sm text-steel leading-relaxed mb-6">{market.desc}</p>
      <ul className="space-y-2">
        {market.points.map(pt => (
          <li key={pt} className="flex items-start gap-2 text-sm text-charcoal">
            <Chk cls="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatsSection() {
  const { ref, visible } = useReveal();

  const stats = [
    { val: 684,  suf: 'K',  label: 'Annual fall-related deaths (WHO)',  note: 'worldwide' },
    { val: 37,   suf: 'M+', label: 'Serious fall injuries per year',    note: 'worldwide' },
    { val: 537,  suf: 'M',  label: 'Wearable shipments forecast (2024)',note: 'IDC report' },
    { val: 998,  suf: '%',  label: 'Detection accuracy target',         note: '= 99.8%', dec: true },
  ];

  return (
    <section className="py-20 bg-brand-teal-deep border-y border-hairline-dark">
      <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => {
          const count = useCount(s.val, visible);
          return (
            <div key={s.label} className={`reveal ${visible ? 'visible' : ''} d-${(i + 1) * 100}`} style={{ transitionDelay: `${i * 180}ms` }}>
              <div className="text-4xl md:text-5xl font-medium text-on-dark tracking-[-1.5px] mb-1">
                {s.dec ? (count / 10).toFixed(1) : count.toLocaleString()}
                <span className="text-brand-green">{s.suf}</span>
              </div>
              <div className="text-sm text-on-dark-muted mb-0.5">{s.label}</div>
              <div className="text-[11px] text-stone italic">{s.note}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── WAITLIST / CTA ───────────────────────────────────────────────────────────

function WaitlistSection() {
  const { ref, visible } = useReveal();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal max-w-2xl mx-auto text-center ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-brand-green-pale rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-green-dark text-[10px] font-bold tracking-[1.2px] uppercase">Early Access</span>
          </div>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-ink tracking-[-0.5px] mb-4">
            Be first to protect<br />
            <span className="gradient-text-green">what matters most.</span>
          </h2>
          <p className="text-steel text-lg leading-relaxed mb-10">
            NOVA is currently in active development. Join the waitlist for early access, pilot opportunities, and product updates.
          </p>

          {submitted ? (
            <div className="bg-brand-green-soft border border-brand-green/30 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
                <Chk cls="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">You&apos;re on the list!</h3>
              <p className="text-steel text-sm">We&apos;ll reach out as we move toward pilot phase. Thank you for your interest in NOVA.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-surface-green rounded-2xl border border-brand-green/20 p-8 text-left">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wide">Email address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-4 text-sm text-ink bg-white border border-hairline rounded-lg outline-none focus:border-brand-green-dark focus:ring-2 focus:ring-brand-green/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wide">I am a…</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full h-11 px-4 text-sm text-ink bg-white border border-hairline rounded-lg outline-none focus:border-brand-green-dark focus:ring-2 focus:ring-brand-green/20 transition-all appearance-none"
                  >
                    <option value="">Select role</option>
                    <option value="individual">Individual / Family</option>
                    <option value="caregiver">Caregiver / Healthcare</option>
                    <option value="enterprise">Workplace / Enterprise</option>
                    <option value="investor">Investor</option>
                    <option value="researcher">Researcher</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full bg-brand-green text-on-primary font-semibold text-sm py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all"
              >
                Join the Waitlist
              </button>
              <p className="text-center text-xs text-stone mt-4">No spam. Unsubscribe at any time.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { head: 'Product',  links: ['Guardian Vest', 'Smart Watch', 'NOVA App', 'How It Works', 'Technology'] },
    { head: 'Company',  links: ['About', 'Research', 'Careers', 'Press', 'Contact'] },
    { head: 'Support',  links: ['Help Center', 'Setup Guide', 'FAQ', 'Community'] },
    { head: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'HIPAA Notice', 'Cookie Policy'] },
  ];
  return (
    <footer className="bg-brand-teal-deep border-t border-hairline-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/nova_logo_white.png"
              alt="NOVA"
              width={150}
              height={60}
              className="object-contain mb-4"
            />
            <p className="text-sm text-on-dark-muted leading-relaxed mb-6">
              AI-powered fall detection for independent living. Currently in development — join the waitlist.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-brand-green/15 border border-brand-green/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-[10px] font-bold uppercase tracking-wide">Development Phase</span>
            </div>
          </div>
          {/* Link cols */}
          {cols.map(c => (
            <div key={c.head}>
              <h4 className="text-on-dark text-[10px] font-bold tracking-widest uppercase mb-4">{c.head}</h4>
              <ul className="space-y-2.5">
                {c.links.map(l => (
                  <li key={l}><a href="#" className="text-on-dark-muted text-sm hover:text-on-dark transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-hairline-dark pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-on-dark-muted text-sm">© {new Date().getFullYear()} NOVA. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['HIPAA Compliant', 'Edge AI Inference', 'FDA Pathway Planned'].map(b => (
              <span key={b} className="flex items-center gap-1.5 text-on-dark-muted text-xs">
                <Chk cls="w-3.5 h-3.5 text-brand-green" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Navbar />
      <Hero />
      <ThreeStateSection />
      <ProductSection />
      <ProductInUseSection />
      <WatchDetailSection />
      <TechSection />
      <MarketsSection />
      <StatsSection />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
