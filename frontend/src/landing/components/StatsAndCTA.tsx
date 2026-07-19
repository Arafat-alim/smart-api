import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

const STATS = [
  { title: 'No Sign Up', desc: 'Start generating immediately.' },
  { title: 'Nothing Stored', desc: 'Processed in memory only, never written to disk.' },
  { title: 'Deterministic', desc: 'Same input, same output, every time.' },
  { title: 'Zero AI at Runtime', desc: 'Pure parsing and code generation.' },
  { title: '7 Artifacts', desc: 'One upload, one zip.' },
];

export default function StatsAndCTA() {
  return (
    <>
      <section className="lp-section lp-stats-section">
        <div className="lp-container">
          <RevealOnScroll>
            <span className="lp-eyebrow">Built For Developers</span>
          </RevealOnScroll>
          <div className="lp-stats-grid">
            {STATS.map((stat, i) => (
              <RevealOnScroll key={stat.title} delay={i * 0.07} className="lp-stat-item">
                <strong>{stat.title}</strong>
                <span>{stat.desc}</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-final-cta-section">
        <div className="lp-container lp-final-cta">
          <RevealOnScroll>
            <h2 className="lp-heading-2xl">Stop writing API glue code by hand.</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="lp-final-cta-sub">
              Upload a Postman collection and get everything else back in seconds.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <Link to="/app/smart-api" className="lp-btn lp-btn-primary lp-btn-lg">
              Launch Smart API Now →
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
