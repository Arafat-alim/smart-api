import ProductPreview from './ProductPreview';
import ResultsScreenMock from './ResultsScreenMock';
import RevealOnScroll from './RevealOnScroll';

export default function Walkthrough() {
  return (
    <section className="lp-section lp-walkthrough">
      <div className="lp-container">
        <RevealOnScroll>
          <span className="lp-eyebrow">See It Work</span>
          <h2 className="lp-heading-xl">One dashboard for every endpoint.</h2>
          <p className="lp-walkthrough-sub">
            Every endpoint's method, path, detected API type, and auth requirement — laid out the moment
            generation finishes.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.15}>
          <ProductPreview label="smartapi.dev/app/smart-api">
            <ResultsScreenMock />
          </ProductPreview>
        </RevealOnScroll>
      </div>
    </section>
  );
}
