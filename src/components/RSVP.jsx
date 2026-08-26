import React, { useState } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, HeartHandshake, Loader2, Send, UserCheck } from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from './FloralDecorations';

export default function RSVP() {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedName, setConfirmedName] = useState('');
  const [error, setError] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C5A880', '#E8D3D1', '#98A89E', '#FDFBF7']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.addConvidado(nome.trim());
      setConfirmedName(nome.trim());
      setSuccess(true);
      setNome('');
      triggerConfetti();
    } catch (err) {
      setError(err.message || 'Não foi possível confirmar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="convidados" className="py-20 bg-white relative overflow-hidden">
      <div id="rsvp" className="absolute -top-24"></div>
      {/* Camada de Relevo Seco & Flores / Terço de Fundo */}
      <FloralBackgroundLayer className="opacity-75" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-wedding-gold-dark text-xs uppercase tracking-widest font-bold">Contamos com Você</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-wedding-charcoal mt-2 mb-4 font-bold">
            Confirmação de Presença
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-charcoal/85 font-medium max-w-lg mx-auto text-base">
            Sua presença é fundamental para tornar nosso dia completo. Por favor, confirme até <strong className="text-wedding-charcoal font-bold">15 de Outubro de 2026</strong>.
          </p>
        </div>

        <div className="bg-wedding-cream rounded-3xl p-8 sm:p-12 border border-wedding-gold/30 shadow-xl relative overflow-hidden">
          <FloralCorner className="-bottom-8 -right-8 w-44 h-44 opacity-30" position="bottom-right" />

          {success ? (
            <div className="text-center py-6 animate-fade-in relative z-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-wedding-charcoal mb-2 font-bold">
                Presença Confirmada!
              </h3>
              <p className="text-wedding-charcoal/90 font-medium mb-6">
                Ficamos muito felizes em saber que você, <strong className="text-wedding-gold-dark font-bold">{confirmedName}</strong>, estará conosco!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 rounded-full border border-wedding-gold text-wedding-gold-dark text-sm font-bold hover:bg-wedding-gold hover:text-white transition-colors"
              >
                Confirmar outro acompanhante / convidado
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-wedding-charcoal mb-2">
                  Nome Completo do Convidado <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria Júlia da Silva"
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-wedding-charcoal font-medium transition-all placeholder:text-gray-400 shadow-sm"
                    disabled={loading}
                  />
                  <UserCheck className="w-5 h-5 text-wedding-gold-dark absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                {error && <p className="text-xs text-red-600 mt-2 font-bold">{error}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-wedding-gold-light/60 border border-wedding-gold/30 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-wedding-gold-dark mt-0.5 shrink-0" />
                <p className="text-xs text-wedding-charcoal/85 font-medium leading-relaxed">
                  Caso queira confirmar para familiares ou acompanhantes, envie individualmente o nome completo de cada pessoa.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-wedding-gold hover:bg-wedding-gold-dark text-white font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Confirmando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar Minha Presença</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
