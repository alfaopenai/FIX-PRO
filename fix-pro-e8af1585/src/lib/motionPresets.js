// Motion presets for consistent animations across the app

// Basic animations
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1
    } 
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.3, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export const slideX = (direction = 1) => ({
  hidden: { opacity: 0, x: 24 * direction },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
});

export const slideY = (direction = 1) => ({
  hidden: { opacity: 0, y: 24 * direction },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
});

// Stagger animations
export const staggerChildren = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1
    } 
  }
};

export const staggerFast = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.04,
      delayChildren: 0.05
    } 
  }
};

// Interactive animations
export const buttonTap = {
  whileTap: { 
    scale: 0.95, 
    transition: { 
      duration: 0.1,
      ease: "easeOut"
    } 
  },
  whileHover: { 
    scale: 1.02, 
    transition: { 
      duration: 0.2,
      ease: "easeOut"
    } 
  }
};

export const cardHover = {
  whileHover: { 
    y: -4,
    scale: 1.02,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  whileTap: { 
    scale: 0.98,
    transition: { 
      duration: 0.1
    }
  }
};

export const tableRowHover = {
  whileHover: { 
    y: -2,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    transition: { 
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { 
    opacity: 0, 
    x: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    scale: 0.98,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Loading animations
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const shimmer = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Notification animations
export const notificationSlide = {
  initial: { 
    opacity: 0, 
    y: -50,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -50,
    scale: 0.9,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const modalContent = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// List animations
export const listItem = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Chart animations
export const chartBar = {
  initial: { 
    scaleY: 0,
    opacity: 0
  },
  animate: { 
    scaleY: 1,
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Form animations
export const formField = {
  initial: { 
    opacity: 0, 
    y: 10
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Status animations
export const statusPulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress animations
export const progressFill = {
  initial: { 
    scaleX: 0
  },
  animate: { 
    scaleX: 1,
    transition: { 
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};
