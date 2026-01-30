'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: 'en' | 'de') => {
    router.replace(pathname, { locale: newLocale });
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  const navLinks = [
    { href: '/#how-it-works', label: t('howItWorks') },
    { href: '/pricing', label: t('pricing') },
    { href: '/faq', label: t('faq') },
    { href: '/contact', label: t('bookDemo') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-[#D8420E]/20'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      suppressHydrationWarning
    >
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0D2556] via-[#D8420E] to-[#0D2556]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Industrial design */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative flex h-12 w-12 items-center justify-center bg-[#0D2556]"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-[#D8420E]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-[#D8420E]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-[#D8420E]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-[#D8420E]" />

              <Package className="h-6 w-6 text-white" strokeWidth={2.5} />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#0D2556] uppercase tracking-tight leading-none group-hover:text-[#D8420E] transition-colors">
                Blue
                <span className="text-[#D8420E] group-hover:text-[#0D2556]">Logistic</span>
              </span>
              <span className="text-[8px] font-bold text-[#64748B] uppercase tracking-[0.15em] leading-none mt-0.5">
                European Shipping
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-bold text-[#64748B] hover:text-[#0D2556] transition-colors uppercase tracking-wider group"
              >
                {link.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D8420E]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher - Industrial style */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1">
              <button
                onClick={() => switchLocale('en')}
                className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  locale === 'en'
                    ? 'bg-[#0D2556] text-white'
                    : 'text-[#64748B] hover:bg-white'
                }`}
              >
                EN
                {locale === 'en' && (
                  <motion.div
                    layoutId="activeLocale"
                    className="absolute inset-0 bg-[#0D2556]"
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
              <div className="w-px h-4 bg-[#E2E8F0]" />
              <button
                onClick={() => switchLocale('de')}
                className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  locale === 'de'
                    ? 'bg-[#0D2556] text-white'
                    : 'text-[#64748B] hover:bg-white'
                }`}
              >
                DE
                {locale === 'de' && (
                  <motion.div
                    layoutId="activeLocale"
                    className="absolute inset-0 bg-[#0D2556]"
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            </div>

            <Link
              href="http://localhost:3000/login"
              className="px-4 py-2 text-sm font-bold text-[#64748B] hover:text-[#0D2556] transition-colors uppercase tracking-wider"
            >
              {t('login')}
            </Link>

            <Button
              asChild
              className="bg-[#D8420E] hover:bg-[#ff5722] text-white px-6 py-2 font-bold uppercase tracking-wider shadow-lg shadow-[#D8420E]/30 hover:shadow-xl hover:shadow-[#D8420E]/40 hover:scale-105 transition-all border-2 border-[#D8420E] hover:border-[#ff5722]"
            >
              <Link href="/contact">
                {t('getStarted')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative w-12 h-12 hover:bg-[#0D2556] hover:text-white transition-all group"
              >
                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Corner accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-[#D8420E] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[#D8420E] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] bg-white border-l-4 border-[#D8420E]">
              <div className="flex flex-col gap-8 pt-12">
                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="relative block px-4 py-3 text-lg font-bold text-[#0D2556] hover:text-white hover:bg-[#0D2556] transition-all uppercase tracking-wide border-l-4 border-transparent hover:border-[#D8420E]"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="h-px bg-gradient-to-r from-[#E2E8F0] via-[#D8420E]/20 to-[#E2E8F0]" />

                {/* Language Switcher */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    <Globe className="w-4 h-4" />
                    <span>Language</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        switchLocale('en');
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 text-center font-bold uppercase tracking-wider transition-all border-2 ${
                        locale === 'en'
                          ? 'bg-[#0D2556] text-white border-[#0D2556]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0D2556]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        switchLocale('de');
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 text-center font-bold uppercase tracking-wider transition-all border-2 ${
                        locale === 'de'
                          ? 'bg-[#0D2556] text-white border-[#0D2556]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0D2556]'
                      }`}
                    >
                      Deutsch
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[#E2E8F0] via-[#D8420E]/20 to-[#E2E8F0]" />

                {/* Auth Buttons */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="http://localhost:3000/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-3 text-[#64748B] hover:text-[#0D2556] font-bold uppercase tracking-wider border-2 border-[#E2E8F0] hover:border-[#0D2556] transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Button
                    asChild
                    className="bg-[#D8420E] hover:bg-[#ff5722] text-white py-6 font-bold uppercase tracking-wider shadow-lg border-2 border-[#D8420E] hover:border-[#ff5722]"
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('getStarted')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
