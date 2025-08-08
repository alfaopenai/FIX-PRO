// Advanced animation utilities for micro-interactions and effects
import React from 'react';
import { useSpring, animated } from '@react-spring/web';

// Easing functions for smooth animations
export const easings = {
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  springy: 'cubic-bezier(0.43, 0.195, 0.02, 1.3)',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Advanced hover effects
export const hoverEffects = {
  lift: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2, ease: easings.easeOutQuart }
  },
  glow: {
    scale: 1.01,
    filter: 'brightness(1.1)',
    transition: { duration: 0.3, ease: easings.easeOutQuart }
  },
  tilt: {
    rotateY: 5,
    rotateX: -2,
    scale: 1.02,
    transition: { duration: 0.3, ease: easings.springy }
  },
  magnetic: {
    scale: 1.05,
    transition: { duration: 0.4, ease: easings.bouncy }
  }
};

// Press effects
export const pressEffects = {
  scale: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  depth: {
    scale: 0.97,
    filter: 'brightness(0.95)',
    transition: { duration: 0.1 }
  },
  squish: {
    scaleX: 0.98,
    scaleY: 0.96,
    transition: { duration: 0.1 }
  }
};

// Loading animation variants
export const loadingVariants = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [0.98, 1.02, 0.98],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  skeleton: {
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Notification animations
export const notificationVariants = {
  success: {
    initial: { opacity: 0, y: -20, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: easings.springy
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  },
  error: {
    initial: { opacity: 0, x: 50, scale: 0.9 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 0.4,
        scale: {
          times: [0, 0.5, 1],
          duration: 0.4
        }
      }
    },
    exit: { opacity: 0, x: 50, scale: 0.9 }
  }
};

// Create ripple effect for buttons
export const createRipple = (event, color = 'rgba(255, 255, 255, 0.5)') => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.backgroundColor = color;
  ripple.classList.add('ripple');

  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
};

// Custom hooks for animations
export const useHoverAnimation = (config = {}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [props, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    config: { tension: 300, friction: 20, ...config }
  }));

  const handleMouseEnter = () => {
    setIsHovered(true);
    api.start({
      scale: 1.05,
      y: -5
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    api.start({
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0
    });
  };

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    api.start({
      rotateY: x / 20,
      rotateX: -y / 20
    });
  };

  return {
    props,
    bind: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove
    }
  };
};

// Stagger children with advanced timing
export const staggerAdvanced = (delay = 0.05, config = {}) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.1,
      ...config
    }
  }
});

// Smooth number transitions
export const useCountAnimation = (value, duration = 1000) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  
  React.useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    
    const updateValue = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(Math.round(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }, [value, duration]);
  
  return displayValue;
};