import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Metrics from '@/components/landing/Metrics';
import WhatIs from '@/components/landing/WhatIs';
import HowItWorks from '@/components/landing/HowItWorks';
import WhatYouFind from '@/components/landing/WhatYouFind.jsx';
import WhyDifferent from '@/components/landing/WhyDifferent';
import ForWho from '@/components/landing/ForWho';
import SocialProof from '@/components/landing/SocialProof';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Header />
      <Hero />
      <Metrics />
      <WhatIs />
      <HowItWorks />
      <WhatYouFind />
      <WhyDifferent />
      <ForWho />
      <Testimonials />
      <SocialProof />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}