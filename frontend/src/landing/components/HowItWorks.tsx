import RevealOnScroll from './RevealOnScroll';

const STEPS = [
  { title: 'Upload Collection', desc: 'Drop in a Postman v2.1 collection (JSON).' },
  { title: 'Validate Against Schema', desc: "Checked against Postman's official v2.1 JSON Schema." },
  { title: 'Parse Endpoints & Auth', desc: 'Folders flattened, auth resolved per endpoint, base URL detected.' },
  { title: 'Classify Each Endpoint', desc: 'REST, Webhook, WebSocket, or SOAP — tagged automatically.' },
  { title: 'Generate & Zip', desc: '7 artifacts generated and bundled into one downloadable zip.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="lp-section lp-timeline-section">
      <div className="lp-container">
        <RevealOnScroll>
          <span className="lp-eyebrow">The Pipeline</span>
          <h2 className="lp-heading-xl">From upload to zip in five steps.</h2>
        </RevealOnScroll>

        <ol className="lp-timeline">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.title} delay={i * 0.08} className="lp-timeline-item">
              <li>
                <span className="lp-timeline-marker">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="lp-timeline-title">{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </li>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}
