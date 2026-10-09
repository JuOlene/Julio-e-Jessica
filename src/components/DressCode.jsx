import React from 'react';
import { Shirt, Sparkles, Clock, Car, Snowflake, CheckCircle2 } from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from './FloralDecorations';

export default function DressCode() {
  return (
    <section id="traje" className="py-24 bg-wedding-cream relative overflow-hidden">
      {/* Camada floral de fundo */}
      <FloralBackgroundLayer className="opacity-70" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-wedding-gold-dark text-xs uppercase tracking-widest font-bold">Guia dos Convidados</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-wedding-charcoal mt-2 mb-4 font-bold">
            Traje & Dicas Úteis
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-charcoal/85 font-medium text-base">
            Informações importantes para você aproveitar cada momento da nossa celebração com total conforto.
          </p>
        </div>

        {/* Grid com Destaque de Traje e Informações Úteis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card: Dress Code / Traje */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-wedding-gold/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between">
            <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-30" position="top-right" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-wedding-gold-light flex items-center justify-center text-wedding-gold-dark mb-6 shadow-sm">
                <Shirt className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl text-wedding-charcoal mb-3 font-bold">
                Traje Recomendado
              </h3>

              <div className="inline-block px-4 py-1.5 rounded-full bg-wedding-gold-light border border-wedding-gold/40 text-wedding-gold-dark font-bold text-xs uppercase tracking-wider mb-5">
                Passeio Completo / Esporte Fino
              </div>

              <p className="text-sm text-wedding-charcoal/90 leading-relaxed mb-6 font-medium">
                Queremos que você se sinta elegante e à vontade! Sugerimos trajes sofisticados e confortáveis.
              </p>

              <div className="space-y-3 border-t border-wedding-gold/20 pt-5 text-sm text-wedding-charcoal">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-wedding-gold-dark mt-0.5 shrink-0" />
                  <span className="font-medium">Para elas: vestidos longos ou midi elegantes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-wedding-gold-dark mt-0.5 shrink-0" />
                  <span className="font-medium">Para eles: terno, costume ou camisa social com blazer.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-wedding-rose mt-0.5 shrink-0" />
                  <span className="font-medium">Dica: sapatos confortáveis para dançar até o fim!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Dicas & Conforto */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-wedding-gold/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between">
            <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-30" position="top-right" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-wedding-gold-light flex items-center justify-center text-wedding-gold-dark mb-6 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl text-wedding-charcoal mb-4 font-bold">
                Dicas Importantes
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                  <div className="p-2 rounded-xl bg-white text-wedding-gold-dark shadow-xs shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-wedding-charcoal">Estacionamento</h4>
                    <p className="text-xs text-wedding-charcoal/80 mt-0.5 font-medium">
                      Estacionamento privativo no local com serviço de Valet incluso.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                  <div className="p-2 rounded-xl bg-white text-wedding-gold-dark shadow-xs shrink-0">
                    <Snowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-wedding-charcoal">Ambiente Climatizado</h4>
                    <p className="text-xs text-wedding-charcoal/80 mt-0.5 font-medium">
                      O espaço da cerimônia e recepção é 100% coberto e climatizado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                  <div className="p-2 rounded-xl bg-white text-wedding-gold-dark shadow-xs shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-wedding-charcoal">Pontualidade</h4>
                    <p className="text-xs text-wedding-charcoal/80 mt-0.5 font-medium">
                      A cerimônia começará pontualmente às 15:30h. Programe-se para chegar com 20 minutos de antecedência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
