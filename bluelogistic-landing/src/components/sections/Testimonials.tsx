'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: 'Thomas M.',
    company: 'TechShop Vienna',
    quoteKey: 'quote1',
    initials: 'TM',
    color: '#0D2556',
  },
  {
    name: 'Sarah K.',
    company: 'Handmade Austria',
    quoteKey: 'quote2',
    initials: 'SK',
    color: '#D8420E',
  },
  {
    name: 'Michael B.',
    company: 'SportGear Online',
    quoteKey: 'quote3',
    initials: 'MB',
    color: '#22C55E',
  },
];

export function Testimonials() {
  const t = useTranslations('testimonials');

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-[#0D2556] mb-12"
        >
          {t('heading')}
        </motion.h2>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} t={t} />
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                <TestimonialCard testimonial={testimonial} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  t,
}: {
  testimonial: (typeof testimonials)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card className="h-full border-[#E2E8F0] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#D8420E] text-[#D8420E]" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-[#64748B] mb-6 leading-relaxed">
          "{t(testimonial.quoteKey as keyof typeof t)}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: testimonial.color }}
          >
            {testimonial.initials}
          </div>
          <div>
            <p className="font-semibold text-[#0D2556]">{testimonial.name}</p>
            <p className="text-sm text-[#64748B]">{testimonial.company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
