import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(href.substring(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed z-50 transition-all duration-500 ease-in-out left-0 right-0 mx-auto flex items-center',
        isScrolled
          ? 'top-4 w-[92%] max-w-[1000px] rounded-full py-2.5 px-6'
          : 'top-0 w-full max-w-full py-6 px-6 md:px-16 lg:px-24'
      )}
      style={
        isScrolled
          ? {
              background: 'rgba(248, 249, 252, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(15,23,42,0.1)',
              boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
            }
          : {
              background: 'transparent',
              border: '1px solid transparent',
            }
      }
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* ── Logo ── */}
        <a
          href="/"
          className="flex items-center gap-0.5 transition-opacity hover:opacity-80"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="/FM_logo.png"
            alt="FocusMaster"
            className="w-auto h-10 md:h-11 object-contain"
          />
          <span className="text-[15px] md:text-base font-bold text-slate-900 tracking-tight">
            FocusMaster
          </span>
        </a>

        {/* ── Center Nav ── */}
        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 rounded-full transition-all duration-300 hover:bg-slate-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Log in
          </a>
          <a
            href="/register"
            className="group relative flex items-center justify-center px-5 py-2.5 text-[13px] font-bold text-white transition-all overflow-hidden rounded-full shadow-lg hover:shadow-indigo-500/25"
            style={{
              background: 'linear-gradient(135deg, #6D5EF9 0%, #8B7CF6 100%)',
            }}
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 tracking-wide">Sign Up</span>
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation menu"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[320px] p-0 border-l border-slate-200 bg-white/95 backdrop-blur-2xl"
            >
              <div className="flex flex-col h-full p-8">
                {/* Mobile brand */}
                <a href="/" className="flex items-center gap-3 mb-12">
                  <img src="/FM_logo.png" alt="FocusMaster" className="h-10 w-auto" />
                  <span className="text-[15px] font-bold text-slate-900 tracking-tight">FocusMaster</span>
                </a>

                {/* Nav links */}
                <nav className="flex flex-col gap-2 mb-auto">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                {/* Auth buttons */}
                <div className="flex flex-col gap-3 pt-8 border-t border-slate-200">
                  <a
                    href="/login"
                    className="w-full text-center py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl transition-all"
                  >
                    Log in
                  </a>
                  <a
                    href="/register"
                    className="w-full text-center py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #6D5EF9 0%, #8B7CF6 100%)',
                    }}
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
