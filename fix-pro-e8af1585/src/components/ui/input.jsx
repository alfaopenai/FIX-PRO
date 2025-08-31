import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, error, success, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };
  
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };
  
  return (
    <div className="relative w-full">
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          boxShadow: isFocused 
            ? error 
              ? "0 0 0 3px rgba(239, 68, 68, 0.2)" 
              : success 
              ? "0 0 0 3px rgba(34, 197, 94, 0.2)"
              : "0 0 0 3px rgba(59, 130, 246, 0.2)"
            : "none",
          scale: isFocused ? 1.01 : 1
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <input
        type={type}
        className={cn(
          "relative flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isFocused && "border-transparent",
          error && "border-red-500 text-red-900",
          success && "border-green-500",
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      <AnimatePresence>
        {isFocused && props.placeholder && (
          <motion.label
            className="absolute left-3 -top-2 px-1 text-xs font-medium text-primary bg-background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {props.placeholder}
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
})
Input.displayName = "Input"

export { Input }
