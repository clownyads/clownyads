import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-[#0B0B0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39FF14]/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#BF00FF]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
            Pare de testar no escuro.
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Use o que já está funcionando no mercado real.
          </p>
          
          <a href="#precos">
            <Button 
              size="lg" 
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-bold text-lg px-10 h-14 group"
            >
              Entrar no ClownyAds agora
              <parameter name="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          
          <p className="mt-6 text-sm text-zinc-500">
            Acesso imediato. Cancele quando quiser.
          </p>
        </motion.div>
      </div>
    </section>
  );
}