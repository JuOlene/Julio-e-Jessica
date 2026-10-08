// Gerenciador de Áudio com YouTube IFrame Player API (Invisível, Contínuo e sem Bloqueios de Autoplay)
class AudioManager {
  constructor() {
    this.player = null;
    this.isReady = false;
    this.isPlaying = false;
    this.videoId = 'qYXIdoiT2J4'; // Aliança - Tribalistas (instrumental) | Banda PH
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Carrega a API do YouTube Iframe caso ainda não exista
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    // Cria o container do player invisível fora da tela
    let container = document.getElementById('yt-audio-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-audio-player-container';
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-100';
      document.body.appendChild(container);
    }

    const createPlayer = () => {
      if (window.YT && window.YT.Player && !this.player) {
        this.player = new window.YT.Player('yt-audio-player-container', {
          height: '1',
          width: '1',
          videoId: this.videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: this.videoId,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              this.isReady = true;
              event.target.setVolume(50);
              // Tenta tocar se já houver solicitação
              if (this.isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.isPlaying = true;
              }
              // Garante repetição em loop contínuo
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    }

    const unlockAndPlay = () => {
      this.play();
    };

    // Listeners em múltiplos eventos de toque do usuário no celular e computador
    window.addEventListener('touchstart', unlockAndPlay, { passive: true });
    window.addEventListener('touchend', unlockAndPlay, { passive: true });
    window.addEventListener('click', unlockAndPlay, { passive: true });
    window.addEventListener('pointerdown', unlockAndPlay, { passive: true });
  }

  play() {
    this.isPlaying = true;
    if (this.player && this.player.playVideo) {
      try {
        this.player.playVideo();
      } catch (e) {
        console.log('Aguardando toque para áudio:', e);
      }
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.player && this.player.pauseVideo) {
      try {
        this.player.pauseVideo();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const audioManager = new AudioManager();
