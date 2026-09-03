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

// ─── ICONS ────────────────────────────────────────────────────────────────────

const Chk = ({ cls = '' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowDown = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v14m0 0l-5-5m5 5l5-5" />
  </svg>
);

const ArrowRight = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-5-5m5 5l-5 5" />
  </svg>
);

// Minimal line-icon set for data-source / signal chips — deliberately generic
// (no medical crosses, no heart glyphs) per NOVA's device-agnostic positioning.
type IconType = 'watch' | 'phone' | 'motion' | 'signal' | 'location' | 'history' | 'api' | 'sensor';

function MiniIcon({ type, cls = 'w-5 h-5' }: { type: IconType; cls?: string }) {
  const inner: Record<IconType, React.ReactNode> = {
    watch: (
      <>
        <rect x="7" y="6" width="10" height="12" rx="2.5" />
        <path d="M9.2 6V4.2h5.6V6M9.2 20v-2h5.6v2" />
      </>
    ),
    phone: <rect x="7.5" y="3" width="9" height="18" rx="2" />,
    motion: <path d="M3 12h3.5l1.8-6.5L12 18.5l1.7-5.5H21" />,
    signal: <path d="M3 15l3.5-4 3 3 4.5-7.5 3 4 4-2.5" />,
    location: (
      <>
        <path d="M12 21s7-6.3 7-11.3A7 7 0 105 9.7C5 14.7 12 21 12 21z" />
        <circle cx="12" cy="9.6" r="2.15" />
      </>
    ),
    history: (
      <>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    api: (
      <>
        <circle cx="5" cy="12" r="2" />
        <circle cx="18.5" cy="6" r="2" />
        <circle cx="18.5" cy="18" r="2" />
        <path d="M7 12h3.2m0 0l6.3-4.7M10.2 12l6.3 4.7" />
      </>
    ),
    sensor: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2.5" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      </>
    ),
  };
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {inner[type]}
    </svg>
  );
}

// ─── SHARED SECTION PRIMITIVES ────────────────────────────────────────────────

function Eyebrow({ children, on = 'light' }: { children: React.ReactNode; on?: 'light' | 'dark' }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 ${on === 'dark' ? 'glass-green' : 'bg-brand-green-pale'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${on === 'dark' ? 'bg-brand-green' : 'bg-brand-green-dark'}`} />
      <span className={`text-[10px] font-bold tracking-[1.2px] uppercase ${on === 'dark' ? 'text-brand-green' : 'text-brand-green-dark'}`}>
        {children}
      </span>
    </div>
  );
}

function SectionHead({
  eyebrow, title, sub, on = 'light', width = 'max-w-2xl',
}: {
  eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; on?: 'light' | 'dark'; width?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} ${width} mx-auto text-center mb-14`}>
      <Eyebrow on={on}>{eyebrow}</Eyebrow>
      <h2 className={`text-4xl md:text-[2.6rem] font-medium tracking-[-0.5px] mb-4 leading-tight ${on === 'dark' ? 'text-on-dark' : 'text-ink'}`}>
        {title}
      </h2>
      {sub && <p className={`text-lg leading-relaxed ${on === 'dark' ? 'text-on-dark-muted' : 'text-steel'}`}>{sub}</p>}
    </div>
  );
}

