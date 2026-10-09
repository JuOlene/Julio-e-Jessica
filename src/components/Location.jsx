import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, Compass, Check, Sparkles } from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from './FloralDecorations';

export default function Location() {
  const [copied, setCopied] = useState(false);

  const eventDetails = {
    venueName: "Espaço Villa Jardins",
    address: "Av. das Palmeiras, 1500 - Jardim Primavera, São Paulo - SP",
    date: "14 de Novembro de 2026 (Sábado)",
    ceremonyTime: "15:30h",
    receptionTime: "17:30h",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+das+Palmeiras,+1500+-+Jardim+Primavera",
    wazeUrl: "https://waze.com/ul?q=Av.+das+Palmeiras,+1500+-+Jardim+Primavera"
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(eventDetails.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="localizacao" className="py-20 bg-wedding-cream relative overflow-hidden">
      {/* Camada de Relevo Seco & Flores / Terço de Fundo */}
      <FloralBackgroundLayer className="opacity-75" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-wedding-gold-dark text-xs uppercase tracking-widest font-bold">Onde & Quando</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-wedding-charcoal mt-2 mb-4 font-bold">
            Data & Localização
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-charcoal/85 font-medium text-base">
            Preparamos tudo com muito carinho para receber você nesse momento inesquecível.
          </p>
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-0">
          {/* Card 1: Data e Horários */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-wedding-gold/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            {/* Detalhe floral no canto do card */}
            <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-35" position="top-right" />

            <div className="w-12 h-12 rounded-2xl bg-wedding-gold-light flex items-center justify-center text-wedding-gold-dark mb-6 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl text-wedding-charcoal mb-4 font-bold">Data & Horários</h3>
            
            <div className="space-y-4 text-wedding-charcoal">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                <Calendar className="w-5 h-5 text-wedding-gold-dark mt-0.5 shrink-0" />
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-wedding-gold-dark">Data</span>
                  <span className="text-base font-semibold text-wedding-charcoal">{eventDetails.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                <Clock className="w-5 h-5 text-wedding-gold-dark mt-0.5 shrink-0" />
                <div className="w-full">
                  <span className="block text-xs font-bold uppercase tracking-wider text-wedding-gold-dark">Cerimônia</span>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-wedding-charcoal">Início pontual às {eventDetails.ceremonyTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                <Sparkles className="w-5 h-5 text-wedding-gold-dark mt-0.5 shrink-0" />
                <div className="w-full">
                  <span className="block text-xs font-bold uppercase tracking-wider text-wedding-gold-dark">Recepção & Festa</span>
                  <span className="text-base font-semibold text-wedding-charcoal">A partir das {eventDetails.receptionTime} (mesmo local)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Local & Rotas */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-wedding-gold/30 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            {/* Detalhe floral no canto do card */}
            <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-35" position="top-right" />

            <div className="w-12 h-12 rounded-2xl bg-wedding-gold-light flex items-center justify-center text-wedding-gold-dark mb-6 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl text-wedding-charcoal mb-4 font-bold">Local do Evento</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-wedding-cream/80 border border-wedding-gold/20 shadow-sm">
                <h4 className="font-serif text-lg font-bold text-wedding-charcoal">{eventDetails.venueName}</h4>
                <p className="text-sm font-medium text-wedding-charcoal/90 mt-1">{eventDetails.address}</p>
                
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 text-xs text-wedding-gold-dark hover:text-wedding-gold font-bold mt-3 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-bold">Endereço copiado com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Copiar endereço completo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botões de Navegação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={eventDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-wedding-charcoal text-white text-sm font-semibold hover:bg-wedding-charcoal/90 transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-wedding-gold" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={eventDetails.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-wedding-gold text-white text-sm font-semibold hover:bg-wedding-gold-dark transition-colors shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Abrir no Waze</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
