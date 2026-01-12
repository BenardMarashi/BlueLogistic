'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D2556]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0D2556]">BlueLogistic</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#64748B] hover:text-[#0D2556] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => switchLocale('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === 'en'
                    ? 'text-[#0D2556] font-semibold'
                    : 'text-[#64748B] hover:text-[#0D2556]'
                }`}
              >
                EN
              </button>
              <span className="text-[#E2E8F0]">|</span>
              <button
                onClick={() => switchLocale('de')}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === 'de'
                    ? 'text-[#0D2556] font-semibold'
                    : 'text-[#64748B] hover:text-[#0D2556]'
                }`}
              >
                DE
              </button>
            </div>

            <Link
              href="http://localhost:3000/login"
              className="text-sm font-medium text-[#64748B] hover:text-[#0D2556] transition-colors"
            >
              {t('login')}
            </Link>

            <Button
              asChild
              className="bg-[#D8420E] hover:bg-[#b93a0c] text-white"
            >
              <Link href="http://localhost:3000/register">
                {t('getStarted')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-[#0D2556]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white">
              <div className="flex flex-col gap-6 pt-8">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-[#0D2556] hover:text-[#D8420E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <hr className="border-[#E2E8F0]" />

                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      switchLocale('en');
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 rounded transition-colors ${
                      locale === 'en'
                        ? 'bg-[#0D2556] text-white'
                        : 'bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      switchLocale('de');
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 rounded transition-colors ${
                      locale === 'de'
                        ? 'bg-[#0D2556] text-white'
                        : 'bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    Deutsch
                  </button>
                </div>

                <hr className="border-[#E2E8F0]" />

                <div className="flex flex-col gap-3">
                  <Link
                    href="http://localhost:3000/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 text-[#64748B] hover:text-[#0D2556]"
                  >
                    {t('login')}
                  </Link>
                  <Button
                    asChild
                    className="bg-[#D8420E] hover:bg-[#b93a0c] text-white w-full"
                  >
                    <Link
                      href="http://localhost:3000/register"
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
