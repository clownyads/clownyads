import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Metrics from '@/components/landing/Metrics';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Header />
      <Hero />
      <Metrics />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}