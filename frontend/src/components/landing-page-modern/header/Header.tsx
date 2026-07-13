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
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'py-3'
          : 'py-5',
      )}
      style={
        isScrolled
          ? {
              background: 'rgba(7,7,16,0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 1px 0 0 rgba(255,255,255,0.03)',
            }
          : {}
      }
    >
      <div className="mx-auto flex items-center justify-between h-[44px] px-5 md:px-8 max-w-[1280px] w-full">
        {/* ── Logo ── */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/fmasterlogosm.png"
            alt="FocusMaster"
            style={{ height: '42px', width: 'auto' }}
          />
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            FocusMaster
          </span>
        </a>

        {/*  Center Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="hidden md:inline-flex"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'color 0.18s, background-color 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right CTAs ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Login — ghost */}
          <a
            href="/login"
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'color 0.18s, background-color 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Log in
          </a>

          {/* Sign Up — sharp filled */}
          <a
            href="/register"
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#6D5EF9',
              textDecoration: 'none',
              border: 'none',
              borderRadius: 0,
              letterSpacing: '0.01em',
              transition: 'background-color 0.18s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7C6EF9')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6D5EF9')}
          >
            Sign Up
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[320px] p-0 border-l border-white/5 bg-[#0a0a14]"
              style={{
                color: '#fff',
              }}
            >
              <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Mobile brand */}
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px', textDecoration: 'none' }}>
                  <img src="/fmasterlogosm.png" alt="FocusMaster" style={{ height: '28px', width: 'auto' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>FocusMaster</span>
                </a>

                {/* Nav links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: 'auto' }}>
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      style={{
                        padding: '10px 12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.65)',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'color 0.18s, background-color 0.18s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                {/* Auth buttons */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href="/login"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      transition: 'border-color 0.18s, color 0.18s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    Log in
                  </a>
                  <a
                    href="/register"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: '#6D5EF9',
                      textDecoration: 'none',
                      border: 'none',
                      borderRadius: 0,
                      transition: 'background-color 0.18s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7C6EF9')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6D5EF9')}
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
