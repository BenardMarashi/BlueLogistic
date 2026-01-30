'use client';

import { Check, ArrowRight, Package2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('hero');

  const features = [t('feature1'), t('feature2'), t('feature3')];

  return (
    <section
      className="relative bg-white overflow-hidden min-h-[95vh] flex items-center"
      suppressHydrationWarning
    >
      {/* Bold background with industrial grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2556] via-[#1a3a7a] to-[#0D2556] opacity-[0.97]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Orange glow - static for performance */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#D8420E] to-[#ff6b35] opacity-10 blur-3xl" style={{ transform: 'rotate(25deg) translateX(20%)' }} />

      {/* Container-inspired frame elements */}
      <div className="absolute top-0 left-0 w-2 h-32 bg-[#D8420E]" />
      <div className="absolute top-0 left-0 w-32 h-2 bg-[#D8420E]" />
      <div className="absolute bottom-0 right-0 w-2 h-32 bg-[#D8420E]" />
      <div className="absolute bottom-0 right-0 w-32 h-2 bg-[#D8420E]" />

      <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
        {/* Centered Content */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D8420E]/10 border border-[#D8420E]/30 rounded-full mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#D8420E]" />
            <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
              60-Second Shipping
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-8 tracking-tight">
            <span className="text-white block">
              {t('headline')}
            </span>
            <span className="text-[#D8420E] block mt-2 relative inline-block">
              {t('headlineAccent')}
              <div className="absolute -bottom-2 left-0 h-1 bg-[#D8420E] w-full" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            {t('subheadline')}
          </p>

          {/* Feature Bullets - Industrial style */}
          <div className="space-y-4 mb-10 inline-block text-left">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#22C55E] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-white font-medium text-lg">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons - Bold industrial design */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D8420E] hover:bg-[#ff5722] text-white px-10 py-7 text-lg font-bold uppercase tracking-wider shadow-2xl shadow-[#D8420E]/50 hover:shadow-[#D8420E]/70 hover:scale-105 transition-all duration-300 group border-2 border-[#D8420E] hover:border-[#ff5722]"
            >
              <Link href="/contact" className="flex items-center gap-2">
                {t('ctaPrimary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white text-[#0D2556] hover:bg-white/90 px-10 py-7 text-lg font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">{t('ctaSecondary')}</Link>
            </Button>
          </div>

          {/* Trust indicators - Container style */}
          <div className="flex items-center gap-6 pt-6 border-t border-white/10 justify-center">
            <div className="flex items-center gap-2">
              <Package2 className="w-5 h-5 text-[#22C55E]" />
              <span className="text-white/70 text-sm font-medium">
                {t('trustBadge')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom angular cut */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 100%)' }} />
    </section>
  );
}
