'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Package, Mail, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: 'en' | 'de') => {
    router.replace(pathname, { locale: newLocale });
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  return (
    <footer className="relative bg-[#0D2556] text-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D8420E] to-transparent" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex h-12 w-12 items-center justify-center bg-white">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-[#D8420E]" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-[#D8420E]" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-[#D8420E]" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-[#D8420E]" />
                  <Package className="h-6 w-6 text-[#0D2556]" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-black uppercase tracking-tight">
                  Blue<span className="text-[#D8420E]">Logistic</span>
                </span>
              </div>
              <p className="text-white/70 mb-6 font-medium leading-relaxed">{t('tagline')}</p>
              <Button
                asChild
                className="bg-[#D8420E] hover:bg-[#ff5722] text-white px-6 py-2 font-bold uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-[#D8420E]"
              >
                <Link href="/contact">
                  {t('howItWorks').includes('So') ? 'Jetzt buchen' : 'Book Now'}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Product Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-black text-white mb-4 uppercase tracking-wider text-sm border-l-4 border-[#D8420E] pl-3">
              {t('product')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-white/70 hover:text-[#D8420E] transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/70 hover:text-[#D8420E] transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/#coverage" className="text-white/70 hover:text-[#D8420E] transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('coverage')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-[#D8420E] transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-black text-white mb-4 uppercase tracking-wider text-sm border-l-4 border-white/30 pl-3">
              {t('company')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('bookDemo')}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-black text-white mb-4 uppercase tracking-wider text-sm border-l-4 border-white/30 pl-3">
              {t('legal')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-white/70 hover:text-white transition-colors font-medium hover:translate-x-1 inline-block">
                  {t('imprint')}
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => switchLocale('en')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                locale === 'en'
                  ? 'bg-[#D8420E] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
            <div className="w-px h-4 bg-white/20" />
            <button
              onClick={() => switchLocale('de')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                locale === 'de'
                  ? 'bg-[#D8420E] text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              DE
            </button>
          </div>

          <p className="text-white/60 text-sm font-medium">{t('copyright')}</p>

          {/* Decorative element */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D8420E] rotate-45" />
            <div className="w-2 h-2 bg-[#22C55E] rotate-45" />
            <div className="w-2 h-2 bg-white/30 rotate-45" />
          </div>
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D8420E] via-[#0D2556] to-[#22C55E]" />
    </footer>
  );
}
