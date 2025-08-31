import * as React from "react"
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, pulse = false, animate = true, count, ...props }) {
  const [prevCount, setPrevCount] = React.useState(count);
  
  React.useEffect(() => {
    if (count !== prevCount) {
      setPrevCount(count);
    }
  }, [count, prevCount]);
  
  const content = count !== undefined ? count : props.children;
  
  if (!animate) {
    return (
      <div className={cn(badgeVariants({ variant }), className)} {...props}>
        {content}
      </div>
    );
  }
  
  return (
    <motion.div
      className={cn(badgeVariants({ variant }), "relative", className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {count !== undefined && count !== prevCount && (
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.span>
        )}
        {count === undefined && content}
      </AnimatePresence>
      
      {pulse && (
        <motion.span
          className="absolute -inset-1 rounded-md bg-current opacity-25"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.25, 0, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  );
}

export { Badge, badgeVariants }
