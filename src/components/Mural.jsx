import React, { useState } from 'react';
import { api } from '../services/api';
import { Image as ImageIcon, MessageSquareHeart, Send, User, X, Loader2, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from './FloralDecorations';

export default function Mural() {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [foto, setFoto] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFoto('');
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !mensagem.trim()) {
      setError('Por favor, preencha seu nome e sua mensagem.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.addMensagem({
        nome: nome.trim(),
        mensagens: mensagem.trim(),
        foto: foto || null
      });

      setNome('');
      setMensagem('');
      setFoto('');
      setImagePreview('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 7000);
    } catch (err) {
      setError(err.message || 'Erro ao enviar recado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="mensagens" className="py-20 bg-wedding-cream relative overflow-hidden">
      <div id="mural" className="absolute -top-24"></div>
      {/* Camada de Relevo Seco & Flores / Terço de Fundo */}
      <FloralBackgroundLayer className="opacity-75" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-wedding-gold-dark text-xs uppercase tracking-widest font-bold">Carinho & Felicitações</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-wedding-charcoal mt-2 mb-4 font-bold">
            Recado para os Noivos
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-charcoal/85 font-medium text-base">
            Deixe uma mensagem especial ou uma foto com os noivos. Suas palavras serão guardadas com muito carinho em nosso livro de memórias!
          </p>
        </div>

        {/* Form para Deixar Mensagem */}
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-wedding-gold/30 shadow-xl relative overflow-hidden">
          <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-30" position="top-right" />

          <div className="flex items-center justify-between mb-6 relative z-10 border-b border-wedding-gold/20 pb-4">
            <h3 className="font-serif text-2xl text-wedding-charcoal flex items-center gap-2.5 font-bold">
              <MessageSquareHeart className="w-6 h-6 text-wedding-rose-dark" />
              <span>Escrever Mensagem</span>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-wedding-gold-dark font-semibold bg-wedding-gold-light/60 px-3 py-1 rounded-full border border-wedding-gold/30">
              <ShieldCheck className="w-3.5 h-3.5 text-wedding-gold-dark" />
              <span>Entrega direta aos noivos</span>
            </div>
          </div>

          {success && (
            <div className="p-5 mb-6 rounded-2xl bg-green-50/95 text-green-800 border border-green-200 text-sm flex items-start gap-3 shadow-xs font-medium animate-fadeIn">
              <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-green-900">Mensagem enviada com sucesso!</strong>
                <span>Jéssica e Júlio receberam seu recado e vão amar ler suas palavras de carinho. Muito obrigado!</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-1.5">
                Seu Nome <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Silva / Família Santos"
                  className="w-full px-4 py-3.5 rounded-xl bg-wedding-cream/80 border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-sm font-medium text-wedding-charcoal shadow-sm"
                  disabled={loading}
                />
                <User className="w-4 h-4 text-wedding-gold-dark absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-1.5">
                Mensagem para Jéssica & Júlio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows="4"
                placeholder="Escreva seus votos de felicidade, memórias ou palavras de bênção..."
                className="w-full px-4 py-3.5 rounded-xl bg-wedding-cream/80 border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-sm font-medium text-wedding-charcoal resize-none shadow-sm"
                disabled={loading}
              ></textarea>
            </div>

            {/* Foto Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-1.5">
                Anexar uma Foto com os Noivos (Opcional)
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-2xl border-2 border-wedding-gold shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-dashed border-wedding-gold/60 bg-wedding-gold-light/40 hover:bg-wedding-gold-light/70 cursor-pointer transition-colors text-sm text-wedding-gold-dark font-bold">
                  <ImageIcon className="w-4 h-4" />
                  <span>Escolher foto da galeria</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>

            {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-wedding-charcoal hover:bg-wedding-charcoal/90 text-white font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Recado...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-wedding-gold" />
                  <span>Enviar Recado aos Noivos</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