// Letter-in-box pillar card — reused across Problem / Technology / Why NOVA / Privacy
function PillarCard({
  mark, title, desc, color, on = 'light', delay = 0,
}: {
  mark: string; title: string; desc: string; color: string; on?: 'light' | 'dark'; delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift rounded-[16px] p-7 border ${visible ? 'visible' : ''} ${
        on === 'dark' ? 'bg-canvas-dark border-white/8' : 'bg-white border-hairline'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center border text-base font-bold mb-5 ${color}`}>
        {mark}
      </div>
      <h3 className={`text-base font-semibold mb-3 leading-snug ${on === 'dark' ? 'text-on-dark' : 'text-ink'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${on === 'dark' ? 'text-on-dark-muted' : 'text-steel'}`}>{desc}</p>
    </div>
  );
}

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
    { label: 'Product',    href: '#product' },
    { label: 'Ecosystem',  href: '#ecosystem' },
    { label: 'Technology', href: '#technology' },
    { label: 'Use Cases',  href: '#use-cases' },
    { label: 'Research',   href: '#research' },
    { label: 'Company',    href: '#company' },
  ];

  return (
    <>
      {/* Promo strip */}
      <div className="fixed top-0 inset-x-0 z-50 bg-brand-teal-deep text-center py-2 px-4">
        <p className="text-xs text-on-dark-muted">
          <span className="text-brand-green font-semibold">NOVA</span>
          {' '}— Human Risk Intelligence Platform · Building in development ·{' '}
          <a href="#partner" className="text-brand-green underline underline-offset-2 font-medium">
            Partner With NOVA →
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
              width={130}
              height={57}
              className={`object-contain h-auto transition-all ${scrolled ? '' : 'brightness-0 invert'}`}
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-steel hover:text-ink' : 'text-white/75 hover:text-white'
                }`}
              >{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#platform"
              className={`hidden lg:inline-block font-medium text-sm px-5 py-2.5 rounded-full border transition-all ${
                scrolled ? 'border-hairline text-steel hover:border-ink/30 hover:text-ink' : 'border-white/25 text-white hover:border-white/50'
              }`}
            >
              Explore the Platform
            </a>
            <a href="#partner"
              className="hidden md:inline-block bg-brand-green text-on-primary font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 active:scale-95 transition-all"
            >
              Partner With NOVA
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
            <a href="#platform" onClick={() => setOpen(false)} className="border border-hairline text-ink font-medium text-sm text-center py-3 rounded-full">
              Explore the Platform
            </a>
            <a href="#partner" onClick={() => setOpen(false)} className="bg-brand-green text-on-primary font-semibold text-sm text-center py-3 rounded-full">
              Partner With NOVA
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

  const inputs: { label: string; type: IconType }[] = [
    { label: 'Wearable Data', type: 'sensor' },
    { label: 'Motion',        type: 'motion' },
    { label: 'Vitals',        type: 'signal' },
    { label: 'Location',      type: 'location' },
    { label: 'History',       type: 'history' },
  ];

  const outputs = [
    { label: 'Normal',         dot: 'bg-brand-green' },
    { label: 'Elevated Risk',  dot: 'bg-amber-400' },
    { label: 'Critical Event', dot: 'bg-red-400' },
  ];

  return (
    <section className="relative min-h-screen bg-brand-teal-deep flex items-center overflow-hidden pt-16">
      {/* Atmospheric orbs — restrained, single section only */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[15%] left-[8%]  w-[520px] h-[520px] rounded-full bg-brand-green/6  blur-[110px] animate-orb1" />
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-brand-green-mid/8 blur-[90px]  animate-orb2" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center w-full">
        {/* TEXT SIDE */}
        <div>
          <div className={`inline-flex items-center gap-2 glass-green rounded-full px-4 py-1.5 mb-8 ${delay()}`}
               style={{ transitionDelay: '0ms' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green text-[10px] font-bold tracking-[1.2px] uppercase">
              NOVA Intelligence
            </span>
          </div>

          <h1 className={`text-[clamp(2.6rem,5vw,4rem)] font-medium text-white leading-[1.1] tracking-[-1.5px] mb-5 ${delay()}`}
              style={{ transitionDelay: '100ms' }}>
            Human risk intelligence<br />
            <span className="gradient-text-green">for a safer world.</span>
          </h1>

          <p className={`text-[1.05rem] text-on-dark-muted leading-relaxed max-w-[500px] mb-10 ${delay()}`}
             style={{ transitionDelay: '200ms' }}>
            NOVA Intelligence connects continuous human data with caregivers, families, care organizations, and risk partners — turning changing risk into coordinated action.
          </p>

          <div className={`flex flex-col sm:flex-row gap-3 mb-12 ${delay()}`} style={{ transitionDelay: '300ms' }}>
            <a href="#platform"
              className="group bg-brand-green text-on-primary font-semibold text-sm px-7 py-4 rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              Explore NOVA Intelligence
              <ArrowRight cls="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#partner"
              className="border border-white/25 text-white font-medium text-sm px-7 py-4 rounded-full hover:border-white/50 hover:bg-white/5 transition-all text-center"
            >
              Partner With NOVA
            </a>
          </div>

          <div className={`flex flex-wrap gap-x-6 gap-y-2 ${delay()}`} style={{ transitionDelay: '400ms' }}>
            {['Multimodal signal fusion', 'Device-agnostic by design', 'Longitudinal risk modeling', 'Privacy-aware architecture'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-on-dark-muted text-xs">
                <Chk cls="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* INTELLIGENCE ENGINE VISUAL */}
        <div className={`flex justify-center ${delay()}`} style={{ transitionDelay: '300ms' }}>
          <div className="relative w-full max-w-[420px] rounded-3xl glass-dark border border-brand-green/20 p-6">
            <div className="text-center text-[10px] font-bold tracking-widest uppercase text-on-dark-muted mb-4">
              Input Signals
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {inputs.map(i => (
                <div key={i.label} className="flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3">
                  <MiniIcon type={i.type} cls="w-4 h-4 text-brand-green" />
                  <span className="text-[8.5px] text-on-dark-muted text-center leading-tight px-0.5">{i.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center text-brand-green/60 mb-4">
              <ArrowDown />
            </div>

            <div className="relative rounded-2xl bg-brand-green/10 border border-brand-green/30 py-5 text-center mb-4 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="relative">
                <div className="text-brand-green font-bold text-sm tracking-wide">NOVA INTELLIGENCE</div>
                <div className="text-on-dark-muted text-[10px] mt-1">baseline → deviation → risk change</div>
              </div>
            </div>

            <div className="flex justify-center text-brand-green/60 mb-4">
              <ArrowDown />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {outputs.map(o => (
                <div key={o.label} className="flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-3">
                  <span className={`w-2 h-2 rounded-full ${o.dot} animate-state`} />
                  <span className="text-[9px] font-semibold text-on-dark text-center leading-tight px-0.5">{o.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    { mark: '01', title: 'Fragmented Data',      desc: 'Signals live across disconnected devices and systems, captured by different tools that rarely talk to one another.' },
    { mark: '02', title: 'Reactive Monitoring',  desc: 'Most systems respond after a predefined threshold or an incident — not before one, when intervention still matters most.' },
    { mark: '03', title: 'Limited Context',      desc: 'A single measurement rarely explains whether someone’s overall risk is actually changing over time.' },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="The Problem"
          title="Human data is continuous. Risk management isn't."
          sub={
            <>Wearables capture physiology. Phones capture movement and context. Care systems maintain historical information. Incidents generate additional data — but these signals often remain isolated, so organizations end up responding to individual alerts rather than understanding how risk is evolving.</>
          }
          width="max-w-3xl"
        />
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {problems.map((p, i) => (
            <PillarCard key={p.mark} mark={p.mark} title={p.title} desc={p.desc}
              color="text-brand-green-dark bg-brand-green/10 border-brand-green/25" delay={i * 100} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-hairline bg-surface-soft p-8 text-center">
          <div className="text-4xl md:text-5xl font-medium text-ink tracking-[-1.5px] mb-2">
            684,000<span className="text-brand-green">+</span>
          </div>
          <p className="text-sm text-steel leading-relaxed max-w-xl mx-auto">
            People die from falls globally each year, and older adults are the most affected group — one of several risk categories where earlier understanding of individual change could alter outcomes.
          </p>
          <p className="text-[11px] text-stone mt-3">Source: World Health Organization — Falls Fact Sheet</p>
        </div>
      </div>
    </section>
  );
}

// ─── PLATFORM ARCHITECTURE ─────────────────────────────────────────────────────

function PlatformSection() {
  const cols: { head: string; items: string[]; icon: IconType }[] = [
    { head: 'Data Sources', icon: 'sensor', items: ['Wearables', 'Smartphones', 'Motion', 'Vitals', 'Location', 'Historical events', 'Connected systems'] },
    { head: 'NOVA Intelligence', icon: 'api', items: ['Personal baseline', 'Multimodal data fusion', 'Temporal analysis', 'Risk modeling', 'Event intelligence'] },
    { head: 'Output', icon: 'signal', items: ['Risk state', 'Risk trends', 'Alerts', 'Historical intelligence', 'Institutional dashboard', 'API / integrations'] },
  ];

  return (
    <section id="platform" className="py-28 bg-brand-teal-deep relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead
          on="dark"
          eyebrow="The Platform"
          title="From monitoring to understanding."
          sub="NOVA Intelligence is a Human Risk Intelligence Platform designed to transform fragmented signals into an evolving understanding of individual risk."
          width="max-w-2xl"
        />

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-5">
          {cols.map((c, ci) => (
            <div key={c.head} className="flex flex-col lg:flex-row lg:items-stretch lg:flex-1 gap-5">
              <div className={`rounded-2xl p-6 border flex-1 ${ci === 1 ? 'bg-brand-green/10 border-brand-green/30' : 'glass-dark border-white/8'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <MiniIcon type={c.icon} cls={`w-4 h-4 ${ci === 1 ? 'text-brand-green' : 'text-on-dark-muted'}`} />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${ci === 1 ? 'text-brand-green' : 'text-on-dark-muted'}`}>{c.head}</span>
                </div>
                <ul className="space-y-2.5">
                  {c.items.map(it => (
                    <li key={it} className="flex items-center gap-2 text-sm text-on-dark">
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${ci === 1 ? 'bg-brand-green' : 'bg-white/30'}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              {ci < cols.length - 1 && (
                <div className="flex items-center justify-center text-brand-green/50 flex-shrink-0">
                  <ArrowDown cls="w-4 h-4 lg:hidden" />
                  <ArrowRight cls="w-4 h-4 hidden lg:block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── ECOSYSTEM (SIGNATURE VISUAL) ──────────────────────────────────────────────

function EcosystemSection() {
  const { ref, visible } = useReveal();
  const inputs = ['Movement', 'Activity', 'Vitals', 'Location', 'Wearable signals', 'Historical events', 'Behavioral changes', 'Incident history'];

  const node = (label: string, sub: string, tone: string) => (
    <div className={`rounded-2xl border p-5 text-center ${tone}`}>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-[11px] leading-snug opacity-75">{sub}</div>
    </div>
  );

  return (
    <section id="ecosystem" className="py-28 bg-brand-teal-deep relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead
          on="dark"
          eyebrow="The Ecosystem"
          title={<>One person. <span className="gradient-text-green">Multiple layers of value.</span></>}
          sub="NOVA Intelligence transforms continuous signals into different forms of actionable intelligence for the people and organizations responsible for safety, care, and risk."
          width="max-w-3xl"
        />

        {/* Input signals */}
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''}`}>
          <div className="text-center text-[10px] font-bold tracking-widest uppercase text-on-dark-muted mb-4">Continuous inputs</div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {inputs.map(i => (
              <span key={i} className="text-xs text-on-dark bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">{i}</span>
            ))}
          </div>

          {/* Ecosystem grid */}
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            {/* left column */}
            <div className="flex flex-col justify-center gap-5">
              {node('Caregiver', 'Wearable alerts & escalation', 'glass-dark border-white/10 text-on-dark')}
              {node('The Individual', 'Continuous risk understanding', 'glass-dark border-white/10 text-on-dark')}
            </div>

            {/* center node */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-brand-green/50 text-[10px] font-bold tracking-widest uppercase">
                <span className="h-px w-8 bg-brand-green/30" />flows into<span className="h-px w-8 bg-brand-green/30" />
              </div>
              <div className="relative w-full rounded-3xl bg-brand-green/10 border border-brand-green/30 p-8 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-brand-green text-[10px] font-bold tracking-widest uppercase">Intelligence layer</span>
                  </div>
                  <div className="text-xl font-semibold text-on-dark mb-2">NOVA Intelligence</div>
                  <div className="text-xs text-on-dark-muted leading-relaxed">
                    Personal baselines · multimodal fusion · temporal analysis · risk modeling · event intelligence
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-brand-green/50 text-[10px] font-bold tracking-widest uppercase">
                <span className="h-px w-8 bg-brand-green/30" />becomes action for<span className="h-px w-8 bg-brand-green/30" />
              </div>
            </div>

            {/* right column */}
            <div className="flex flex-col justify-center gap-5">
              {node('Family', 'Agentic AI access & summaries', 'glass-dark border-white/10 text-on-dark')}
              {node('Care Organization', 'Population risk intelligence', 'glass-dark border-white/10 text-on-dark')}
              {node('Insurance / Risk Partner', 'Scalable prevention programs', 'glass-dark border-white/10 text-on-dark')}
            </div>
          </div>

          <p className="text-center text-on-dark text-base md:text-lg font-medium mt-12 max-w-2xl mx-auto leading-relaxed">
            NOVA Intelligence starts with the individual, but its value <span className="gradient-text-green">compounds across the care ecosystem.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── STAKEHOLDERS ──────────────────────────────────────────────────────────────

function StakeholderBlock({
  n, who, title, body, children, delay = 0,
}: {
  n: string; who: string; title: string; body: string; children: React.ReactNode; delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${visible ? 'visible' : ''} grid lg:grid-cols-2 gap-10 items-center py-14 border-t border-hairline first:border-t-0`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center bg-brand-green/10 border border-brand-green/25 text-brand-green-dark text-xs font-bold">{n}</span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark">{who}</span>
        </div>
        <h3 className="text-2xl font-medium text-ink tracking-[-0.3px] mb-4 leading-snug">{title}</h3>
        <p className="text-steel text-[0.95rem] leading-relaxed">{body}</p>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

function StakeholdersSection() {
  const states = [
    { label: 'Baseline', dot: 'bg-brand-green' },
    { label: 'Change', dot: 'bg-brand-green-mid' },
    { label: 'Elevated Risk', dot: 'bg-amber-400' },
    { label: 'Event', dot: 'bg-red-400' },
    { label: 'Recovery', dot: 'bg-amber-400' },
    { label: 'New Baseline', dot: 'bg-brand-green' },
  ];

  const caregiverFlow = [
    'NOVA Intelligence identifies elevated risk or a critical event',
    'The assigned caregiver’s wearable vibrates',
    'A short, prioritized alert appears',
    'Tapping it opens resident, location, risk state, event type, last activity, and recommended next action',
  ];

  const chat = [
    { from: 'family', text: 'How has my mother been this week?' },
    { from: 'nova',   text: 'This week her overall risk remained stable. Activity was slightly lower on Tuesday and Wednesday, but no critical events were detected.' },
    { from: 'family', text: 'Has her mobility changed recently?' },
    { from: 'nova',   text: 'Her mobility pattern has changed over the past three days, and NOVA classified her current state as Elevated Risk. Her caregiver team has been notified.' },
  ];

  const orgQuestions = [
    'Who is becoming higher risk?',
    'Which residents require more attention today?',
    'Which intervention appears to reduce incidents?',
    'Are there recurring patterns across a facility?',
    'How is population risk changing over time?',
  ];

  const dist = [
    { label: 'Normal', pct: 78, color: 'bg-brand-green' },
    { label: 'Elevated Risk', pct: 17, color: 'bg-amber-400' },
    { label: 'High Priority', pct: 5, color: 'bg-red-400' },
  ];

  const insurerFlow = [
    ['Insurance partner', 'Prevention program sponsor'],
    ['10,000 enrolled members', 'Consent-based participation'],
    ['NOVA Intelligence', 'Risk identification & stratification'],
    ['Targeted intervention', 'Preventive outreach & engagement'],
    ['Outcome monitoring', 'Aggregated program analytics'],
  ];

  return (
    <section id="stakeholders" className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* 1 — INDIVIDUAL */}
        <StakeholderBlock
          n="1" who="The Individual"
          title="Continuous understanding, not just incident detection."
          body="NOVA Intelligence builds an evolving picture of individual risk by understanding personal baselines, historical events, activity patterns, physiological signals, and meaningful changes over time. A fall is one possible critical event — not the whole picture."
        >
          <div className="w-full max-w-sm rounded-2xl border border-hairline bg-surface-soft p-6">
            <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-5">Risk trajectory over time</div>
            <div className="space-y-3">
              {states.map((st, i) => (
                <div key={st.label} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dot}`} />
                  <span className="text-sm text-charcoal flex-1">{st.label}</span>
                  {i < states.length - 1 && <span className="text-stone text-xs">↓</span>}
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-hairline flex gap-1.5 flex-wrap">
              {['Normal', 'Elevated Risk', 'Critical Event'].map((l, i) => (
                <span key={l} className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border ${
                  i === 0 ? 'state-normal' : i === 1 ? 'state-risk' : 'state-fall'
                }`}>{l}</span>
              ))}
            </div>
          </div>
        </StakeholderBlock>

        {/* 2 — CAREGIVER */}
        <StakeholderBlock
          n="2" who="Caregiver"
          title="Turn risk into immediate action."
          body="When something important changes, the right caregiver should know immediately. NOVA can deliver prioritized alerts directly to caregiver wearables, helping teams respond without continuously watching a central dashboard."
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* smartwatch mockup */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-2.5 h-6 rounded-t-md bg-charcoal/80" />
              <div className="w-[168px] rounded-[2rem] bg-charcoal p-2.5 shadow-lg">
                <div className="rounded-[1.6rem] bg-ink px-4 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] text-white/50 font-medium">9:41</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] font-bold tracking-wide text-red-400 mb-1">CRITICAL EVENT</div>
                  <div className="text-sm font-semibold text-white leading-tight mb-2">Resident 024</div>
                  <div className="text-[10px] text-white/60 leading-snug mb-3">Hallway · 30 seconds ago</div>
                  <div className="rounded-full bg-brand-green text-on-primary text-[10px] font-bold py-1.5 text-center">View</div>
                </div>
              </div>
              <div className="w-2.5 h-6 rounded-b-md bg-charcoal/80" />
              <div className="text-[10px] text-stone mt-3">Wearable-first caregiver alert</div>
            </div>

            <ol className="space-y-3 max-w-[260px]">
              {caregiverFlow.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-steel leading-relaxed">
                  <span className="inline-flex w-5 h-5 rounded-md items-center justify-center bg-brand-green-pale text-brand-green-dark text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </StakeholderBlock>

        {/* 3 — FAMILY */}
        <StakeholderBlock
          n="3" who="Family"
          title="Understanding without interpreting raw data."
          body="Families should not have to read graphs or sensor values to know how someone is doing. An agentic AI assistant answers questions in plain language — explaining risk information, summarizing events, and describing changes over time. It does not diagnose medical conditions."
        >
          <div className="w-full max-w-sm rounded-2xl border border-hairline bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-hairline bg-surface-soft">
              <span className="w-6 h-6 rounded-full bg-brand-green/15 flex items-center justify-center text-brand-green-dark text-[10px] font-bold">N</span>
              <span className="text-xs font-semibold text-ink">NOVA Family Assistant</span>
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-stone">Permission-based</span>
            </div>
            <div className="p-4 space-y-3">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'family' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.from === 'family'
                      ? 'bg-brand-green text-on-primary rounded-br-sm'
                      : 'bg-surface-soft text-charcoal border border-hairline rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-hairline text-[10px] text-stone">
              AI-powered explanations and summaries — not medical advice or diagnosis.
            </div>
          </div>
        </StakeholderBlock>

        {/* 4 — CARE ORGANIZATION */}
        <StakeholderBlock
          n="4" who="Care Organization"
          title="From individual monitoring to population intelligence."
          body="Care organizations should not only ask who had an incident. They should be able to understand who may need attention before the next one occurs. NOVA supports risk-based care prioritization across a whole population, not just monitoring."
        >
          <div className="w-full rounded-2xl border border-hairline bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between mb-5">
              <div>
                <div className="text-2xl font-medium text-ink tracking-[-0.5px]">500</div>
                <div className="text-[11px] text-stone">Residents monitored</div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-stone">Illustrative view</span>
            </div>
            <div className="space-y-3 mb-6">
              {dist.map(d => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-charcoal font-medium">{d.label}</span>
                    <span className="text-stone">{d.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-soft overflow-hidden">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline pt-5">
              <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-3">Questions the platform is built to answer</div>
              <ul className="space-y-2">
                {orgQuestions.map(q => (
                  <li key={q} className="flex items-start gap-2 text-xs text-charcoal">
                    <Chk cls="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StakeholderBlock>

        {/* 5 — INSURANCE */}
        <StakeholderBlock
          n="5" who="Insurance / Risk Partner"
          title="From monitoring to scalable prevention."
          body="For insurers and risk partners, NOVA can provide the intelligence infrastructure for scalable prevention programs — helping organizations identify changing risk, target interventions, and measure outcomes without relying solely on post-incident claims data. The model is appropriately governed risk intelligence and prevention programs, not resale of personal data."
        >
          <div className="w-full max-w-sm space-y-2">
            {insurerFlow.map(([label, sub], i) => (
              <div key={label}>
                <div className={`rounded-xl border p-4 ${i === 2 ? 'bg-brand-green/8 border-brand-green/30' : 'bg-surface-soft border-hairline'}`}>
                  <div className={`text-sm font-semibold ${i === 2 ? 'text-brand-green-dark' : 'text-ink'}`}>{label}</div>
                  <div className="text-[11px] text-steel mt-0.5">{sub}</div>
                </div>
                {i < insurerFlow.length - 1 && (
                  <div className="flex justify-center text-stone py-1"><ArrowDown cls="w-3.5 h-3.5" /></div>
                )}
              </div>
            ))}
            <p className="text-[10px] text-stone leading-relaxed pt-3">
              Aggregated and appropriately governed insights, based on user and organizational permissions.
            </p>
          </div>
        </StakeholderBlock>

      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Connect',       desc: 'Integrate continuous signals from existing devices, applications, and connected systems.' },
    { n: '02', title: 'Understand',    desc: 'Establish individual baselines and contextualize multimodal data over time.' },
    { n: '03', title: 'Identify Change', desc: 'Detect patterns and deviations associated with meaningful changes in risk.' },
    { n: '04', title: 'Act',           desc: 'Surface risk states, trends, alerts, and historical intelligence to the organizations responsible for intervention.' },
  ];
  return (
    <section className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead eyebrow="How It Works" title="An intelligence pipeline, not a single alert." width="max-w-2xl" />
        <div className="grid md:grid-cols-4 gap-5 relative">
          {steps.map((s, i) => (
            <StepCard key={s.n} step={s} delay={i * 100} last={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, delay, last }: { step: { n: string; title: string; desc: string }; delay: number; last: boolean }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${visible ? 'visible' : ''} relative bg-white rounded-2xl border border-hairline p-6`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="text-[11px] font-bold tracking-widest text-brand-green-dark mb-3">{step.n}</div>
      <h3 className="text-lg font-semibold text-ink mb-2">{step.title}</h3>
      <p className="text-sm text-steel leading-relaxed">{step.desc}</p>
      {!last && (
        <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 text-brand-green-dark/40 z-10">
          <ArrowRight cls="w-4 h-4" />
        </div>
      )}
    </div>
  );
}


// ─── PRODUCT OVERVIEW (SOFTWARE) ───────────────────────────────────────────────

function ProductOverviewSection() {
  const { ref, visible } = useReveal();
  const screens = [
    { src: '/images/product/app-dashboard.png',   name: 'Dashboard',   desc: 'Current risk state, recent vitals, and location context at a glance.' },
    { src: '/images/product/app-predictions.jpg', name: 'Predictions', desc: 'Time windows that may need attention, with the reasoning behind them.' },
    { src: '/images/product/app-alerts.png',      name: 'Alerts',      desc: 'Prioritized alerts with acknowledge, escalate, and emergency actions.' },
    { src: '/images/product/app-activity.png',    name: 'Activity',    desc: 'Event timeline building the longitudinal record over time.' },
  ];
  return (
    <section id="product" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Product Overview"
          title="The software, in practice."
          sub="NOVA Intelligence is delivered as software: a monitoring and prioritization app for caregivers and families, and an analytics layer for organizations."
          width="max-w-2xl"
        />

        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16`}>
          {screens.map((sc, i) => (
            <div key={sc.name} className="flex flex-col items-center text-center" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="rounded-[1.5rem] border border-hairline bg-surface-soft overflow-hidden shadow-sm mb-4 w-full max-w-[240px] aspect-[10/21]">
                <Image src={sc.src} alt={`NOVA app — ${sc.name}`} width={700} height={1470} sizes="(max-width: 1024px) 45vw, 240px" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-sm font-semibold text-ink mb-1">{sc.name}</div>
              <p className="text-xs text-steel leading-relaxed max-w-[220px]">{sc.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-hairline bg-surface-soft overflow-hidden">
          <div className="px-6 md:px-8 pt-8 pb-6 max-w-3xl">
            <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark mb-3">How it comes together</div>
            <h3 className="text-xl font-medium text-ink mb-3">Individual signals in, coordinated action out.</h3>
            <p className="text-sm text-steel leading-relaxed">
              NOVA is designed to work with devices people already own, classify state into Normal, Elevated Risk, or Critical Event, and route what matters to the caregiver, the family, and the organization responsible.
            </p>
          </div>
          <Image
            src="/images/product/ecosystem-flow.jpg"
            alt="NOVA product flow: monitored individual, monitoring app, and caregiver and family notification"
            width={3000}
            height={1690}
            quality={90}
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

// ─── FROM INDIVIDUAL TO POPULATION ─────────────────────────────────────────────

function ScaleSection() {
  const { ref, visible } = useReveal();
  const steps = [
    { scale: '1 person',            label: 'Personal risk profile',            w: '20%' },
    { scale: '1 caregiver team',    label: 'Real-time prioritization',         w: '40%' },
    { scale: '1 facility',          label: 'Population risk intelligence',     w: '60%' },
    { scale: '10 facilities',       label: 'Cross-facility analytics',         w: '80%' },
    { scale: 'Insurance / network', label: 'Population prevention programs',   w: '100%' },
  ];
  return (
    <section className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Scalability"
          title="From one individual to population-level risk intelligence."
          sub="The same intelligence layer can support immediate care decisions at the individual level and broader prevention strategies at organizational scale."
          width="max-w-2xl"
        />
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} max-w-3xl mx-auto space-y-3`}>
          {steps.map((st, i) => (
            <div key={st.scale} className="bg-white rounded-2xl border border-hairline p-5">
              <div className="flex items-baseline justify-between gap-4 mb-2.5">
                <span className="text-sm font-semibold text-ink">{st.scale}</span>
                <span className="text-xs text-steel text-right">{st.label}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-soft overflow-hidden">
                <div className="h-full rounded-full bg-brand-green transition-all duration-1000"
                  style={{ width: visible ? st.w : '0%', transitionDelay: `${i * 120}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VALUE FLYWHEEL ────────────────────────────────────────────────────────────

function FlywheelSection() {
  const { ref, visible } = useReveal();
  const loop = [
    'More monitored individuals',
    'More longitudinal risk history',
    'More validated events and interventions',
    'Better population-level understanding',
    'More valuable institutional intelligence',
    'More care organizations and partners',
  ];
  return (
    <section className="py-28 bg-canvas-dark relative overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead
          on="dark"
          eyebrow="Compounding Value"
          title="Intelligence that becomes more valuable over time."
          sub="NOVA is designed to accumulate longitudinal context across normal states, risk changes, incidents, interventions, and outcomes."
          width="max-w-2xl"
        />
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10`}>
          {loop.map((l, i) => (
            <div key={l} className="glass-dark rounded-2xl border border-white/8 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-brand-green text-[10px] font-bold tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px flex-1 bg-white/10" />
                {i === loop.length - 1 && <span className="text-brand-green text-[10px] font-bold uppercase tracking-wide">loops back</span>}
              </div>
              <div className="text-sm font-medium text-on-dark leading-snug">{l}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-on-dark-muted text-sm max-w-2xl mx-auto">
          As appropriately governed longitudinal data grows, NOVA can support increasingly robust analysis, validation, and future model development.
        </p>
      </div>
    </section>
  );
}

// ─── BUSINESS MODEL ────────────────────────────────────────────────────────────

function BusinessModelSection() {
  const layers = [
    { mark: '01', title: 'Core SaaS', desc: 'NOVA Intelligence subscription, per monitored user or per organization.' },
    { mark: '02', title: 'Caregiver Workflow', desc: 'Wearable alerts, escalation paths, and risk-based care prioritization.' },
    { mark: '03', title: 'Family Access', desc: 'AI summaries, event explanations, and longitudinal insights — included, premium, or organization-sponsored.' },
    { mark: '04', title: 'Enterprise Analytics', desc: 'Population-level dashboards and institutional intelligence.' },
    { mark: '05', title: 'Insurance & Risk Programs', desc: 'Large-scale prevention programs, analytics, and engagement infrastructure.' },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Business Model"
          title="A layered model on one intelligence platform."
          sub="A single monitored individual can create multiple layers of value across the care ecosystem."
          width="max-w-2xl"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {layers.map((l, i) => (
            <PillarCard key={l.mark} mark={l.mark} title={l.title} desc={l.desc}
              color="text-brand-green-dark bg-brand-green/10 border-brand-green/25" delay={i * 80} />
          ))}
        </div>
        <p className="text-center text-[11px] text-stone">
          Pricing is not yet finalized. Commercial structure is being shaped together with early partners.
        </p>
      </div>
    </section>
  );
}

// ─── PERSONALIZED RISK INTELLIGENCE ────────────────────────────────────────────

function PersonalizedSection() {
  const { ref, visible } = useReveal();
  const factors = ['Motion changes', 'Sleep or activity patterns', 'Previous incidents', 'Vital trends', 'Mobility', 'Location / context', 'Individual history'];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Personalization"
          title="Risk is personal. Intelligence should be too."
          sub="Fixed, universal thresholds can miss individual context. NOVA Intelligence is designed around personalized baselines and longitudinal change, not one-size-fits-all cutoffs."
          width="max-w-2xl"
        />

        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} grid lg:grid-cols-2 gap-6 mb-10`}>
          {[
            { who: 'Person A', normal: '60–70 bpm', current: '82 bpm', flag: true },
            { who: 'Person B', normal: '80–90 bpm', current: '82 bpm', flag: false },
          ].map(p => (
            <div key={p.who} className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <div className="text-xs font-semibold text-stone uppercase tracking-wide mb-4">{p.who}</div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[11px] text-stone mb-1">Normal range</div>
                  <div className="text-lg font-semibold text-ink">{p.normal}</div>
                </div>
                <div>
                  <div className="text-[11px] text-stone mb-1">Current reading</div>
                  <div className={`text-lg font-semibold ${p.flag ? 'text-amber-600' : 'text-brand-green-dark'}`}>{p.current}</div>
                </div>
              </div>
              <div className={`text-xs rounded-lg px-3 py-2 ${p.flag ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-brand-green-soft text-brand-green-dark border border-brand-green/20'}`}>
                {p.flag ? 'Meaningful deviation from personal baseline' : 'Consistent with personal baseline'}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-steel text-sm max-w-xl mx-auto mb-10">
          The same reading — <strong className="text-ink">82 bpm</strong> — does not necessarily represent the same risk context for two different people.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {factors.map(f => (
            <span key={f} className="text-xs font-medium text-charcoal bg-surface-soft border border-hairline rounded-full px-3.5 py-1.5">{f}</span>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-brand-green text-on-primary text-sm font-semibold rounded-full px-5 py-2.5">
            Personal Risk Profile
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RISK STATES ───────────────────────────────────────────────────────────────

function RiskStatesSection() {
  const { ref, visible } = useReveal();
  const [activeState, setActiveState] = useState(0);

  const states = [
    {
      key: 'normal', label: 'Normal', dot: 'bg-brand-green', ring: 'ring-brand-green/40',
      bg: 'bg-[#f0fdf9]', border: 'border-brand-green/30', hdr: 'text-brand-green-dark',
      headline: "Signals remain consistent with the individual's expected baseline.",
      desc: "During the Normal state, NOVA Intelligence continuously contextualizes available multimodal signals against each individual's personal baseline. No intervention is triggered — the platform quietly refines its understanding of what “normal” looks like for that person.",
      actions: ['Continuous multimodal signal ingestion', 'Personalized baseline construction', 'Passive pattern & trend logging', 'No action required from the individual'],
    },
    {
      key: 'risk', label: 'Elevated Risk', dot: 'bg-amber-400', ring: 'ring-amber-400/40',
      bg: 'bg-amber-50', border: 'border-amber-300/50', hdr: 'text-amber-700',
      headline: 'Meaningful deviations suggest increased attention may be required.',
      desc: "The Elevated Risk state reflects NOVA Intelligence's prevention-oriented design: combinations of signals — instability, unusual inactivity, abnormal patterns — that deviate meaningfully from an individual's baseline surface here, before they escalate.",
      actions: ['Deviation & pattern-change detection', 'Configurable attention thresholds', 'Caregiver / safety-officer notifications', 'Recommended follow-up workflows (institutional)'],
    },
    {
      key: 'event', label: 'Critical Event', dot: 'bg-red-400', ring: 'ring-red-400/40',
      bg: 'bg-red-50', border: 'border-red-300/50', hdr: 'text-red-700',
      headline: 'A significant event or pattern triggers escalation.',
      desc: 'When a pattern consistent with a critical event is identified, NOVA Intelligence escalates according to configured institutional workflows and logs the full signal context for later review.',
      actions: ['Configurable escalation workflows', 'Structured incident logging with signal context', 'Example events: fall, unusual immobility, abnormal transition, physiological deviation', 'Capabilities depend on connected data sources & validated models'],
    },
  ];

  const s = states[activeState];

  return (
    <section id="risk-states" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Core Concept"
          title="A three-state operational risk model."
          sub={<>Unlike binary alert systems, NOVA introduces an <strong className="text-ink">Elevated Risk</strong> layer — the difference between reacting to events and understanding risk as it changes.</>}
          width="max-w-2xl"
        />

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
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

        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} rounded-[20px] p-8 md:p-12 border transition-all duration-500 ${s.bg} ${s.border} border`}>
          <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${s.hdr}`}>
            State {activeState + 1} of 3 — {s.label}
          </div>
          <h3 className="text-2xl font-medium text-ink mb-4 leading-snug max-w-2xl">{s.headline}</h3>
          <p className="text-steel text-[0.95rem] leading-relaxed mb-7 max-w-2xl">{s.desc}</p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {s.actions.map(a => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-charcoal">
                <Chk cls={`w-4 h-4 flex-shrink-0 mt-0.5 ${activeState === 0 ? 'text-brand-green' : activeState === 1 ? 'text-amber-500' : 'text-red-400'}`} />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-center text-xs text-stone mt-6 max-w-xl mx-auto">
          Available risk states, event types, and thresholds depend on connected data sources, institutional configuration, and validated models.
        </p>
      </div>
    </section>
  );
}

// ─── LONGITUDINAL INTELLIGENCE ─────────────────────────────────────────────────

function LongitudinalSection() {
  const { ref, visible } = useReveal();
  const stages = [
    { label: 'Baseline',       dot: 'bg-brand-green' },
    { label: 'Subtle Change',  dot: 'bg-brand-green-mid' },
    { label: 'Elevated Risk',  dot: 'bg-amber-400' },
    { label: 'Event',          dot: 'bg-red-400' },
    { label: 'Recovery / Intervention', dot: 'bg-amber-400' },
    { label: 'New Baseline',   dot: 'bg-brand-green' },
  ];
  return (
    <section className="py-28 bg-brand-teal-deep relative overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead
          on="dark"
          eyebrow="Longitudinal Intelligence"
          title="A timeline, not a snapshot."
          sub="NOVA Intelligence is designed to understand human risk over time. Historical events become context for future risk assessment — every meaningful event adds context to what happens next."
          width="max-w-2xl"
        />

        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} glass-dark rounded-2xl border border-white/8 p-8 md:p-10 mb-10`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
            {stages.map((st, i) => (
              <div key={st.label} className="flex md:flex-col items-center md:flex-1 gap-3 md:gap-2 w-full">
                <div className="flex items-center w-full md:w-auto md:flex-col">
                  {i > 0 && <div className="hidden md:block h-px flex-1 bg-white/15" />}
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${st.dot} animate-state`} />
                  {i < stages.length - 1 && <div className="hidden md:block h-px flex-1 bg-white/15" />}
                </div>
                <span className="text-xs md:text-[11px] font-medium text-on-dark md:text-center md:mt-1">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-on-dark-muted text-sm max-w-2xl mx-auto">
          NOVA aims to build a longitudinal human-risk intelligence layer that connects continuous signals, behavioral changes, incidents, interventions, and outcomes over time — designed to enable an evolving understanding of risk, not just a single point-in-time reading. This is our long-term data strategy, built toward incrementally as the platform matures.
        </p>
      </div>
    </section>
  );
}

// ─── MULTIMODAL / DEVICE-AGNOSTIC ──────────────────────────────────────────────

function MultimodalSection() {
  const cats: { label: string; type: IconType }[] = [
    { label: 'Smartwatch', type: 'watch' },
    { label: 'Smartphone', type: 'phone' },
    { label: 'Wearable Sensor', type: 'sensor' },
    { label: 'Motion / IMU', type: 'motion' },
    { label: 'Location', type: 'location' },
    { label: 'Vitals', type: 'signal' },
    { label: 'Historical Events', type: 'history' },
    { label: 'Third-Party APIs', type: 'api' },
  ];
  return (
    <section className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Device-Agnostic"
          title="Intelligence beyond a single device."
          sub="NOVA is software-first. NOVA Intelligence is designed as a device-agnostic intelligence layer, allowing organizations to build on existing hardware and data infrastructure rather than replacing it."
          width="max-w-2xl"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {cats.map((c, i) => (
            <CategoryCard key={c.label} cat={c} delay={i * 60} />
          ))}
        </div>
        <p className="text-center text-xs text-stone mb-14">+ future connected devices and APIs</p>

        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="rounded-2xl border border-hairline bg-white overflow-hidden">
            <Image
              src="/images/product/multimodal.jpg"
              alt="NOVA data sources: wearable, mobile app, home edge device, and home camera"
              width={2200}
              height={1547}
              quality={90}
              sizes="(max-width: 1024px) 100vw, 592px"
              className="w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-2xl font-medium text-ink tracking-[-0.3px] mb-4 leading-snug">
              Build on the devices people already own.
            </h3>
            <p className="text-steel text-[0.95rem] leading-relaxed mb-6">
              NOVA is designed to integrate with mainstream consumer wearables and phones, ambient sensing in the home, and existing institutional systems — so organizations do not have to standardize on new hardware to get started.
            </p>
            <div className="mb-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-3">Designed to work with</div>
              <div className="flex flex-wrap gap-2">
                {['Fitbit', 'Garmin', 'Apple Watch', 'Samsung Galaxy Watch', 'Amazfit', 'Xiaomi', 'Oura'].map(d => (
                  <span key={d} className="text-xs font-medium text-charcoal bg-white border border-hairline rounded-full px-3 py-1.5">{d}</span>
                ))}
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                'Ambient WiFi-based sensing can detect movement and gait changes without anything worn',
                'Home cameras and edge devices can contribute posture and movement context',
                'An optional NOVA companion band is available where no suitable device exists',
              ].map(t => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-steel leading-relaxed">
                  <Chk cls="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, delay }: { cat: { label: string; type: IconType }; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift ${visible ? 'visible' : ''} flex flex-col items-center gap-3 bg-white border border-hairline rounded-2xl py-7 px-3 text-center`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="w-11 h-11 rounded-xl bg-brand-green-pale flex items-center justify-center">
        <MiniIcon type={cat.type} cls="w-5 h-5 text-brand-green-dark" />
      </div>
      <span className="text-sm font-medium text-charcoal">{cat.label}</span>
    </div>
  );
}

// ─── USE CASES ─────────────────────────────────────────────────────────────────

function UseCasesSection() {
  const cases = [
    { title: 'Elderly Care', tag: 'Beachhead Market', tagBg: 'bg-brand-green text-on-primary',
      desc: 'Continuous risk understanding for aging populations across eldercare, assisted living, and home care.' },
    { title: 'Caregiver Teams', tag: 'Initial Focus', tagBg: 'bg-brand-green text-on-primary',
      desc: 'Immediate wearable alerts and risk-based prioritization so teams act on what matters first.' },
    { title: 'Family Engagement', tag: 'Initial Focus', tagBg: 'bg-brand-green text-on-primary',
      desc: 'Agentic AI access to meaningful summaries and event context, based on granted permissions.' },
    { title: 'Care Organizations', tag: 'Initial Focus', tagBg: 'bg-brand-green text-on-primary',
      desc: 'Population-level risk intelligence and intervention analytics across facilities.' },
    { title: 'Insurance & Risk Partners', tag: 'Future Scaling', tagBg: 'bg-accent-blue text-white',
      desc: 'Scalable prevention programs, engagement infrastructure, and outcome measurement.' },
    { title: 'Workplace & Human Safety', tag: 'Future Scaling', tagBg: 'bg-accent-purple text-white',
      desc: 'Longer-term applications for organizations managing distributed or higher-risk populations.' },
  ];
  return (
    <section id="use-cases" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Use Cases"
          title="Built for everyone responsible for care."
          sub="Elderly care is our beachhead market. Insurance and broader risk programs represent future scaling opportunities."
          width="max-w-2xl"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cases.map((c, i) => (
            <UseCaseCard key={c.title} useCase={c} delay={i * 100} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-brand-green/20 bg-surface-green p-8">
          <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark mb-3">Go-to-market</div>
          <h3 className="text-xl font-medium text-ink mb-3">We scale through partners.</h3>
          <p className="text-sm text-steel leading-relaxed">
            NOVA follows a partner-led <strong className="text-ink">B2B2C</strong> model: institutions — care providers, insurers, and risk organizations — deploy NOVA Intelligence to the populations they already serve. Partners gain preventive risk programs; individuals gain protection without having to assemble it themselves.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── MARKET OPPORTUNITY ────────────────────────────────────────────────────────

function MarketSection() {
  const { ref, visible } = useReveal();
  const tiers = [
    { key: 'TAM', value: '$1.9B', users: '32M people',    desc: 'Older adults in Indonesia (2023) — our initial geographic market.', w: '100%' },
    { key: 'SAM', value: '$192M', users: '3.2M people',   desc: 'Reachable through institutional and partner-led channels (~10% of TAM).', w: '62%' },
    { key: 'SOM', value: '$3M',   users: '50,000 people', desc: 'Early-stage obtainable target across initial pilot deployments.', w: '28%' },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Market"
          title="Starting where the need is most concentrated."
          sub="NOVA begins with Indonesia's aging population and expands through institutional partners into adjacent risk-sensitive markets."
          width="max-w-2xl"
        />
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? 'visible' : ''} space-y-4 max-w-3xl mx-auto`}>
          {tiers.map((t, i) => (
            <div key={t.key} className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-stone">{t.key}</span>
                  <span className="text-2xl font-medium text-ink tracking-[-0.5px]">{t.value}</span>
                </div>
                <span className="text-xs text-steel">{t.users}</span>
              </div>
              <div className="h-1.5 rounded-full bg-hairline overflow-hidden mb-3">
                <div className="h-full rounded-full bg-brand-green transition-all duration-1000"
                  style={{ width: visible ? t.w : '0%', transitionDelay: `${i * 150}ms` }} />
              </div>
              <p className="text-xs text-steel leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-stone mt-6">
          Internal estimates based on population data for Indonesia. Figures are planning targets, not realized revenue.
        </p>
      </div>
    </section>
  );
}

function UseCaseCard({ useCase, delay }: { useCase: { title: string; tag: string; tagBg: string; desc: string }; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift ${visible ? 'visible' : ''} bg-white border border-hairline rounded-[16px] p-8`}
      style={{ transitionDelay: `${delay}ms` }}>
      <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 ${useCase.tagBg}`}>{useCase.tag}</span>
      <h3 className="text-xl font-semibold text-ink mb-3">{useCase.title}</h3>
      <p className="text-sm text-steel leading-relaxed">{useCase.desc}</p>
    </div>
  );
}

// ─── TECHNOLOGY ────────────────────────────────────────────────────────────────

function TechnologySection() {
  const pillars = [
    { mark: 'A', title: 'Multimodal Data Fusion', color: 'text-brand-green bg-brand-green/10 border-brand-green/25',
      desc: 'Combine signals from different devices and data sources into a single, coherent picture of risk.' },
    { mark: 'B', title: 'Personalized Baselines', color: 'text-amber-300 bg-amber-400/10 border-amber-400/25',
      desc: 'Understand individual patterns rather than relying solely on population averages.' },
    { mark: 'C', title: 'Temporal Risk Modeling', color: 'text-accent-blue bg-accent-blue/10 border-accent-blue/25',
      desc: 'Analyze changes across time rather than isolated measurements.' },
    { mark: 'D', title: 'Event Intelligence', color: 'text-accent-purple bg-accent-purple/10 border-accent-purple/25',
      desc: 'Connect incidents with the context preceding and following them.' },
    { mark: 'E', title: 'Edge + Cloud Architecture', color: 'text-brand-green-mid bg-brand-green-mid/10 border-brand-green-mid/25',
      desc: 'Where appropriate, support real-time detection while maintaining longitudinal analytics.' },
    { mark: 'F', title: 'API-First Integration', color: 'text-accent-orange bg-accent-orange/10 border-accent-orange/25',
      desc: 'Designed for interoperability with institutional systems and third-party platforms.' },
  ];
  return (
    <section id="technology" className="py-28 bg-brand-teal-deep relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #00ed64 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead on="dark" eyebrow="Technology" title="Built as an intelligence layer." width="max-w-2xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <PillarCard key={p.mark} mark={p.mark} title={p.title} desc={p.desc} color={p.color} on="dark" delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RESPONSIBLE AI & PRIVACY ───────────────────────────────────────────────────

function PrivacySection() {
  const principles = [
    { mark: '1', title: 'Privacy-Aware Architecture', desc: 'Data handling designed around minimization and purpose limitation from the start.' },
    { mark: '2', title: 'Role-Based Institutional Access', desc: 'Organizational users see only what their role and configuration permit.' },
    { mark: '3', title: 'Secure Data Handling', desc: 'Encryption and access controls applied across the data lifecycle.' },
    { mark: '4', title: 'Explainable Risk Indicators', desc: 'Where possible, risk outputs are designed to be interpretable, not a black box.' },
    { mark: '5', title: 'Human-in-the-Loop Decisions', desc: 'NOVA Intelligence supports decisions — it does not replace institutional judgment.' },
    { mark: '6', title: 'Responsible AI Development', desc: 'Models are developed and evaluated with an ongoing focus on fairness and reliability.' },
    { mark: '7', title: 'Consent-Aware Data Sharing', desc: 'Family and organizational access is permission-based, granted by the individual and their organization.' },
    { mark: '8', title: 'Institutional Governance', desc: 'Organizational deployments operate under defined roles, agreements, and audit expectations.' },
    { mark: '9', title: 'Aggregated Analytics', desc: 'Population and program analytics are designed to work on aggregated and appropriately governed insights.' },
  ];
  return (
    <section id="privacy" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Responsible AI & Privacy"
          title="Human intelligence requires responsible data practices."
          width="max-w-2xl"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {principles.map((p, i) => (
            <PillarCard key={p.mark} mark={p.mark} title={p.title} desc={p.desc}
              color="text-brand-green-dark bg-brand-green/10 border-brand-green/25" delay={i * 80} />
          ))}
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl border border-hairline bg-surface-soft p-8 mb-8">
          <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark mb-3">On insurance partnerships</div>
          <p className="text-sm text-steel leading-relaxed">
            NOVA&apos;s model with insurers and risk partners is built on appropriately governed risk intelligence and prevention programs — not uncontrolled resale of personal data. Access to individual-level information stays based on user and organizational permissions, while program-level work is designed around aggregated insights.
          </p>
        </div>
        <p className="text-center text-sm text-steel max-w-xl mx-auto italic">
          Designed with privacy, security, and future regulatory requirements in mind.
        </p>
      </div>
    </section>
  );
}

// ─── RESEARCH ──────────────────────────────────────────────────────────────────

function ResearchSection() {
  const areas = ['Multimodal human sensing', 'Wearable intelligence', 'Fall & mobility risk', 'Longitudinal modeling', 'Machine learning', 'Human-centered safety technology', 'Sensor fusion', 'Contextual risk analysis'];
  const tracks = [
    { title: 'Publications', status: 'IEEE paper accepted' },
    { title: 'Research Collaborations', status: 'Early discussions' },
    { title: 'Technical Reports', status: 'In development' },
    { title: 'Validation Studies', status: 'Planned' },
    { title: 'Intellectual Property', status: '1 patent held by the team' },
  ];
  return (
    <section id="research" className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Research"
          title="Research-driven by design."
          sub="NOVA's intelligence models are intended to be supported by rigorous research rather than marketing claims. Our founding team has authored IEEE and Scopus-indexed publications and holds a patent in related fields."
          width="max-w-2xl"
        />
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {areas.map(a => (
            <span key={a} className="text-xs font-medium text-brand-green-dark bg-white border border-brand-green/20 rounded-full px-3.5 py-1.5">{a}</span>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {tracks.map(t => (
            <div key={t.title} className="bg-white rounded-xl border border-hairline p-5 text-center">
              <div className="text-sm font-semibold text-ink mb-2">{t.title}</div>
              <div className="text-[11px] text-stone">{t.status}</div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto rounded-2xl border border-brand-green/20 bg-white p-8 mb-12">
          <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark mb-3">Accepted for publication</div>
          <h3 className="text-lg font-medium text-ink leading-snug mb-3">
            Multimodal Deep Learning Architecture for Fall Detection using Kinematics and Heart Rate Sensors
          </h3>
          <p className="text-xs text-steel leading-relaxed">
            A. M. Marchella, Y. Sunju, P. Wijayakusuma (Beijing Institute of Technology) and G. P. N. Hakim (Universitas Mercu Buana) — IEEE, accepted.
          </p>
        </div>

        <div className="flex justify-center">
          <a href="#partner" className="inline-flex items-center gap-2 border border-brand-green-dark/30 text-brand-green-dark font-medium text-sm px-6 py-3 rounded-full hover:bg-white transition-all">
            Explore NOVA Research
            <ArrowRight cls="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── WHY NOVA ──────────────────────────────────────────────────────────────────

function WhyNovaSection() {
  const pillars = [
    { mark: 'P', title: 'Personalized', desc: 'Risk intelligence based on individual baselines and history.' },
    { mark: 'L', title: 'Longitudinal', desc: 'Understand patterns across time instead of isolated events.' },
    { mark: 'M', title: 'Multimodal',   desc: 'Connect information from multiple devices and systems.' },
    { mark: 'A', title: 'Actionable',   desc: 'Translate complex signals into risk states, trends, and organizational workflows.' },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead eyebrow="Why NOVA" title="Four ideas, one platform." width="max-w-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <PillarCard key={p.mark} mark={p.mark} title={p.title} desc={p.desc}
              color="text-brand-green-dark bg-brand-green/10 border-brand-green/25" delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CURRENT STAGE ──────────────────────────────────────────────────────────────

function TeamSection() {
  const team = [
    {
      name: 'Prima Wijayakusuma', role: 'Founder · Hardware and Innovation',
      photo: '/images/team/prima.png',
      affiliation: 'School of Integrated Circuits and Electronics, Beijing Institute of Technology',
      bullets: ['M.Sc. student in Electromagnetics for Biomedical Applications', 'Best Young Innovator, Korea Invention Promotion Association (KIPA) 2024', '3 years with United Nations SDG Networks Indonesia', 'Holder of 1 patent; author of 4 IEEE & Scopus-indexed publications'],
    },
    {
      name: 'Angeline M Marchella', role: 'Co-Founder · AI Algorithm Design',
      photo: '/images/team/angeline.png',
      affiliation: 'School of Computer Science and Technology, Beijing Institute of Technology',
      bullets: ['M.Sc. student in Artificial Intelligence', 'Winner, International Microsoft Hackathon “Code Without Barriers”', 'Author of 4 IEEE & Scopus-indexed publications'],
    },
    {
      name: 'Yi Sunju', role: 'Multimodal Data Retrieval',
      photo: '/images/team/yi-sunju.png',
      affiliation: 'School of Computer Science and Technology, Beijing Institute of Technology',
      bullets: ['M.Sc. in Multimodal Data Retrieval for Health Applications', 'Project development manager with 2 years in AI-powered recommendation systems'],
    },
    {
      name: 'Austin Soedarsono', role: 'Business Development',
      photo: '/images/team/austin.png',
      affiliation: 'Guanghua School of Management background; FMCG and data analytics',
      bullets: ['Full Guanghua MBA scholarship recipient', 'Former Silicon Valley big data engineer', '10 years in FMCG; 6 years in data & analytics', 'Invited speaker, Tsinghua MiM & Peking Guanghua'],
    },
  ];
  return (
    <section id="company" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Company"
          title="The people behind NOVA."
          sub="A research-oriented founding team across AI, multimodal data, biomedical hardware, and commercial strategy."
          width="max-w-2xl"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {team.map((m, i) => (
            <TeamCard key={m.name} member={m} delay={i * 90} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-hairline bg-surface-soft p-8 text-center">
          <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green-dark mb-3">Brand origin</div>
          <p className="text-sm text-steel leading-relaxed">
            NOVA began as <strong className="text-ink">Next Gen On Body Vital Assistant</strong> — an effort to detect falls among older adults. The thesis has since widened from detecting single events to understanding how individual risk changes over time: <strong className="text-ink">from fall detection to risk intelligence.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, delay }: { member: { name: string; role: string; photo: string; affiliation: string; bullets: string[] }; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal card-lift ${visible ? 'visible' : ''} bg-white border border-hairline rounded-[16px] overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="relative aspect-[4/5] bg-surface-soft border-b border-hairline">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top"
        />
      </div>
      <div className="p-6">
      <h3 className="text-base font-semibold text-ink leading-snug">{member.name}</h3>
      <div className="text-[11px] font-bold tracking-widest uppercase text-brand-green-dark mt-1.5 mb-3">{member.role}</div>
      <p className="text-[11px] text-stone leading-snug mb-4">{member.affiliation}</p>
      <ul className="space-y-2">
        {member.bullets.map(b => (
          <li key={b} className="flex items-start gap-2 text-xs text-steel leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

function StageSection() {
  const cards = [
    { title: 'NOVA Intelligence', status: 'MVP Development' },
    { title: 'Risk Modeling',     status: 'Research & Validation' },
    { title: 'Institutional Pilots', status: 'Partner Discussions' },
    { title: 'Data Integrations', status: 'In Development' },
  ];
  const traction = [
    { label: 'Intellectual Property', detail: 'IEEE paper accepted' },
    { label: 'Partnerships',          detail: 'Equira Life — actuarial pricing collaboration' },
    { label: 'Team',                  detail: 'Actively hiring across AI and engineering' },
  ];
  return (
    <section id="stage" className="py-28 bg-brand-teal-deep relative overflow-hidden">
      <div className="relative max-w-[1280px] mx-auto px-6">
        <SectionHead on="dark" eyebrow="Current Stage" title="Building the next layer of human-risk intelligence." width="max-w-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {cards.map(c => (
            <div key={c.title} className="rounded-xl p-5 border text-center glass-dark border-white/8">
              <div className="text-sm font-medium text-on-dark mb-2">{c.title}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-brand-green flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                {c.status}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {traction.map(t => (
            <div key={t.label} className="rounded-xl p-5 border glass-dark border-white/8">
              <div className="text-[10px] font-bold tracking-widest uppercase text-on-dark-muted mb-2">{t.label}</div>
              <div className="flex items-start gap-2 text-sm text-on-dark">
                <Chk cls="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                {t.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── PARTNERS ──────────────────────────────────────────────────────────────────

function PartnersSection() {
  const { ref, visible } = useReveal();
  const partners = [
    { name: 'Equira Life', logo: '/images/partners/equiralife.png', detail: 'Actuarial pricing collaboration', w: 234, h: 80,  cls: 'h-10 w-auto' },
    { name: 'Sehatin',     logo: '/images/partners/sehatin.jpg',    detail: 'Partner',                       w: 600, h: 600, cls: 'h-14 w-auto' },
  ];
  return (
    <section id="partners" className="py-28 bg-surface-green">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHead
          eyebrow="Partners"
          title="Working with partners from the start."
          sub="NOVA's partner-led model means the platform is shaped alongside the organizations that will operate it."
          width="max-w-2xl"
        />
        <div ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${visible ? 'visible' : ''} grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto`}>
          {partners.map(p => (
            <div key={p.name} className="bg-white rounded-2xl border border-hairline p-8 flex flex-col items-center text-center">
              <div className="h-16 flex items-center justify-center mb-5">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  className={`${p.cls} object-contain`}
                />
              </div>
              <div className="text-base font-semibold text-ink mb-1">{p.name}</div>
              <div className="text-xs text-steel">{p.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PARTNERSHIP CTA ─────────────────────────────────────────────────────────────

function PartnerSection() {
  const { ref, visible } = useReveal();
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="partner" className="py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal max-w-2xl mx-auto text-center ${visible ? 'visible' : ''}`}>
          <Eyebrow>Partnership</Eyebrow>
          <h2 className="text-4xl md:text-[2.8rem] font-medium text-ink tracking-[-0.5px] mb-4">
            Help shape the future of<br />
            <span className="gradient-text-green">human-risk intelligence.</span>
          </h2>
          <p className="text-steel text-lg leading-relaxed mb-10">
            We&apos;re looking to collaborate with care organizations, healthcare providers, researchers, technology partners, and institutions interested in exploring more intelligent approaches to human-risk monitoring and prevention.
          </p>

          {submitted ? (
            <div className="bg-brand-green-soft border border-brand-green/30 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
                <Chk cls="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">Thanks for reaching out.</h3>
              <p className="text-steel text-sm">We&apos;ll follow up as we move toward pilot partnerships. Thank you for your interest in NOVA.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-surface-green rounded-2xl border border-brand-green/20 p-8 text-left">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wide">Work email *</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@organization.com"
                    className="w-full h-11 px-4 text-sm text-ink bg-white border border-hairline rounded-lg outline-none focus:border-brand-green-dark focus:ring-2 focus:ring-brand-green/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wide">Organization</label>
                  <input
                    type="text" value={org} onChange={e => setOrg(e.target.value)}
                    placeholder="Organization name"
                    className="w-full h-11 px-4 text-sm text-ink bg-white border border-hairline rounded-lg outline-none focus:border-brand-green-dark focus:ring-2 focus:ring-brand-green/20 transition-all"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate mb-1.5 uppercase tracking-wide">I represent…</label>
                <select
                  value={role} onChange={e => setRole(e.target.value)}
                  className="w-full h-11 px-4 text-sm text-ink bg-white border border-hairline rounded-lg outline-none focus:border-brand-green-dark focus:ring-2 focus:ring-brand-green/20 transition-all appearance-none"
                >
                  <option value="">Select an option</option>
                  <option value="care">Care organization</option>
                  <option value="healthcare">Healthcare provider</option>
                  <option value="insurance">Insurance / risk organization</option>
                  <option value="research">Research institution</option>
                  <option value="investor">Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit"
                className="w-full bg-brand-green text-on-primary font-semibold text-sm py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all"
              >
                Partner With NOVA
              </button>
              <p className="text-center text-xs text-stone mt-4">No spam. We&apos;ll only reach out about partnership opportunities.</p>
            </form>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <span className="text-stone">Or reach us directly:</span>
            <a href="mailto:novanextgencorp@outlook.com"
              className="font-medium text-brand-green-dark hover:underline underline-offset-4">
              novanextgencorp@outlook.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols: { head: string; links: { label: string; href: string }[] }[] = [
    { head: 'Product', links: [
      { label: 'NOVA Intelligence', href: '#platform' },
      { label: 'Technology', href: '#technology' },
      { label: 'Risk States', href: '#risk-states' },
    ] },
    { head: 'Company', links: [
      { label: 'About', href: '#company' },
      { label: 'Research', href: '#research' },
      { label: 'Careers', href: 'mailto:novanextgencorp@outlook.com?subject=Careers%20at%20NOVA' },
      { label: 'Contact', href: 'mailto:novanextgencorp@outlook.com' },
    ] },
    { head: 'For Organizations', links: [
      { label: 'Care', href: '#use-cases' },
      { label: 'Healthcare', href: '#use-cases' },
      { label: 'Insurance & Risk', href: '#use-cases' },
      { label: 'Partnerships', href: '#partner' },
    ] },
    { head: 'Legal', links: [
      { label: 'Privacy & Responsible AI', href: '#privacy' },
      { label: 'Terms', href: '#' },
    ] },
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
              width={130}
              height={52}
              className="object-contain h-auto mb-4"
            />
            <p className="text-sm text-on-dark-muted leading-relaxed mb-4">
              Human Risk Intelligence for a safer world.
            </p>
            <div className="flex flex-col gap-1.5 mb-6">
              <a href="mailto:novanextgencorp@outlook.com" className="text-sm text-on-dark-muted hover:text-brand-green transition-colors">
                novanextgencorp@outlook.com
              </a>
              <a href="https://bit.ly/m/novacorporation" target="_blank" rel="noopener noreferrer"
                className="text-sm text-on-dark-muted hover:text-brand-green transition-colors">
                bit.ly/m/novacorporation
              </a>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-brand-green/15 border border-brand-green/30 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-[10px] font-bold uppercase tracking-wide">Human Risk Intelligence Platform</span>
            </div>
          </div>
          {/* Link cols */}
          {cols.map(c => (
            <div key={c.head}>
              <h4 className="text-on-dark text-[10px] font-bold tracking-widest uppercase mb-4">{c.head}</h4>
              <ul className="space-y-2.5">
                {c.links.map(l => (
                  <li key={l.label}><a href={l.href} className="text-on-dark-muted text-sm hover:text-on-dark transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-hairline-dark pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-on-dark-muted text-sm">© {new Date().getFullYear()} NOVA. All rights reserved.</p>
          <p className="text-on-dark-muted text-xs">Early-stage company · Building toward validated, institutional-grade risk intelligence.</p>
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
      <ProblemSection />
      <PlatformSection />
      <EcosystemSection />
      <StakeholdersSection />
      <HowItWorksSection />
      <ProductOverviewSection />
      <PersonalizedSection />
      <RiskStatesSection />
      <LongitudinalSection />
      <MultimodalSection />
      <ScaleSection />
      <FlywheelSection />
      <UseCasesSection />
      <BusinessModelSection />
      <MarketSection />
      <TechnologySection />
      <PrivacySection />
      <ResearchSection />
      <WhyNovaSection />
      <TeamSection />
      <StageSection />
      <PartnersSection />
      <PartnerSection />
      <Footer />
    </main>
  );
}
