"use client";
import { useEffect, useState, useCallback } from "react";

const SERVICES = [
  "Creative Direction",
  "VFX Production",
  "3D Animation",
  "CGI & Rendering",
  "Social Media",
  "Branding",
  "Motion Design",
  "Content Strategy",
  "Interactive Design",
  "Campaign Launch",
];

const CLIENTS = [
  "Mercedes-Benz", "Gulf Bank", "IKEA", "BYD",
  "Honda Alghanim", "Hongqi Alghanim", "Virgin Mobile",
  "Kuwait International Bank", "Costa Coffee",
  "NBK", "Trolley", "Jahez", "Zain", "GIG",
  "Cadillac", "Ford", "BMW", "MG",
  "Caribou Coffee", "Future Kid",
];

const AWARDS = [
  { label: "Site of the Year",        count: "001", org: "Awwwards" },
  { label: "Developer Award",         count: "001", org: "Awwwards" },
  { label: "Site of the Day",         count: "016", org: "Awwwards" },
  { label: "Site of the Year",        count: "001", org: "FWA" },
  { label: "Agency of the Year",      count: "001", org: "CSSDA" },
];

export default function DOMOverlay() {
  const [t, setT] = useState(0);

  // Poll the ScrollControls scroller div for scroll position
  useEffect(() => {
    let scroller: HTMLElement | null = null;
    let raf: number;

    const findAndBind = () => {
      // ScrollControls creates a div with overflow-y: auto or scroll
      const divs = Array.from(document.querySelectorAll("div")) as HTMLElement[];
      scroller = divs.find(
        (d) => d.style.overflowY === "auto" || d.style.overflowY === "scroll"
      ) || null;
    };

    const tick = () => {
      if (!scroller) findAndBind();
      if (scroller) {
        const max = scroller.scrollHeight - scroller.clientHeight;
        if (max > 0) setT(scroller.scrollTop / max);
      }
      raf = requestAnimationFrame(tick);
    };

    // Start after short delay to let Canvas mount
    const timeout = setTimeout(() => { raf = requestAnimationFrame(tick); }, 800);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, []);

  // Range opacity helper
  const op = (inLow: number, inHigh: number, outLow = 0, outHigh = 1) => {
    const v = Math.max(0, Math.min(1, (t - inLow) / (inHigh - inLow)));
    return outLow + v * (outHigh - outLow);
  };

  // Fade in then out
  const section = (fadeIn: [number, number], fadeOut: [number, number]) => {
    const a = op(fadeIn[0], fadeIn[1]);
    const b = 1 - op(fadeOut[0], fadeOut[1]);
    return Math.min(a, b);
  };

  const heroOp      = section([0.00, 0.03], [0.07, 0.10]);
  const manifestoOp = section([0.07, 0.10], [0.16, 0.20]);
  const astronautOp = section([0.17, 0.21], [0.26, 0.29]);
  const planetOp    = section([0.27, 0.31], [0.38, 0.42]);
  const universeOp  = section([0.39, 0.43], [0.48, 0.52]);
  const floatOp     = section([0.49, 0.53], [0.58, 0.62]);
  const servicesOp  = section([0.59, 0.63], [0.70, 0.74]);
  const clientsOp   = section([0.71, 0.75], [0.80, 0.84]);
  const cardsOp     = section([0.81, 0.85], [0.90, 0.94]);
  const ctaOp       = section([0.91, 0.95], [1.00, 1.00]);

  // Services word stagger
  const serviceWords = SERVICES.map((s, i) => {
    const wordT = op(0.60 + i * 0.008, 0.63 + i * 0.008);
    return { label: s, op: wordT };
  });

  // Client stagger
  const clientWords = CLIENTS.map((c, i) => {
    const wordT = op(0.72 + i * 0.005, 0.75 + i * 0.005);
    return { label: c, op: wordT };
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none", overflow: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "2rem 3.5rem", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        pointerEvents: "all",
      }}>
        <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          ASTROSHOT
        </span>
        <a href="mailto:info@astroshotpm.com" style={{
          fontSize: "0.72rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#00ff88",
          textDecoration: "none",
        }}>Start a Project</a>
      </nav>

      {/* ── HERO ── */}
      <div style={{ ...center, opacity: heroOp, transform: `translateY(${t * -120}px)` }}>
        <p style={label}>Kuwait · GCC · The World</p>
        <h1 style={{ ...displayXL, fontSize: "clamp(4rem, 14vw, 13rem)", lineHeight: 0.88 }}>
          ASTROSHOT
        </h1>
        <p style={{ ...bodyText, marginTop: "1.5rem", textAlign: "center" }}>
          We Create What Others Only Imagine
        </p>
        <p style={{
          marginTop: "3rem", fontSize: "0.7rem",
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          animation: "bounce 2s ease-in-out infinite",
        }}>
          Scroll to Explore ↓
        </p>
      </div>

      {/* ── MANIFESTO ── */}
      <div style={{ ...center, opacity: manifestoOp, padding: "0 3rem", maxWidth: "900px", margin: "0 auto", left: 0, right: 0 }}>
        <p style={{ ...label, marginBottom: "1.5rem" }}>Our Approach</p>
        <h2 style={{
          fontSize: "clamp(2.2rem, 5vw, 5rem)",
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.025em", textAlign: "center",
          color: "#f0f0f0",
        }}>
          A worldwide team of specialists in design, motion, 3D, and technology — turning ambitious ideas into{" "}
          <em style={{ color: "#00ff88", fontStyle: "normal" }}>immersive digital experiences</em>.
        </h2>
      </div>

      {/* ── ASTRONAUT / S2 ── */}
      <div style={{ ...centerLeft, opacity: astronautOp, padding: "0 3.5rem" }}>
        <p style={{ ...label, marginBottom: "1rem" }}>In The Field</p>
        <h2 style={{ ...displayLG, maxWidth: "420px" }}>
          We Float<br />Where Others<br />Can&apos;t Reach
        </h2>
        <p style={{ ...bodyText, marginTop: "1.2rem" }}>
          Premium creative execution from Kuwait to the world. 500M+ organic views and counting.
        </p>
      </div>

      {/* ── PLANET / S3 ── */}
      <div style={{ ...centerRight, opacity: planetOp, padding: "0 3.5rem" }}>
        <p style={{ ...label, marginBottom: "1rem" }}>Scale</p>
        <h2 style={{ ...displayLG, textAlign: "right", maxWidth: "380px" }}>
          Built<br />For The<br />Biggest Brands
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1.5rem", alignItems: "flex-end" }}>
          {["Mercedes", "Gulf Bank", "IKEA", "BYD", "Honda"].map(b => (
            <span key={b} style={{ fontSize: "0.8rem", letterSpacing: "0.1em", color: "rgba(240,240,240,0.45)", textTransform: "uppercase" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* ── UNIVERSE / S4 ── */}
      <div style={{ ...center, opacity: universeOp }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <p style={{ ...label }}>Recognition</p>
          <h2 style={{ ...displayXL, fontSize: "clamp(3rem, 10vw, 9rem)", textAlign: "center" }}>
            AWARD<br />WINNING
          </h2>
          <div style={{ display: "flex", gap: "3rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            {AWARDS.map((a) => (
              <div key={a.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, color: "#00ff88", letterSpacing: "-0.02em" }}>{a.count}</p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,240,240,0.4)", marginTop: "0.2rem" }}>{a.org}</p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,240,240,0.25)" }}>{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOAT OBJECTS / S5 ── */}
      <div style={{ ...center, opacity: floatOp }}>
        <p style={{ ...label, marginBottom: "1rem" }}>500M+</p>
        <h2 style={{ ...displayXL, fontSize: "clamp(3.5rem, 12vw, 11rem)", textAlign: "center", color: "#00ff88" }}>
          ORGANIC<br />VIEWS
        </h2>
        <p style={{ ...bodyText, textAlign: "center", marginTop: "1.2rem" }}>
          Content that earns attention, not just impressions.
        </p>
      </div>

      {/* ── SERVICES TYPOGRAPHY / S6 ── */}
      <div style={{ ...center, opacity: servicesOp, flexDirection: "column", gap: "0" }}>
        <p style={{ ...label, marginBottom: "2rem" }}>Area of Expertise</p>
        <div style={{ textAlign: "center" }}>
          {serviceWords.map(({ label: l, op: o }, i) => (
            <span key={i} style={{
              display: "inline-block",
              fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              opacity: o,
              transform: `translateY(${(1 - o) * 24}px)`,
              transition: "none",
              color: i % 3 === 0 ? "#00ff88" : "#f0f0f0",
              marginRight: i < serviceWords.length - 1 ? "0.6em" : 0,
            }}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── CLIENTS / S7 ── */}
      <div style={{ ...center, opacity: clientsOp, flexDirection: "column" }}>
        <p style={{ ...label, marginBottom: "2rem" }}>Trusted By</p>
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "1rem 2.5rem", maxWidth: "860px",
        }}>
          {clientWords.map(({ label: l, op: o }, i) => (
            <span key={i} style={{
              fontSize: "clamp(0.8rem, 1.8vw, 1.3rem)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: o * 0.85,
              transform: `translateY(${(1 - o) * 12}px)`,
              color: "#f0f0f0",
              whiteSpace: "nowrap",
            }}>{l}</span>
          ))}
        </div>
        <div style={{ marginTop: "3rem", display: "flex", gap: "4rem" }}>
          {[["50+", "Clients"], ["10+", "Years"], ["500M+", "Views"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "#00ff88", letterSpacing: "-0.03em" }}>{n}</p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,240,240,0.35)" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WORK CARDS / S8 ── */}
      <div style={{ ...top, opacity: cardsOp, padding: "3rem 3.5rem 0" }}>
        <p style={{ ...label, marginBottom: "0.4rem" }}>Selected Work</p>
        <h2 style={{ ...displayLG, fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}>Work That Moves</h2>
      </div>

      {/* ── CTA / S9 ── */}
      <div style={{ ...center, opacity: ctaOp, flexDirection: "column", textAlign: "center", padding: "0 2rem" }}>
        <p style={{ ...label, marginBottom: "1.5rem" }}>Ready?</p>
        <h2 style={{ ...displayXL, fontSize: "clamp(2.5rem, 8vw, 8rem)", maxWidth: "900px", textAlign: "center" }}>
          LET&apos;S BUILD SOMETHING CINEMATIC
        </h2>
        <p style={{ ...bodyText, textAlign: "center", margin: "1.5rem auto 2.5rem", maxWidth: "380px" }}>
          Tell us your vision. We&apos;ll make it impossible to ignore.
        </p>
        <a
          href="mailto:info@astroshotpm.com"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "1rem 2.8rem",
            background: "#00ff88", color: "#000",
            fontWeight: 700, fontSize: "0.82rem",
            letterSpacing: "0.14em", textTransform: "uppercase",
            textDecoration: "none", pointerEvents: "all",
          }}
        >
          Start a Project →
        </a>
        <div style={{
          marginTop: "3rem", display: "flex", gap: "2.5rem", justifyContent: "center",
          fontSize: "0.7rem", letterSpacing: "0.12em",
          color: "rgba(240,240,240,0.3)", textTransform: "uppercase", flexWrap: "wrap",
        }}>
          <span>info@astroshotpm.com</span>
          <span>+965 98000197</span>
          <span>@Astroshotmedia</span>
          <span>Kuwait · Al Salam Tower</span>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
      `}</style>
    </div>
  );
}

// ── Style constants ──
const center: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  transition: "opacity 0.5s ease",
};
const centerLeft: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "flex-start", justifyContent: "center",
  transition: "opacity 0.5s ease",
};
const centerRight: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "flex-end", justifyContent: "center",
  transition: "opacity 0.5s ease",
};
const top: React.CSSProperties = {
  position: "absolute", top: 0, left: 0, right: 0,
  transition: "opacity 0.5s ease",
};
const displayXL: React.CSSProperties = {
  fontSize: "clamp(3.5rem, 12vw, 11rem)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 0.88,
  textTransform: "uppercase",
  color: "#f0f0f0",
};
const displayLG: React.CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 4.5rem)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.0,
  textTransform: "uppercase",
  color: "#f0f0f0",
};
const label: React.CSSProperties = {
  fontSize: "0.7rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#00ff88",
};
const bodyText: React.CSSProperties = {
  fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
  fontWeight: 300,
  lineHeight: 1.65,
  color: "rgba(240,240,240,0.6)",
  maxWidth: "480px",
};
