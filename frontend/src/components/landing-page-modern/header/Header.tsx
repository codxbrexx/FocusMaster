import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
          ? 'bg-[#0f0f1e]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-2'
          : 'bg-transparent border-b border-transparent shadow-none py-4',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Flat logo and brand name */}
          <a href="/" className="flex items-center space-x-3">
            <img src="/fmasterlogosm.png" alt="FocusMaster Logo" className="h-9 w-auto" />
            <span className="text-xl font-bold text-white tracking-tight">
              FocusMaster
            </span>
          </a>

          {/* Clean, high-contrast links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-slate-400 hover:text-white transition-colors duration-200 font-semibold text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Clean solid action buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Button className='text-slate-400 hover:text-white transition-colors duration-200 font-semibold text-sm' variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors border-0">
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
              <SheetContent side="right" className="bg-[#0f0f1e] border-l-white/10 text-white">
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
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
