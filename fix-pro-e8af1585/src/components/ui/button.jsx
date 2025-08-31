import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { createRipple } from "@/lib/animationUtils";

import { cn } from "@/lib/utils"
import { buttonTap } from "@/lib/motionPresets"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button
  const [isPressed, setIsPressed] = React.useState(false);
  
  const handleClick = (e) => {
    if (!asChild && !loading) {
      createRipple(e, variant === 'default' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)');
    }
    props.onClick?.(e);
  };
  
  const animationProps = asChild ? {} : {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
    animate: {
      scale: isPressed ? 0.95 : 1,
      filter: loading ? 'blur(1px)' : 'blur(0px)'
    },
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    transition: { type: "spring", stiffness: 400, damping: 25 }
  };
  
  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, className }),
        "relative overflow-hidden",
        loading && "cursor-not-allowed"
      )}
      ref={ref}
      onClick={handleClick}
      disabled={loading || props.disabled}
      {...animationProps}
      {...props}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.span
        animate={{ opacity: loading ? 0 : 1 }}
        className="flex items-center gap-2"
      >
        {props.children}
      </motion.span>
    </Comp>
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
