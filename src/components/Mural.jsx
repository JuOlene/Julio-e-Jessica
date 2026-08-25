import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Image as ImageIcon, MessageSquareHeart, Send, User, X, Loader2, Sparkles } from 'lucide-react';
import { FloralBackgroundLayer, FloralCorner } from './FloralDecorations';

export default function Mural() {
  const [mensagens, setMensagens] = useState([]);
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [foto, setFoto] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadMensagens = async () => {
    try {
      const data = await api.getMensagens();
      setMensagens(data);
    } catch (err) {
      console.error('Erro ao carregar mural:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMensagens();
  }, []);

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
      setTimeout(() => setSuccess(false), 5000);
      await loadMensagens();
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-wedding-gold-dark text-xs uppercase tracking-widest font-bold">Carinho & Felicitações</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-wedding-charcoal mt-2 mb-4 font-bold">
            Mural de Mensagens
          </h2>
          <div className="w-16 h-0.5 bg-wedding-gold mx-auto mb-4"></div>
          <p className="text-wedding-charcoal/85 font-medium text-base">
            Deixe uma mensagem especial ou uma foto com os noivos para guardarmos no nosso livro de memórias!
          </p>
        </div>

        {/* Form para Deixar Mensagem */}
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-wedding-gold/30 shadow-xl mb-16 relative overflow-hidden">
          <FloralCorner className="-top-8 -right-8 w-36 h-36 opacity-30" position="top-right" />

          <h3 className="font-serif text-2xl text-wedding-charcoal mb-4 flex items-center gap-2 font-bold relative z-10">
            <MessageSquareHeart className="w-6 h-6 text-wedding-rose-dark" />
            <span>Escrever um Recado</span>
          </h3>

          {success && (
            <div className="p-4 mb-4 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm flex items-center gap-2 font-medium">
              <Sparkles className="w-5 h-5 text-green-600 shrink-0" />
              <span>Sua mensagem foi enviada com sucesso para o casal!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-1.5">
                Seu Nome <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou casal/família"
                  className="w-full px-4 py-3 rounded-xl bg-wedding-cream/80 border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-sm font-medium text-wedding-charcoal shadow-sm"
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
                placeholder="Escreva seus votos de felicidade, memórias ou palavras carinhosas..."
                className="w-full px-4 py-3 rounded-xl bg-wedding-cream/80 border border-wedding-gold/30 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none text-sm font-medium text-wedding-charcoal resize-none shadow-sm"
                disabled={loading}
              ></textarea>
            </div>

            {/* Foto Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-wedding-charcoal mb-1.5">
                Anexar uma Foto (Opcional)
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
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-wedding-gold/60 bg-wedding-gold-light/40 hover:bg-wedding-gold-light/70 cursor-pointer transition-colors text-sm text-wedding-gold-dark font-bold">
                  <ImageIcon className="w-4 h-4" />
                  <span>Escolher foto com os noivos</span>
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
              className="w-full py-3.5 rounded-xl bg-wedding-charcoal hover:bg-wedding-charcoal/90 text-white font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-wedding-gold" />
                  <span>Publicar no Mural</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de Mensagens Recebidas */}
        <div>
          <h3 className="font-serif text-2xl text-center text-wedding-charcoal mb-8 font-bold">
            Recados dos Convidados ({mensagens.length})
          </h3>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-wedding-gold" />
            </div>
          ) : mensagens.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-wedding-gold/30 p-8 max-w-md mx-auto shadow-sm">
              <MessageSquareHeart className="w-12 h-12 text-wedding-gold/40 mx-auto mb-3" />
              <p className="text-wedding-charcoal/80 font-medium">
                Ainda não há recados. Seja o primeiro a deixar uma mensagem para Jéssica e Júlio!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white/95 rounded-3xl p-6 border border-wedding-gold/25 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {msg.foto && (
                      <div className="mb-4 overflow-hidden rounded-2xl max-h-56 bg-wedding-cream">
                        <img
                          src={msg.foto}
                          alt={`Foto de ${msg.nome}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <p className="text-wedding-charcoal text-sm italic font-serif leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                      "{msg.mensagens}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-wedding-gold/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-wedding-gold-light text-wedding-gold-dark font-serif font-bold text-xs flex items-center justify-center">
                        {msg.nome ? msg.nome.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span className="font-bold text-xs text-wedding-charcoal">{msg.nome}</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-wedding-rose-dark" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
