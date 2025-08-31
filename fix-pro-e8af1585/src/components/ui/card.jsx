import * as React from "react"
import { motion } from "framer-motion"
import { useHoverAnimation } from "@/lib/animationUtils"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, hover3d = false, interactive = true, ...props }, ref) => {
  const { props: animProps, bind } = useHoverAnimation();
  
  if (hover3d && interactive) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow",
          "transform-gpu perspective-1000",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          ...animProps
        }}
        whileHover={{
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          transition: { duration: 0.3 }
        }}
        {...bind}
        {...props}
      />
    );
  }
  
  if (interactive) {
    return (
      <motion.div
        ref={ref}
        className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
        whileHover={{
          y: -4,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        {...props}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
