import RevealOnScroll from './RevealOnScroll';

const FEATURES = [
  {
    title: 'REST, Webhook, WebSocket & SOAP — auto-classified',
    desc: 'Every endpoint is tagged by protocol, headers, body shape, and naming pattern. No manual labeling.',
    size: 'lp-bento-lg',
  },
  {
    title: 'Auth detection',
    desc: 'Bearer, Basic, API Key, OAuth2, and more — detected per endpoint, inherited from the collection when needed.',
    size: '',
  },
  {
    title: 'Official schema validation',
    desc: "Every upload is checked against Postman's own v2.1 JSON Schema before anything is generated.",
    size: '',
  },
  {
    title: 'Base URL, your way',
    desc: 'Auto-detected from the collection, or set your own override.',
    size: '',
  },
  {
    title: '7 artifacts, 1 zip',
    desc: 'Docs, SDK, types, OpenAPI spec, cURL examples, React hooks, and a mock server — bundled together.',
    size: '',
  },
  {
    title: 'Zero AI at runtime',
    desc: 'Every artifact comes from deterministic parsing and code generation. Same input, same output, always.',
    size: 'lp-bento-lg',
  },
];

export default function BentoFeatures() {
  return (
    <section id="features" className="lp-section lp-bento">
      <div className="lp-container">
        <RevealOnScroll>
          <span className="lp-eyebrow">Capabilities</span>
          <h2 className="lp-heading-xl lp-bento-heading">Built to actually understand your API.</h2>
        </RevealOnScroll>

        <div className="lp-bento-grid">
          {FEATURES.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 0.07} className={`lp-bento-card ${f.size}`}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
