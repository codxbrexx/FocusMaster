// GSAP Timing Configurations
export const GSAP_TIMINGS = {
  heroTextBlur: 2.2,
  heroStagger: 0.1,
  statsCounterDuration: 2,
  cardsStagger: 0.1,
  commandCellDelay: 1,
  floatingDuration: 3,
};

// Three.js Scene Configuration
export const SCENE_CONFIG = {
  cameraFOV: 35,
  cameraZ: 60,
  rotationSpeed: 0.25,
  mouseTrackingIntensity: 0.4,
  lightIntensity: 0.4,
  spotLightIntensity: 3,
};

// Color Theme for 3D Objects
export const THEME_3D = {
  liquidColor: '#020202',
  liquidColorLight: '#05050b',
  monolithColor: '#0a0a0a',
  glowColor: '#7c3aed', // Purple
  accentColor: '#06b6d4', // Cyan
  gridColor: '#1a1a2e',
};

// Responsive Breakpoints (px)
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 },
  },
};

// Stagger Container for Multiple Children
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stat Card Animations
export const STAT_CARD_ANIMATION = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
