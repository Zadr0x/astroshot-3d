"use client";

import { useEffect, useRef, useState } from "react";

interface SectionVisibility {
  hero: boolean;
  services: boolean;
  work: boolean;
  about: boolean;
  contact: boolean;
}

const CLIENTS = [
  { name: "Mercedes-Benz", service: "VFX Campaign" },
  { name: "Gulf Bank", service: "Social Media" },
  { name: "IKEA Kuwait", service: "Content Creation" },
  { name: "BYD", service: "Launch Campaign" },
  { name: "Honda Alghanim", service: "TikTok Management" },
  { name: "Virgin Mobile", service: "Branding" },
  { name: "KIB", service: "Video Production" },
  { name: "Hongqi Alghanim", service: "Social Media" },
];

const SERVICES = [
  {
    id: "vfx",
    name: "VFX & 3D",
    desc: "Cinematic visual effects and 3D animation that make brands impossible to ignore.",
    position: "left",
    color: "#ff6622",
  },
  {
    id: "social",
    name: "Social Media",
    desc: "Strategy, content, and management that turns followers into customers.",
    position: "center",
    color: "#0088ff",
  },
  {
    id: "brand",
    name: "Branding",
    desc: "Identity systems that feel premium, timeless, and distinctly yours.",
    position: "right",
    color: "#8833ff",
  },
];

