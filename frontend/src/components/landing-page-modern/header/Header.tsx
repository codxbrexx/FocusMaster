import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-background/80 backdrop-blur-sm border-b border-black/10'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img src="/fmasterlogo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-foreground">FocusMaster</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </a>
            <a
              href="/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
