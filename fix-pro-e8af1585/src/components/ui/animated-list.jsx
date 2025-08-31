import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AnimatedList = React.forwardRef(({ 
  children, 
  className,
  delay = 0.05,
  animateOnScroll = false,
  ...props 
}, ref) => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn("space-y-2", className)}
      variants={listVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <AnimatePresence mode="popLayout">
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={child.key || index}
            variants={itemVariants}
            layout
            layoutId={child.key || `item-${index}`}
            whileHover={{ 
              x: 4,
              transition: { duration: 0.2 }
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

AnimatedList.displayName = "AnimatedList";

// Animated List Item with drag capability
export const AnimatedListItem = React.forwardRef(({ 
  children, 
  className,
  onRemove,
  removable = false,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("relative group", className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
      {removable && (
        <motion.button
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
          onClick={onRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
});

AnimatedListItem.displayName = "AnimatedListItem";

export { AnimatedList };