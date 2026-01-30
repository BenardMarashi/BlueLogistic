'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield } from 'lucide-react';

export function FinalCTA() {
  const t = useTranslations('cta');

  return (
    <section className="relative py-32 bg-gradient-to-br from-[#0D2556] via-[#1a3a7a] to-[#0D2556] overflow-hidden">
      {/* Industrial background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 diagonal-stripes opacity-10" />

      {/* Animated geometric shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 left-10 w-64 h-64 border-4 border-[#D8420E]/10"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-10 right-10 w-96 h-96 border-4 border-[#22C55E]/10 rounded-full"
      />

      {/* Orange glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D8420E]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#D8420E]/20 border-2 border-[#D8420E]/30 rounded-full mb-8 backdrop-blur-sm"
          >
            <Zap className="w-5 h-5 text-[#D8420E]" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              Ready to Ship?
            </span>
          </motion.div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {t('heading')}
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1.5 bg-[#D8420E] mx-auto mb-8"
          />

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('subheading')}
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0D2556] hover:bg-[#D8420E] hover:text-white px-12 py-8 text-lg font-black uppercase tracking-wider shadow-2xl shadow-white/20 hover:shadow-[#D8420E]/50 hover:scale-105 transition-all duration-300 group border-2 border-white"
            >
              <Link href="/contact" className="flex items-center gap-3">
                {t('primary')}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white hover:text-[#0D2556] px-12 py-8 text-lg font-black uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">{t('secondary')}</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/10"
          >
            <div className="flex flex-col items-center gap-2">
              <Package className="w-8 h-8 text-[#D8420E]" />
              <span className="text-white/80 text-sm font-medium">No Setup Fees</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="w-8 h-8 text-[#22C55E]" />
              <span className="text-white/80 text-sm font-medium">60s Labels</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-white/60" />
              <span className="text-white/80 text-sm font-medium">Full Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom angular cut */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0D2556]" style={{ clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)' }} />
    </section>
  );
}
