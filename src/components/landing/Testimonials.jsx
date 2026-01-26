import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Lucas Oliveira',
    image: 'https://i.pravatar.cc/150?img=12',
    text: 'Cara, faz 3 meses que tô usando o ClownyAds e mudou completamente meu jogo. Antes eu ficava testando oferta aleatória que achava em grupo de telegram e perdia grana. Agora eu só clono o que tá escalando de verdade aqui dentro e meu faturamento triplicou. Semana passada fiz 8k só com uma oferta de nutra que peguei aqui. Os alertas de ban salvam minha conta todo dia, sério mesmo.'
  },
  {
    name: 'Rafael Santos',
    image: 'https://i.pravatar.cc/150?img=13',
    text: 'Mano, ClownyAds é simplesmente insano. Eu tava perdido no meio de tanta oferta lixo e não sabia o que rodar. Comecei a usar a plataforma e em 2 semanas já recuperei o investimento. Os criativos que eles mostram são os que realmente convertem, não é teoria não. Peguei uma oferta hot aqui, adaptei pro meu público e tô faturando consistente todo dia. Melhor ferramenta que já usei, sem meme.'
  },
  {
    name: 'Pedro Costa',
    image: 'https://i.pravatar.cc/150?img=14',
    text: 'Slc, essa plataforma é diferenciada demais. Eu sempre fui cético com essas paradas de "ofertas prontas", mas o ClownyAds me provou o contrário. Os caras entregam exatamente o que tá funcionando no mercado agora, não é reciclado. Consegui escalar uma oferta de info gray que peguei aqui e fiz 15k no primeiro mês. O nível de detalhamento sobre risco, ângulo, geo, tudo... é coisa de profissional pra profissional mesmo.'
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#0B0B0D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            O que dizem nossos usuários
          </h2>
          <p className="text-zinc-400">Resultados reais de quem usa no dia a dia</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 hover:border-[#39FF14]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#39FF14]/20"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{testimonial.name}</h3>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} className="fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}