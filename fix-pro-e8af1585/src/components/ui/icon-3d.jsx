import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Icon3D – a small wrapper that adds 3-dimensional hover/tap motion
 * Usage:
 *   <Icon3D size={20} depth={12}><Home className="w-5 h-5" /></Icon3D>
 */
export default function Icon3D({
  children,
  size = 20,
  depth = 12,
  hover = true,
  className,
  ...rest
}) {
  return (
    <motion.div
      className={cn("inline-block perspective-[1000px] transform-gpu", className)}
      style={{ width: size, height: size }}
      {...(hover && {
        whileHover: {
          rotateX: -10,
          rotateY: 12,
          translateZ: depth,
          transition: { type: "spring", stiffness: 300, damping: 22 },
        },
        whileTap: {
          scale: 0.9,
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
        },
      })}
      {...rest}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: 0, rotateY: 0, translateZ: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
