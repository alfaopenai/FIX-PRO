import { forwardRef } from "react";
import { motion } from "framer-motion";

// Generic motion-enabled div which accepts variants & motion props transparently
const MotionDiv = forwardRef(({ variants, initial="hidden", animate="visible", exit, children, ...rest }, ref) => (
  <motion.div
    ref={ref}
    variants={variants}
    initial={initial}
    animate={animate}
    exit={exit}
    {...rest}
  >
    {children}
  </motion.div>
));

MotionDiv.displayName = "MotionDiv";

export default MotionDiv;
