'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, PiggyBank, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ValueProps() {
  const t = useTranslations('valueProps');

  const cards = [
    {
      icon: Clock,
      title: t('card1Title'),
      description: t('card1Description'),
      color: '#D8420E',
      bgPattern: 'diagonal-stripes',
    },
    {
      icon: PiggyBank,
      title: t('card2Title'),
      description: t('card2Description'),
      color: '#22C55E',
      bgPattern: 'grid-pattern',
    },
    {
      icon: ClipboardCheck,
      title: t('card3Title'),
      description: t('card3Description'),
      color: '#0D2556',
      bgPattern: 'container-texture',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#0D2556]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D8420E]/5 rounded-full blur-3xl" />

      {/* Geometric accent lines */}
      <div className="absolute top-20 left-0 w-32 h-1 bg-gradient-to-r from-[#D8420E] to-transparent" />
      <div className="absolute bottom-20 right-0 w-32 h-1 bg-gradient-to-l from-[#0D2556] to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-[#0D2556]/5 border border-[#0D2556]/10 rounded-full mb-4"
          >
            <span className="text-sm font-bold text-[#0D2556] uppercase tracking-wider">
              Why Choose Us
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-[#0D2556] mb-4">
            {t('heading')}
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-[#D8420E] mx-auto"
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="h-full border-2 border-[#E2E8F0] hover:border-[#0D2556]/20 hover-lift bg-white relative overflow-hidden group">
                {/* Card number badge */}
                <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center font-black text-3xl text-[#0D2556]/5 group-hover:text-[#0D2556]/10 transition-all duration-300">
                  0{index + 1}
                </div>

                {/* Background pattern */}
                <div className={`absolute inset-0 ${card.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-2"
                  style={{ backgroundColor: card.color }}
                />

                <CardContent className="pt-10 pb-8 px-6 relative z-10">
                  {/* Icon container - Industrial style */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative inline-block mb-6"
                  >
                    <div
                      className="w-20 h-20 flex items-center justify-center relative"
                      style={{ backgroundColor: `${card.color}10` }}
                    >
                      {/* Corner brackets */}
                      <div
                        className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2"
                        style={{ borderColor: card.color }}
                      />
                      <div
                        className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2"
                        style={{ borderColor: card.color }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2"
                        style={{ borderColor: card.color }}
                      />
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2"
                        style={{ borderColor: card.color }}
                      />

                      <card.icon
                        className="w-10 h-10 relative z-10"
                        style={{ color: card.color }}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Animated pulse ring */}
                    <motion.div
                      className="absolute inset-0 border-2"
                      style={{ borderColor: `${card.color}30` }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-[#0D2556] mb-4 group-hover:translate-x-1 transition-transform duration-300">
                    {card.title}
                  </h3>

                  <p className="text-[#64748B] leading-relaxed font-medium">
                    {card.description}
                  </p>

                  {/* Hover arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 0 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                    style={{ color: card.color }}
                  >
                    <span>Learn More</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8H13M13 8L9 4M13 8L9 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </CardContent>

                {/* Bottom corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-16 h-16 opacity-5"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${card.color} 50%)`,
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#0D2556]/20 to-transparent" />
          <div className="w-2 h-2 bg-[#D8420E] rotate-45" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#0D2556]/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
