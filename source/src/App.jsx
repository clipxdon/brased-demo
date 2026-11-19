import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitText from './components/SplitText'
import CountUp from './components/CountUp'
import ChairGlyph from './components/ChairGlyph'
import { STEPS, COLLECTIONS, MODELS } from './content'
import { scene, FABRICS, material, setMaterial, reducedMotion, isMobile } from './store'

gsap.registerPlugin(ScrollTrigger)
const Scene = lazy(() => import('./three/Scene'))

// Chair "poses" per section. Mobile keeps the chair centred and smaller.
const P = isMobile
  ? {
      hero: { x: 0, y: 1.05, rotY: 0.6, scale: 0.58, explode: 0, camZ: 7.4 },
      craft: { x: 0, y: 1.25, scale: 0.42, camZ: 8 },
      away: { x: 0, y: 4.5, scale: 0.6, explode: 0 },
      config: { x: 0, y: 1.15, rotY: 0.4, scale: 0.55, explode: 0, camZ: 7.4 },
    }
  : {
      hero: { x: 0.95, y: 0, rotY: 0.6, scale: 1, explode: 0, camZ: 6.2 },
      craft: { x: -1.05, y: -0.25, scale: 0.82, camZ: 7.4 },
      away: { x: 0.95, y: 4.5, scale: 0.9, explode: 0 },
      config: { x: 0.95, y: 0, rotY: 0.35, scale: 1.05, explode: 0, camZ: 6 },
    }

const pose = (p) => gsap.to(scene, { ...p, duration: 1.2, ease: 'expo.out', overwrite: 'auto' })

function useLenis() {
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
}

const go = (id) => (e) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}

