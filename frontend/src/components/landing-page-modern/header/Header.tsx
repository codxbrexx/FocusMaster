import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.substring(1);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#0f0f1e]/80 backdrop-blur-md border-b border-white/10 shadow-lg py-2'
          : 'bg-transparent border-b border-transparent shadow-none py-4',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo branding */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 transition-all duration-500 shadow-inner">
              <img src="/fmasterlogosm.png" alt="FocusMaster Logo" className="h-9 w-auto group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent tracking-wide group-hover:to-indigo-300 transition-all duration-500">
              FocusMaster
            </span>
          </a>

          {/* Nav Links with sliding hover background pill */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-4 py-2 text-slate-300 hover:text-white transition-colors duration-300 font-medium text-sm rounded-full"
              >
                <AnimatePresence>
                  {hoveredLink === link.href && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-white/5 border border-white/5 rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className='hover:text-indigo-400 hover:scale-105 transition-all duration-300 text-slate-300' variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all duration-300 hover:scale-105 font-semibold px-6">
              <a href="/register">Sign Up</a>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/90 backdrop-blur-xl border-l-white/10 text-white">
                <div className="flex flex-col space-y-6 pt-12">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-xl text-slate-300 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="border-t border-white/10 pt-6 flex flex-col space-y-4">
                    <Button variant="outline" asChild className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300">
                      <a href="/login">Login</a>
                    </Button>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                      <a href="/register">Sign Up</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
