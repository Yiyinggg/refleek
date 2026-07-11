import {
  ACCENT,
  FEATURES,
  IMPACT,
  NAV_LINKS,
  PROBLEM_STATS,
  PRODUCTS,
  SOLUTION_FLOW,
  SWATCH_STRIP,
  WORKFLOW_CHAIN,
} from "./landingData";
import { ImageSlot } from "./ImageSlot";

function CtaArrow() {
  return <span style={{ color: ACCENT }}>→</span>;
}

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__header">
        <a href="#top" className="landing__brand">
          <span className="landing__brand-name">ReFleek</span>
          <span className="landing__brand-reg" aria-hidden="true">
            ®
          </span>
        </a>
        <nav className="landing__nav" aria-label="Page sections">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="landing__nav-link">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="/studio/" className="landing__cta landing__cta--dark">
          Start workflow <CtaArrow />
        </a>
      </header>

      <section id="top" className="landing__section landing__hero">
        <div className="landing__issue-bar">
          <span>Circular Design — to — Production</span>
          <span>Issue Nº01 · Deadstock Edition</span>
        </div>

        <div className="landing__hero-grid">
          <div>
            <p className="landing__eyebrow landing__eyebrow--accent">
              ◆ ReFleek — the circular workflow for Fleek&apos;s ecosystem
            </p>
            <h1 className="landing__hero-title">
              Turn circular
              <br />
              materials into
              <br />
              <em>new products.</em>
            </h1>
          </div>
          <div className="landing__hero-aside">
            <p className="landing__lede">
              Choose a product, select deadstock or reclaimed secondhand
              materials, design the surface, render the result, and generate a
              tech pack for production partners.
            </p>
            <div className="landing__cta-row">
              <a href="/studio/" className="landing__cta landing__cta--dark">
                Start a workflow <CtaArrow />
              </a>
              <a
                href="#ecosystem"
                className="landing__cta landing__cta--outline"
              >
                See the model
              </a>
            </div>
          </div>
        </div>

        <div className="landing__swatch-strip">
          {SWATCH_STRIP.map((w) => (
            <div
              key={w.name}
              className="landing__swatch"
              style={{
                background: w.bg,
                backgroundImage: w.img,
                backgroundSize: w.size,
              }}
            >
              <span
                className="landing__swatch-label"
                style={{ color: w.label }}
              >
                {w.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="problem" className="landing__section landing__section--sand">
        <p className="landing__section-label">The problem — Nº01</p>
        <div className="landing__split">
          <h2 className="landing__section-title">
            Deadstock fabric and unresellable garments hold{" "}
            <em>real material value</em> — but no route to production.
          </h2>
          <div>
            <p className="landing__body">
              Fleek already moves secondhand fashion through global resale. But
              not every garment can be resold — some are too damaged, low-value,
              or too inconsistent. The fabric, though, is still good.
            </p>
            <p className="landing__body">
              Meanwhile, factories sit on overordered and cancelled fabric
              rolls. Both are disconnected from the designers and makers who
              could use them.
            </p>
          </div>
        </div>
        <div className="landing__stat-grid">
          {PROBLEM_STATS.map((p) => (
            <div key={p.v} className="landing__stat">
              <div className="landing__stat-val">{p.v}</div>
              <div className="landing__stat-key">{p.k}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="solution" className="landing__section">
        <p className="landing__section-label landing__section-label--accent">
          The solution — Nº02
        </p>
        <h2 className="landing__section-title landing__section-title--wide">
          A structured design-to-production workflow,{" "}
          <em>circular by default.</em>
        </h2>
        <p className="landing__body landing__body--wide">
          Most AI design tools start with a blank canvas. ReFleek starts with
          real material constraints — what you want to make, what circular stock
          is available, and what production partners can actually build.
        </p>
        <div className="landing__flow">
          {SOLUTION_FLOW.map((f) => (
            <div key={f.n} className="landing__flow-card">
              <div className="landing__flow-num">{f.n}</div>
              <div className="landing__flow-name">{f.name}</div>
              <p className="landing__flow-desc">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="landing__pitch-line">
          <span className="landing__pitch-label">Pitch line —</span>
          <span className="landing__pitch-text">
            From leftover material to manufacturable product.
          </span>
        </div>
      </section>

      <section
        id="features"
        className="landing__section landing__section--dark"
      >
        <div className="landing__features-head">
          <p className="landing__section-label landing__section-label--accent">
            Core features — Nº03
          </p>
          <p className="landing__features-sub">
            A node workflow, not a chatbot
          </p>
        </div>
        <h2 className="landing__section-title landing__section-title--dark">
          Eight guided nodes, <em>brief to factory.</em>
        </h2>
        <div className="landing__feature-grid">
          {FEATURES.map((f) => (
            <div key={f.n} className="landing__feature-card">
              <div className="landing__feature-head">
                <span className="landing__feature-num">{f.n}</span>
                <span className="landing__feature-rule" />
              </div>
              <h3 className="landing__feature-name">{f.name}</h3>
              <p className="landing__feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ecosystem" className="landing__section">
        <p className="landing__section-label landing__section-label--accent">
          The ecosystem — Nº04
        </p>
        <div className="landing__split landing__split--ecosystem">
          <h2 className="landing__section-title">
            How ReFleek connects <em>material to maker.</em>
          </h2>
          <p className="landing__body">
            Two circular sources feed one material pool. ReFleek turns that pool
            into designs and tech packs, then routes production to Fleek-linked
            partners in India and Pakistan.
          </p>
        </div>

        <div className="landing__map">
          <div className="landing__map-row">
            <div className="landing__map-col">
              <p className="landing__map-label">01 · Circular sources</p>
              <div className="landing__map-card">
                <p className="landing__map-tag">New deadstock</p>
                <p className="landing__map-title">
                  Factories · Mills · Brands · Suppliers
                </p>
                <div className="landing__map-inline">
                  <span className="landing__fabric-swatch landing__fabric-swatch--deadstock" />
                  <span>Overordered &amp; cancelled fabric rolls</span>
                </div>
              </div>
              <div className="landing__map-card">
                <p className="landing__map-tag">Reclaimed secondhand</p>
                <p className="landing__map-title">
                  Fleek sorting centres · India &amp; Pakistan
                </p>
                <div className="landing__map-chain">
                  <span>Unresellable garments</span>
                  <span className="landing__arrow">→</span>
                  <span>Deconstruct</span>
                  <span className="landing__arrow">→</span>
                  <span className="landing__map-inline">
                    <span className="landing__fabric-swatch landing__fabric-swatch--reclaimed" />
                    Reclaimed fabric
                  </span>
                </div>
              </div>
            </div>

            <span className="landing__map-arrow" aria-hidden="true">
              →
            </span>

            <div className="landing__map-col">
              <p className="landing__map-label">02 · ReFleek</p>
              <div className="landing__map-card landing__map-card--dark">
                <p className="landing__map-tag">◆ Material resource pool</p>
                <p className="landing__map-title landing__map-title--lg">
                  One pool, two circular inputs
                </p>
                <p className="landing__map-body">
                  Both sources land as design-ready stock — with quantity,
                  dimensions, colour and best-use tagged for the AI.
                </p>
              </div>
            </div>

            <span className="landing__map-arrow" aria-hidden="true">
              →
            </span>

            <div className="landing__map-col">
              <p className="landing__map-label">03 · Node workflow</p>
              <div className="landing__map-card landing__map-card--workflow">
                {WORKFLOW_CHAIN.map((w) => (
                  <div key={w} className="landing__workflow-step">
                    <span className="landing__workflow-dot" />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="landing__map-output">
            <div className="landing__map-card">
              <p className="landing__map-label">04 · Production</p>
              <p className="landing__map-title">
                India / Pakistan production partners
              </p>
              <p className="landing__map-meta">
                Sewing units · Embroidery studios · Patchwork makers ·
                Micro-factories — close to where material is processed.
              </p>
            </div>
            <span className="landing__map-arrow" aria-hidden="true">
              →
            </span>
            <div className="landing__map-card landing__map-card--dark">
              <p className="landing__map-tag">05 · Output</p>
              <p className="landing__map-title landing__map-title--lg">
                Finished small-batch product
              </p>
            </div>
          </div>

          <div className="landing__legend">
            <span>
              <span className="landing__fabric-swatch landing__fabric-swatch--deadstock" />
              Deadstock roll
            </span>
            <span>
              <span className="landing__fabric-swatch landing__fabric-swatch--reclaimed" />
              Reclaimed panel
            </span>
            <span>
              <span className="landing__legend-dot" />
              ReFleek layer
            </span>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="landing__section landing__section--sand"
      >
        <div className="landing__features-head">
          <p className="landing__section-label landing__section-label--accent">
            Made with ReFleek — Nº05
          </p>
          <p className="landing__products-hint">
            Drop your renders onto any tile ↓
          </p>
        </div>
        <h2 className="landing__section-title">
          Real products from <em>circular stock.</em>
        </h2>
        <div className="landing__product-grid">
          {PRODUCTS.map((p) => (
            <article key={p.slotId} className="landing__product">
              <div className="landing__product-media">
                <ImageSlot id={p.slotId} placeholder={p.ph} />
                <span
                  className="landing__product-tag"
                  style={{ background: p.tagBg, color: p.tagFg }}
                >
                  {p.source}
                </span>
              </div>
              <div className="landing__product-body">
                <h3 className="landing__product-name">{p.name}</h3>
                <dl className="landing__product-meta">
                  <div>
                    <dt>Material</dt>
                    <dd>{p.material}</dd>
                  </div>
                  <div>
                    <dt>Technique</dt>
                    <dd>{p.technique}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing__section landing__section--dark landing__final">
        <div className="landing__impact-grid">
          {IMPACT.map((i) => (
            <div key={i.v} className="landing__impact-cell">
              <div className="landing__impact-val">{i.v}</div>
              <div className="landing__impact-key">{i.k}</div>
            </div>
          ))}
        </div>

        <p className="landing__section-label landing__section-label--accent">
          Final pitch
        </p>
        <p className="landing__final-pitch">
          ReFleek turns material that would sit unused or fail resale into{" "}
          <em>manufacturable small-batch products.</em>
        </p>
        <div className="landing__cta-row">
          <a href="/studio/" className="landing__cta landing__cta--light">
            Start a workflow <CtaArrow />
          </a>
          <a href="#ecosystem" className="landing__cta landing__cta--ghost">
            Review the model
          </a>
        </div>

        <footer className="landing__footer">
          <div className="landing__footer-brand">
            <span className="landing__footer-name">ReFleek</span>
            <span className="landing__footer-reg" aria-hidden="true">
              ®
            </span>
          </div>
          <p className="landing__footer-tag">
            Circular design-to-production · Built for Fleek&apos;s ecosystem
          </p>
        </footer>
      </section>
    </div>
  );
}
