'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

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
    <footer className="bg-[#0D2556] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <Package className="h-5 w-5 text-[#0D2556]" />
              </div>
              <span className="text-xl font-bold">BlueLogistic</span>
            </div>
            <p className="text-white/70 mb-6">{t('tagline')}</p>
            <Button
              asChild
              className="bg-[#D8420E] hover:bg-[#b93a0c] text-white"
            >
              <Link href="http://localhost:3000/register">
                {t('howItWorks').includes('So') ? 'Kostenlos starten' : 'Get Started Free'}
              </Link>
            </Button>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('product')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-white/70 hover:text-white transition-colors">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/#coverage" className="text-white/70 hover:text-white transition-colors">
                  {t('coverage')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('resources')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  {t('documentation')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  {t('apiReference')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t('support')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('company')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t('bookDemo')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('legal')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-white/70 hover:text-white transition-colors">
                  {t('imprint')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => switchLocale('en')}
              className={`px-2 py-1 rounded transition-colors ${
                locale === 'en'
                  ? 'text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => switchLocale('de')}
              className={`px-2 py-1 rounded transition-colors ${
                locale === 'de'
                  ? 'text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              DE
            </button>
          </div>

          <p className="text-white/60 text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
