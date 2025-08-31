import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({ className, variant = "default", ...props }) {
  const shimmerVariants = {
    default: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    },
    pulse: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wave: {
      scaleX: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (variant === "shimmer") {
    return (
      <motion.div
        className={cn(
          "rounded-md bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]",
          className
        )}
        animate={shimmerVariants.default}
        {...props}
      />
    );
  }

  return (
    <motion.div
      className={cn("rounded-md bg-gray-800", className)}
      animate={shimmerVariants[variant] || shimmerVariants.pulse}
      {...props}
    />
  );
}

export { Skeleton }