export default function DOMOverlay() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector("[data-lenis-scroller]") as HTMLElement;
      const scrollEl = el || window;
      const scrollY =
        el?.scrollTop ?? window.scrollY;
      const maxScroll =
        (el?.scrollHeight ?? document.body.scrollHeight) - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      scrollRef.current = progress;
      setScrollProgress(progress);
    };

    // Also listen on the ScrollControls internal div
    const observer = new MutationObserver(() => {
      const scroller = document.querySelector("[data-lenis-scroller]");
      if (scroller) {
        scroller.addEventListener("scroll", handleScroll);
        observer.disconnect();
      }
    });

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Poll for ScrollControls internal container
    const interval = setInterval(() => {
      const inner = document.querySelector(
        'div[style*="overflow-y: auto"]'
      ) as HTMLElement;
      if (inner) {
        inner.addEventListener("scroll", handleScroll, { passive: true });
        clearInterval(interval);
      }
    }, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const t = scrollProgress;

  // Visibility ranges
  const heroOpacity = t < 0.12 ? 1 : t < 0.18 ? 1 - (t - 0.12) / 0.06 : 0;
  const servicesOpacity =
    t < 0.15 ? 0 : t < 0.22 ? (t - 0.15) / 0.07 : t < 0.38 ? 1 : t < 0.45 ? 1 - (t - 0.38) / 0.07 : 0;
  const workOpacity =
    t < 0.4 ? 0 : t < 0.47 ? (t - 0.4) / 0.07 : t < 0.62 ? 1 : t < 0.68 ? 1 - (t - 0.62) / 0.06 : 0;
  const aboutOpacity =
    t < 0.65 ? 0 : t < 0.72 ? (t - 0.65) / 0.07 : t < 0.83 ? 1 : t < 0.88 ? 1 - (t - 0.83) / 0.05 : 0;
  const contactOpacity =
    t < 0.85 ? 0 : t < 0.92 ? (t - 0.85) / 0.07 : 1;

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">Astroshot</div>
        <a href="mailto:info@astroshotpm.com" className="nav-cta">
          Start a Project
        </a>
      </nav>

      {/* ——————————————————— HERO ——————————————————— */}
      <div
        className="section-overlay"
        style={{ opacity: heroOpacity, transition: "opacity 0.4s ease" }}
      >
        <div
          style={{
            textAlign: "center",
            transform: `translateY(${t * -80}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <p
            className="label"
            style={{ marginBottom: "1.5rem", letterSpacing: "0.25em" }}
          >
            Kuwait · GCC · The World
          </p>
          <h1 className="display-xl" style={{ color: "#f0f0f0" }}>
            ASTROSHOT
          </h1>
          <p
            className="body-text"
            style={{
              margin: "1.5rem auto 0",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            We Create What Others Only Imagine
          </p>
          <div
            className="scroll-hint"
            style={{
              marginTop: "3rem",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240,240,240,0.4)",
              opacity: t < 0.02 ? 1 : Math.max(0, 1 - t / 0.05),
            }}
          >
            Scroll to Explore ↓
          </div>
        </div>
      </div>

      {/* ——————————————————— SERVICES ——————————————————— */}
      <div
        className="section-overlay"
        style={{
          opacity: servicesOpacity,
          transition: "opacity 0.4s ease",
          alignItems: "flex-end",
          paddingBottom: "6rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px", padding: "0 4rem" }}>
          <p className="label" style={{ marginBottom: "0.5rem" }}>
            What We Do
          </p>
          <h2 className="display-lg" style={{ marginBottom: "3rem" }}>
            Our Services
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
            }}
          >
            {SERVICES.map((s) => (
              <div key={s.id}>
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: s.color,
                    marginBottom: "1rem",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(240,240,240,0.55)",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ——————————————————— WORK ——————————————————— */}
      <div
        className="section-overlay"
        style={{
          opacity: workOpacity,
          transition: "opacity 0.4s ease",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 4rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <p className="label" style={{ marginBottom: "0.5rem" }}>
            Our Clients
          </p>
          <h2
            className="display-lg"
            style={{ marginBottom: "0.5rem" }}
          >
            Work That Moves
          </h2>
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "#00ff88",
              margin: "1.5rem 0",
            }}
          />

          {/* Stat */}
          <div style={{ marginBottom: "3rem" }}>
            <span
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 800,
                color: "#00ff88",
                letterSpacing: "-0.03em",
              }}
            >
              500M+
            </span>
            <p
              className="label"
              style={{ marginTop: "0.25rem", color: "rgba(240,240,240,0.5)" }}
            >
              Organic Views Generated
            </p>
          </div>

          {/* Client grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem 2rem",
            }}
          >
            {CLIENTS.map((c) => (
              <div key={c.name}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  {c.name}
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#00ff88",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {c.service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ——————————————————— ABOUT ——————————————————— */}
      <div
        className="section-overlay"
        style={{
          opacity: aboutOpacity,
          transition: "opacity 0.4s ease",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 4rem 6rem",
        }}
      >
        <div style={{ maxWidth: "480px" }}>
          <p className="label" style={{ marginBottom: "1rem" }}>
            About Astroshot
          </p>
          <h2
            className="display-lg"
            style={{ marginBottom: "1.5rem", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Premium.<br />Cinematic.<br />Impossible to ignore.
          </h2>
          <p className="body-text">
            We blend VFX, 3D, and creative strategy to produce work that people
            stop, watch, and remember. From Kuwait to the world.
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            {[
              ["10+", "Years of Creative Work"],
              ["50+", "Brands Served"],
              ["500M+", "Views Generated"],
            ].map(([num, label]) => (
              <div key={num}>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#00ff88",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(240,240,240,0.5)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ——————————————————— CONTACT ——————————————————— */}
      <div
        className="section-overlay"
        style={{
          opacity: contactOpacity,
          transition: "opacity 0.4s ease",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 2rem",
        }}
      >
        <p className="label" style={{ marginBottom: "1.5rem" }}>
          Ready to Create?
        </p>
        <h2
          className="display-xl"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 7rem)",
            marginBottom: "2rem",
            maxWidth: "900px",
          }}
        >
          Let&apos;s Build Something Cinematic
        </h2>
        <p
          className="body-text"
          style={{
            textAlign: "center",
            margin: "0 auto 3rem",
            maxWidth: "400px",
          }}
        >
          Tell us your vision. We&apos;ll make it impossible to ignore.
        </p>
        <a
          href="mailto:info@astroshotpm.com"
          className="cta-btn"
          style={{ textDecoration: "none", display: "inline-flex" }}
        >
          Start a Project →
        </a>
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "rgba(240,240,240,0.4)",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          <span>info@astroshotpm.com</span>
          <span>+965 98000197</span>
          <span>@Astroshotmedia</span>
          <span>Kuwait</span>
        </div>

        {/* Footer */}
        <p
          style={{
            position: "absolute",
            bottom: "2rem",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: "rgba(240,240,240,0.2)",
            textTransform: "uppercase",
          }}
        >
          © 2025 Astroshot Project Management Company · Al Salam Tower, Kuwait
        </p>
      </div>
    </>
  );
}
