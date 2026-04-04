/**
 * Centralized animation configuration for consistent motion throughout the app
 * All animations follow these standardized patterns for professional, cohesive feel
 */

import type { Variants } from 'framer-motion';


export const SPRING_SMOOTH = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
} as const;

export const SPRING_SMOOTH_BOUNCY = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
} as const;


export const DURATIONS = {
  quick: 0.15,        // Exit/collapse animations
  normal: 0.2,        // Quick interactions (expand, icon changes)
  moderate: 0.35,     // Modal/dropdown entrance
  standard: 0.5,      // Page section entrance
  slow: 0.8,          // Large container entrance
  verySlow: 1.5,      // Progress bars, complex visual transitions
} as const;

export const STAGGER = {
  contact: 0.05,  // Tight spacing for list items
  standard: 0.08, // Default container stagger
  loose: 0.1,     // Loose spacing for major sections
} as const;


export const EASING = {
  easeOut: [0.16, 1, 0.3, 1],  // Standard ease-out
  circOut: 'circOut',            // Circular easing for progress animations
  easeInOut: 'easeInOut',        // Smooth both directions
} as const;

/**
 * Fade + Slide Up entrance
 * Used for: Hero text, form inputs, card sections
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Fade + Slide Down entrance
 * Used for: Dropdowns, menus, notifications
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Fade + Slide Left entrance
 * Used for: Sidebar, side panels
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0 },
};

/**
 * Fade + Slide Right entrance
 * Used for: Right-aligned panels, slide-in modals
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0 },
};

/**
 * Scale + Fade entrance
 * Used for: Modals, cards, focus highlights
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

/**
 * Simple fade
 * Used for: Icon changes, color transitions
 */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/**
 * Height expand animation for accordion/collapsible content
 * Note: Requires layoutId for smooth transitions
 */
export const expandHeight: Variants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
};


/**
 * Standard container with staggered children
 * Used for: Lists, grids, batch animations
 */
export const containerStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.standard,
      delayChildren: 0.1,
    },
  },
};

/**
 * Tight stagger for compact lists
 * Used for: Task lists, compact navigation items
 */
export const containerTightStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.contact,
      delayChildren: 0.05,
    },
  },
};

/**
 * Hero/Section entrance with loose stagger
 * Used for: Page headings, major section titles
 */
export const containerLooseStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.loose,
      delayChildren: 0.1,
    },
  },
};



/**
 * Standard transition config for most animations
 */
export const transitionStandard = {
  duration: DURATIONS.normal,
  ...SPRING_SMOOTH,
};

/**
 * Quick transition for interactive elements
 */
export const transitionQuick = {
  duration: DURATIONS.quick,
  ...SPRING_SMOOTH,
};

/**
 * Moderate transition for modals/larger content
 */
export const transitionModerate = {
  duration: DURATIONS.moderate,
  ...SPRING_SMOOTH,
};

/**
 * Slow transition for page sections
 */
export const transitionSlow = {
  duration: DURATIONS.standard,
  ...SPRING_SMOOTH,
};

/**
 * Very slow transition for progress bars
 */
export const transitionProgressBar = {
  duration: DURATIONS.verySlow,
  ease: EASING.circOut,
};



/**
 * Entrance animation for cards/modals
 */
export const animationCardEntrance = {
  initial: scaleIn.hidden,
  animate: scaleIn.show,
  transition: transitionModerate,
};

/**
 * Entrance animation for page sections
 */
export const animationPageSection = {
  initial: fadeInUp.hidden,
  animate: fadeInUp.show,
  transition: transitionSlow,
};

/**
 * Entrance animation for dropdown/menu
 */
export const animationDropdown = {
  initial: fadeInDown.hidden,
  animate: fadeInDown.show,
  transition: transitionQuick,
};

/**
 * Entrance animation for sidebar
 */
export const animationSidebar = {
  initial: fadeInLeft.hidden,
  animate: fadeInLeft.show,
  transition: transitionModerate,
};


/**
 * Subtle hover scale for interactive elements
 */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

/**
 * Minimal hover scale for cards
 */
export const hoverScaleSubtle = {
  whileHover: { scale: 1.005 },
};

/**
 * Lift effect on hover (used for cards)
 */
export const hoverLift = {
  whileHover: { y: -4 },
};
