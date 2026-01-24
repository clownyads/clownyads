import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  'Economizei semanas de teste.',
  'Entrei e subi campanha no mesmo dia.',
  'Finalmente um lugar que não enrola.'
];

export default function SocialProof() {
  return (
    <section className="py-12 bg-[#0B0B0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
              <div className="relative p-6 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                <Quote size={24} className="text-[#39FF14] mb-3" />
                <p className="text-white font-medium leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}