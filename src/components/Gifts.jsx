import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Heart, Sparkles, QrCode } from 'lucide-react';
import { api, DEFAULT_CONFIG } from '../services/api';

export default function Gifts() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [config, setConfig] = useState(() => api.getConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(api.getConfig());
    };
    window.addEventListener('wedding_config_updated', handleUpdate);
    return () => window.removeEventListener('wedding_config_updated', handleUpdate);
  }, []);

  const pixData = {
    chave: config.pixKey || DEFAULT_CONFIG.pixKey,
    titular: config.pixTitular || DEFAULT_CONFIG.pixTitular,
    banco: config.pixBanco || DEFAULT_CONFIG.pixBanco,
    mensagem: "Sua presença é o nosso maior presente, mas caso queira nos presentear em dinheiro , essa é a nossa chave pix:"
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <section id="presentes" className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="text-[#8C6B38] text-xs uppercase tracking-widest font-bold">Gesto de Carinho</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D312E] mt-2 mb-3 font-bold">
            Sugestão de Presentes
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mb-4"></div>
          <p className="text-[#5A605B] max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            {pixData.mensagem}
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#C5A880]/30 shadow-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C5A880]/20">
            <div className="w-10 h-10 rounded-xl bg-[#F4EDE2] flex items-center justify-center text-[#8C6B38]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D312E]">Presenteie via Pix</h3>
              <p className="text-xs text-[#5A605B]">Transferência instantânea e segura</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#C5A880]/25 shadow-xs">
              <span className="block text-xs font-bold text-[#8C6B38] uppercase tracking-wider mb-1">Chave Pix (E-mail)</span>
              <div className="flex items-center justify-between gap-3 bg-[#FDFBF7] px-3.5 py-2.5 rounded-xl border border-[#C5A880]/20">
                <span className="text-sm font-medium text-[#2D312E] break-all select-all">{pixData.chave}</span>
                <button
                  onClick={() => handleCopy(pixData.chave, 'chave')}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#8C6B38] text-white hover:bg-[#6D5228] transition-colors shrink-0 cursor-pointer"
                >
                  {copiedKey === 'chave' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A605B]">
              <div className="bg-white p-3.5 rounded-xl border border-[#C5A880]/20">
                <span className="block font-bold text-[#8C6B38] uppercase tracking-wider mb-0.5">Favorecidos</span>
                <span className="font-semibold text-[#2D312E] text-sm">{pixData.titular}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#C5A880]/20">
                <span className="block font-bold text-[#8C6B38] uppercase tracking-wider mb-0.5">Instituição</span>
                <span className="font-semibold text-[#2D312E] text-sm">{pixData.banco}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#8C6B38] font-medium">
              <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#B87D7A]" />
              <span>Agradecemos de coração por todo o carinho e apoio!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
