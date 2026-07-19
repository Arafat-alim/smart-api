import RevealOnScroll from './RevealOnScroll';

const PROBLEMS = [
  {
    n: '01',
    title: 'Docs go stale',
    desc: 'Hand-written API docs drift from the real endpoints within a week.',
  },
  {
    n: '02',
    title: 'SDKs copied by hand',
    desc: 'Every new endpoint means another manually written fetch or axios wrapper.',
  },
  {
    n: '03',
    title: 'No mock server',
    desc: 'Frontend work stalls waiting on a backend that is not ready yet.',
  },
  {
    n: '04',
    title: 'Auth and API type, untracked',
    desc: 'Nothing flags which endpoints need auth, or what kind of API they even are.',
  },
];

export default function ProblemSection() {
  return (
    <section className="lp-section lp-problem">
      <div className="lp-container">
        <RevealOnScroll>
          <span className="lp-eyebrow">The Problem</span>
          <h2 className="lp-heading-xl lp-problem-heading">Writing API glue code is still manual.</h2>
        </RevealOnScroll>

        <div className="lp-problem-grid">
          {PROBLEMS.map((p, i) => (
            <RevealOnScroll
              key={p.n}
              delay={i * 0.1}
              className={i === 0 || i === 3 ? 'lp-problem-card lp-problem-card--wide' : 'lp-problem-card'}
            >
              <span className="lp-problem-num">{p.n}</span>
              <h3 className="lp-problem-title">{p.title}</h3>
              <p>{p.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
