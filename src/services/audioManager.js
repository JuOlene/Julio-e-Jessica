// Gerenciador de Áudio com suporte nativo a iOS / Safari / Chrome Android
class AudioManager {
  constructor() {
    this.audio = null;
    this.isLoaded = false;
    this.isPlaying = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    if (!this.audio) {
      this.audio = new Audio('/alianca_tribalistas_instrumental_banda_ph.mp3');
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0.5;
    }

    const unlockAndPlay = () => {
      if (this.isPlaying) return;
      this.play();
    };

    // Listeners em múltiplos eventos de toque do usuário para iOS e Android
    window.addEventListener('touchstart', unlockAndPlay, { passive: true });
    window.addEventListener('touchend', unlockAndPlay, { passive: true });
    window.addEventListener('click', unlockAndPlay, { passive: true });
    window.addEventListener('pointerdown', unlockAndPlay, { passive: true });
  }

  play() {
    if (!this.audio) return;
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch((e) => {
        // Bloqueado pelo navegador até o próximo toque
        console.log('Autoplay aguardando toque:', e);
      });
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  setVolume(vol) {
    if (this.audio) {
      this.audio.volume = vol;
    }
  }
}

export const audioManager = new AudioManager();
