interface Props {
  color?: string;
  top?: string;
  left?: string;
  right?: string;
  size?: number;
}

export default function BackgroundGlow({ color = 'var(--lp-indigo)', top, left, right, size = 480 }: Props) {
  return (
    <div
      className="lp-glow"
      style={{
        top,
        left,
        right,
        width: size,
        height: size,
        background: color,
        opacity: 0.18,
      }}
      aria-hidden="true"
    />
  );
}
