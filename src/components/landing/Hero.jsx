import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0D] pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BF00FF]/10 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      <div className="mx-auto my-1 px-4 text-center relative z-10 max-w-5xl sm:px-6">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8">

          <Badge className="bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 px-3 py-1">
            <RefreshCw size={12} className="mr-1" />
            Atualizado diariamente
          </Badge>
          <Badge className="bg-[#BF00FF]/10 text-[#BF00FF] border border-[#BF00FF]/20 px-3 py-1">
            <Shield size={12} className="mr-1" />
            Ofertas White & Black
          </Badge>
          <Badge className="bg-white/5 text-zinc-400 border border-white/10 px-3 py-1">
            <Zap size={12} className="mr-1" />
            Sem teoria. Só o que performa.
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} className="text-white mb-6 text-3xl font-black leading-tight sm:text-5xl md:text-7xl">As ofertas que estão 
          <b><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF00FF] to-[#39FF14]">ESCALANDO</span> agora.</b>






        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} className="text-zinc-400 mb-8 mx-auto px-4 text-sm leading-relaxed sm:text-lg md:text-xl max-w-2xl">Nutra, hot, info & Low Ticket.
Extraídas do mercado com tecnologia ant-cloacker, filtradas e prontas pra você clonar.




        </motion.p>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-3xl mx-auto mb-8 px-4">

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BsX5zcxHhas?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen />

          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <a href="#precos">
            <Button size="lg" className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-bold text-lg px-8 h-14 group">
              Acessar ofertas
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <Link to={createPageUrl('SignUp')}>
            <Button size="lg" variant="outline" className="border-[#BF00FF]/50 text-white hover:bg-[#BF00FF]/10 bg-[#BF00FF]/5 font-semibold text-lg px-8 h-14">
              Criar conta grátis
            </Button>
          </Link>
        </motion.div>

        {/* Trust */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-sm text-zinc-500">

          +3.273 ofertas já foram clonadas
        </motion.p>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B0D] to-transparent" />
    </section>);

}