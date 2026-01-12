'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Check, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const t = useTranslations('hero');

  const features = [t('feature1'), t('feature2'), t('feature3')];

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t('headline')}{' '}
              <span className="text-[#D8420E]">{t('headlineAccent')}</span>
            </h1>
            <p className="text-lg text-[#64748B] mb-8 max-w-xl">
              {t('subheadline')}
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[#0D2556]">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-[#D8420E] hover:bg-[#b93a0c] text-white px-8"
              >
                <Link href="http://localhost:3000/register">
                  {t('ctaPrimary')}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#0D2556] text-[#0D2556] hover:bg-[#0D2556] hover:text-white px-8"
              >
                <Link href="/contact">{t('ctaSecondary')}</Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-[#64748B]"
            >
              {t('trustBadge')}
            </motion.p>
          </motion.div>

          {/* Right Column - Europe Map Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[#0D2556]/5 to-[#0D2556]/10 rounded-3xl p-8 lg:p-12">
              {/* Abstract Europe Map */}
              <div className="relative aspect-square max-w-md mx-auto">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  fill="none"
                >
                  {/* Europe simplified outline */}
                  <path
                    d="M200 50 L280 80 L320 120 L340 180 L330 240 L300 300 L250 340 L180 350 L120 320 L80 260 L70 200 L90 140 L130 90 L200 50"
                    fill="#E2E8F0"
                    stroke="#0D2556"
                    strokeWidth="2"
                  />

                  {/* Austria (origin) */}
                  <motion.circle
                    cx="220"
                    cy="200"
                    r="12"
                    fill="#D8420E"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  <motion.circle
                    cx="220"
                    cy="200"
                    r="20"
                    fill="#D8420E"
                    opacity="0.3"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
                  />

                  {/* Shipping routes */}
                  {[
                    { x: 200, y: 140, delay: 0.6 }, // Germany
                    { x: 150, y: 180, delay: 0.7 }, // France
                    { x: 280, y: 180, delay: 0.8 }, // Hungary
                    { x: 120, y: 240, delay: 0.9 }, // Spain
                    { x: 260, y: 260, delay: 1.0 }, // Italy
                    { x: 180, y: 100, delay: 1.1 }, // Netherlands
                  ].map((dest, i) => (
                    <g key={i}>
                      <motion.line
                        x1="220"
                        y1="200"
                        x2={dest.x}
                        y2={dest.y}
                        stroke="#0D2556"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: dest.delay, duration: 0.5 }}
                      />
                      <motion.circle
                        cx={dest.x}
                        cy={dest.y}
                        r="6"
                        fill="#0D2556"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: dest.delay + 0.3 }}
                      />
                    </g>
                  ))}
                </svg>

                {/* Austria Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4"
                >
                  <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-lg text-sm font-medium text-[#0D2556]">
                    <MapPin className="w-4 h-4 text-[#D8420E]" />
                    Austria
                  </div>
                </motion.div>
              </div>

              {/* Price Callout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4"
              >
                <p className="text-xs text-[#64748B] mb-1">{t('priceCallout').split('€')[0]}</p>
                <p className="text-2xl font-bold text-[#0D2556]">
                  €4.99
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#0D2556]/5 to-transparent pointer-events-none" />
    </section>
  );
}
