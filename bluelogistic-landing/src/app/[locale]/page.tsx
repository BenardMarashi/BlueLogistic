import { Hero } from '@/components/sections/Hero';
import { Partners } from '@/components/sections/Partners';
import { ValueProps } from '@/components/sections/ValueProps';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { PricingPreview } from '@/components/sections/PricingPreview';
import { Coverage } from '@/components/sections/Coverage';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQPreview } from '@/components/sections/FAQPreview';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Partners />
      <ValueProps />
      <HowItWorks />
      <PricingPreview />
      <Coverage />
      <Testimonials />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}
