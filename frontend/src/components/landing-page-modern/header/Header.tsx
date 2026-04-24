import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
];

const Header = () => {
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
        'fixed top-0 left-0 right-0 z-50',
        // when the header is scrolled, add a background and shadow in the starting there has no header background, but when the user scrolls down, it becomes visible with a smooth transition
        'bg-transparent transition-colors duration-100',
        'shadow-none transition-shadow duration-100',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center space-x-3">
            <img src="/fmasterlogosm.png" alt="FocusMaster Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-white">FocusMaster</span>
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-slate-300 hover:text-indigo-400  hover:scale-105 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-2">
            <Button className='hover:underline hover:text-white hover:scale-105 ' variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild className="border border-0.1 border-gray-100 hover:bg-slate-300/25 hover:font-bold text-white hover:text-black hover:scale-105">
              <a href="/register">Sign Up</a>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/80 backdrop-blur-xl border-l-white/10 text-white">
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
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
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
