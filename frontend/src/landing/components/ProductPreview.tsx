import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  children: ReactNode;
  label?: string;
  float?: boolean;
}

export default function ProductPreview({ children, label = 'smartapi.dev', float = false }: Props) {
  const reduceMotion = useReducedMotion();
  const frame = (
    <div className="lp-preview">
      <div className="lp-preview-chrome">
        <span className="lp-preview-dot lp-preview-dot--red" />
        <span className="lp-preview-dot lp-preview-dot--yellow" />
        <span className="lp-preview-dot lp-preview-dot--green" />
        <span className="lp-preview-url">{label}</span>
      </div>
      <div className="lp-preview-body">{children}</div>
    </div>
  );

  if (!float || reduceMotion) return frame;

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {frame}
    </motion.div>
  );
}