function Nav() {
  return (
    <header className="nav">
      <a href="#top" onClick={go('top')} className="logo" aria-label="Brased, torna su">
        brased<span>.</span>
      </a>
      <nav aria-label="Sezioni">
        <a href="#fatto-a-bra" onClick={go('fatto-a-bra')}>Fatto a Bra</a>
        <a href="#collezioni" onClick={go('collezioni')}>Collezioni</a>
        <a href="#rivestimenti" onClick={go('rivestimenti')}>Rivestimenti</a>
        <a href="#contatti" onClick={go('contatti')} className="nav-cta">Preventivo</a>
      </nav>
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top center', end: 'bottom center', onEnter: () => pose(P.hero), onEnterBack: () => pose(P.hero) })
      if (!reducedMotion) {
        gsap.from('.hero-meta > *', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.9 })
        // scroll-linked: chair turns and lifts as the hero leaves
        gsap.to(scene, { rotY: P.hero.rotY + 1.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
        gsap.to('.hero-title', { yPercent: -30, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      }
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-inner">
        <p className="eyebrow">Sedute per ufficio e comunità · Bra, dal 2001</p>
        <SplitText as="h1" className="hero-title display" text="Sedersi bene è un mestiere." immediate delay={0.2} stagger={0.025} />
        <div className="hero-meta">
          <p className="lead">Poltrone direzionali, sedute operative, attesa e comunità. Tagliate, cucite, imbottite e assemblate nel nostro laboratorio di Strada Falchetto.</p>
          <div className="hero-actions">
            <a href="#collezioni" onClick={go('collezioni')} className="btn">Scopri le collezioni</a>
            <a href="#fatto-a-bra" onClick={go('fatto-a-bra')} className="btn btn-ghost">Come nasce una seduta</a>
          </div>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true"><span /></div>
    </section>
  )
}

function Craft() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        ScrollTrigger.create({ trigger: ref.current, start: 'top center', end: 'bottom center', onEnter: () => pose({ ...P.craft, explode: 0.6 }), onEnterBack: () => pose({ ...P.craft, explode: 0.6 }) })
        return
      }
      const craftPose = () => pose({ x: P.craft.x, y: P.craft.y, scale: P.craft.scale, camZ: P.craft.camZ })
      ScrollTrigger.create({ trigger: ref.current, start: 'top 65%', onEnter: craftPose, onLeaveBack: () => pose(P.hero) })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=' + (isMobile ? 2400 : 3200),
        pin: true,
        scrub: true,
        onEnter: () => pose({ x: P.craft.x, y: P.craft.y, scale: P.craft.scale, camZ: P.craft.camZ }),
        onEnterBack: () => pose({ x: P.craft.x, y: P.craft.y, scale: P.craft.scale, camZ: P.craft.camZ }),
        onLeave: () => { scene.step = -1 },
        onLeaveBack: () => { scene.step = -1 },
        onUpdate: (self) => {
          const p = self.progress
          // explode fast at the start, then reassemble across the four steps
          scene.explode = p < 0.15 ? p / 0.15 : Math.max(0, 1 - (p - 0.15) / 0.75)
          scene.rotY = P.hero.rotY + 1.2 + p * Math.PI * 1.1
          const s = Math.min(3, Math.floor(p * 4))
          scene.step = s
          setActive(s)
        },
      })
      gsap.from('.craft-line', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=' + (isMobile ? 2400 : 3200), scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="fatto-a-bra" ref={ref} className="craft">
      <div className="craft-panel">
        <p className="eyebrow">Fatto a Bra</p>
        <h2 className="display h2">Quattro mani,<br /><em>una seduta.</em></h2>
        <ol className="steps">
          <span className="craft-line" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.n} className={!reducedMotion && i === active ? 'on' : reducedMotion ? 'on' : ''}>
              <span className="step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Collections() {
  const ref = useRef(null)
  const track = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 70%', end: 'bottom 30%', onEnter: () => pose(P.away), onEnterBack: () => pose(P.away) })
      if (reducedMotion || isMobile) return
      const dist = () => track.current.scrollWidth - window.innerWidth + 48
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="collezioni" ref={ref} className="collections">
      <div className="col-head">
        <p className="eyebrow">Collezioni</p>
        <SplitText className="display h2" text="Sette famiglie, oltre cento versioni." />
      </div>
      <div className="col-track" ref={track}>
        {COLLECTIONS.map((c, i) => (
          <article className="col-card" key={c.name}>
            <span className="col-idx">0{i + 1}</span>
            <p className="col-tag">{c.tag}</p>
            <h3>{c.name}</h3>
            <p className="col-count"><CountUp to={c.count} /> <small>versioni a catalogo</small></p>
            <p className="col-models">{c.models}</p>
            <span className="stitch" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}

function Models() {
  const ref = useRef(null)
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.model').forEach((el) => {
        gsap.from(el, { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        gsap.fromTo(el.querySelector('.glyph'), { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="modelli" ref={ref} className="models">
      <div className="col-head">
        <p className="eyebrow">Modelli in evidenza</p>
        <SplitText className="display h2" text="Quattro icone del catalogo." />
      </div>
      <div className="model-grid">
        {MODELS.map((m) => (
          <article className="model" key={m.name}>
            <div className="model-visual"><ChairGlyph shape={m.shape} /></div>
            <div className="model-body">
              <p className="col-tag">{m.cat}</p>
              <h3 className="display">{m.name}</h3>
              <p>{m.text}</p>
              <ul>{m.specs.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Configurator() {
  const ref = useRef(null)
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force((n) => n + 1)
    material.listeners.add(fn)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 60%', end: 'bottom 40%', onEnter: () => pose(P.config), onEnterBack: () => pose(P.config), onLeave: () => pose(P.away), onLeaveBack: () => pose(P.away) })
      if (!reducedMotion)
        gsap.to(scene, { rotY: P.config.rotY + 1.4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, ref)
    return () => { material.listeners.delete(fn); ctx.revert() }
  }, [])
  const f = material.fabric
  return (
    <section id="rivestimenti" ref={ref} className="config">
      <div className="config-panel">
        <p className="eyebrow">Configuratore rivestimenti</p>
        <h2 className="display h2">Scegli la pelle<br /><em>della tua seduta.</em></h2>
        <div className="fabric-list" role="radiogroup" aria-label="Tipo di rivestimento">
          {FABRICS.map((fb) => (
            <button key={fb.id} role="radio" aria-checked={fb.id === f.id} className={'fabric' + (fb.id === f.id ? ' on' : '')} onClick={() => setMaterial(fb, fb.colors[0])}>
              {fb.name}
            </button>
          ))}
        </div>
        <p className="fabric-note">{f.note}</p>
        <div className="swatches" role="radiogroup" aria-label="Colore">
          {f.colors.map((c) => (
            <button key={c} role="radio" aria-checked={c === material.color} aria-label={'Colore ' + c} className={'swatch' + (c === material.color ? ' on' : '')} style={{ background: c }} onClick={() => setMaterial(f, c)} />
          ))}
        </div>
        <p className="small">Colori indicativi. A catalogo decine di tinte per ogni famiglia di tessuto, e imbottiture su misura.</p>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contatti" className="contact">
      <div className="contact-inner">
        <p className="eyebrow">Su misura e riparazioni</p>
        <SplitText className="display h2 big" text="Una seduta nuova, o la tua come nuova." />
        <div className="contact-grid">
          <div>
            <h3>Su misura</h3>
            <p>Imbottiture, dimensioni e rivestimenti su richiesta, per uffici, sale d’attesa, mense e circoli.</p>
          </div>
          <div>
            <h3>Riparazione</h3>
            <p>Sostituiamo rivestimenti, ruote, basamenti, pistoni a gas e meccanismi. Le tue sedute tornano a lavorare.</p>
          </div>
          <div>
            <h3>Laboratorio</h3>
            <p>Strada Falchetto 61/D<br />12042 Bra (CN)<br /><a href="tel:+390172421701">0172 421701</a></p>
          </div>
        </div>
        <a className="btn btn-big" href="tel:+390172421701">Richiedi un preventivo</a>
      </div>
      <footer className="foot">
        <span>Brased snc · P.IVA 02813500044</span>
        <span>Bozza di concept, non definitiva</span>
      </footer>
    </section>
  )
}

export default function App() {
  useLenis()
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <Suspense fallback={null}><Scene /></Suspense>
      <Nav />
      <main>
        <Hero />
        <Craft />
        <Collections />
        <Models />
        <Configurator />
        <Contact />
      </main>
    </>
  )
}
