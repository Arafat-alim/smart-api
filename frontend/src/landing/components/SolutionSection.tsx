import RevealOnScroll from './RevealOnScroll';

const STEPS = [
  {
    n: '01',
    title: 'Upload Collection',
    desc: 'Drop your Postman v2.1 collection (JSON).',
  },
  {
    n: '02',
    title: 'Auto-Validate & Parse',
    desc: 'Checked against the official schema, then flattened into endpoints.',
  },
  {
    n: '03',
    title: 'Classify Each Endpoint',
    desc: 'REST, Webhook, WebSocket, or SOAP — detected automatically.',
  },
  {
    n: '04',
    title: 'Generate 7 Artifacts',
    desc: 'Docs, SDK, types, OpenAPI, cURL, hooks, and a mock server — all at once.',
  },
];

const SPOKES = ['API Docs', 'SDK', 'cURL', 'React Hooks', 'Types', 'OpenAPI', 'Mock Server'];

const DIAGRAM_SIZE = 480;
const CENTER = DIAGRAM_SIZE / 2;
const RADIUS = 195;

function spokePosition(i: number, total: number) {
  const angle = (i * (360 / total) - 90) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

export default function SolutionSection() {
  return (
    <section className="lp-section lp-solution">
      <div className="lp-container">
        <RevealOnScroll>
          <span className="lp-eyebrow">The Solution</span>
          <h2 className="lp-heading-xl">Upload once. Everything else is generated.</h2>
        </RevealOnScroll>

        <div className="lp-grid-2 lp-solution-grid">
          <div className="lp-solution-steps">
            {STEPS.map((s, i) => (
              <RevealOnScroll key={s.n} delay={i * 0.1} className="lp-solution-step">
                <span className="lp-solution-step-num">{s.n}</span>
                <h3 className="lp-solution-step-title">{s.title}</h3>
                <p>{s.desc}</p>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.2}>
            <div className="lp-diagram" role="img" aria-label="Smart API generates API Docs, SDK, cURL, React Hooks, Types, OpenAPI, and Mock Server from a single upload">
              <svg className="lp-diagram-svg" viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`} aria-hidden="true">
                {SPOKES.map((label, i) => {
                  const { x, y } = spokePosition(i, SPOKES.length);
                  return (
                    <line
                      key={label}
                      x1={CENTER}
                      y1={CENTER}
                      x2={x}
                      y2={y}
                      stroke="var(--lp-border-soft)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              <div className="lp-diagram-center">
                <span>Smart API</span>
              </div>

              {SPOKES.map((label, i) => {
                const { x, y } = spokePosition(i, SPOKES.length);
                const left = (x / DIAGRAM_SIZE) * 100;
                const top = (y / DIAGRAM_SIZE) * 100;
                return (
                  <div
                    key={label}
                    className="lp-diagram-node"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
