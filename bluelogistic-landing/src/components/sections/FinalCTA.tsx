'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 bg-gradient-to-br from-[#0D2556] to-[#1a3a7a]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('heading')}
          </h2>
          <p className="text-lg text-white/80 mb-8">{t('subheading')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0D2556] hover:bg-white/90 px-8"
            >
              <Link href="http://localhost:3000/register">{t('primary')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0D2556] px-8"
            >
              <Link href="/contact">{t('secondary')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
