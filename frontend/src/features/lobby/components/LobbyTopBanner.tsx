import { useLanguage } from '@/locales/useLanguage';

interface Props {
  isGameConnected: boolean;
}

export function LobbyTopBanner({ isGameConnected }: Props) {
  const { t } = useLanguage();

  return (
    <div className="relative my-6 grid min-h-[250px] items-center gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_80%_50%,rgba(255,137,68,0.16),transparent_30%),linear-gradient(115deg,rgba(40,43,46,0.96),rgba(19,22,26,0.96))] p-[clamp(1.3rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
      <div className="absolute top-6 right-6 z-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.65rem] font-extrabold tracking-wider text-zinc-300 backdrop-blur-sm">
          <span
            className={`h-[0.48rem] w-[0.48rem] rounded-full shadow-[0_0_10px_currentColor] ${
              isGameConnected ? 'bg-emerald-400' : 'bg-red-400'
            }`}
          />
          {isGameConnected
            ? t('app.lobby.socketOnline') || 'SOCKET ONLINE'
            : t('app.lobby.socketOffline') || 'SOCKET OFFLINE'}
        </div>
      </div>

      <div className="relative z-10">
        <span className="block text-[0.65rem] font-extrabold tracking-[0.19em] text-zinc-500">
          {t('app.lobby.matchConfiguration') || 'CONFIGURACIÓN DE PARTIDA'}
        </span>

        <h2 className="mt-2 mb-3 text-[clamp(2.5rem,6vw,4.4rem)] leading-[0.92] font-black tracking-[-0.075em] text-[#fff4e6]">
          {t('app.lobby.enterLobbyPrefix') || 'Entra al'}
          <em className="text-orange-400 not-italic">
            {' '}
            {t('app.lobby.enterLobbyHighlight') || 'Lobby'}
          </em>
        </h2>
        <p className="max-w-[520px] text-sm leading-relaxed text-zinc-400">
          {t('app.lobby.bannerDescription') ||
            'Configura tu partida. El servidor controla movimiento, bombas, explosiones, mejoras y victoria.'}
        </p>
      </div>

      <div
        className="relative w-[min(100%,370px)] justify-self-center"
        aria-hidden="true"
      >
        <span className="absolute inset-[15%] rounded-full bg-orange-500/20 blur-[45px]" />
        <div className="relative grid grid-cols-5 gap-1.5 rounded-xl border border-orange-200/25 bg-[#090c0f]/80 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(255,124,54,0.1)]">
          {Array.from({ length: 15 }, (_, index) => (
            <span
              key={index}
              className={`grid aspect-square place-items-center rounded-[0.3rem] border border-white/10 text-[clamp(1rem,3vw,2rem)] [text-shadow:0_0_12px_currentColor] ${
                (index + 1) % 3 === 0
                  ? 'bg-[linear-gradient(145deg,#71452b,#3a281e)] text-[#ffc36f]'
                  : index === 6 || index === 8 || index === 12
                    ? 'text-[#ff7844]'
                    : 'bg-[linear-gradient(145deg,#363b3e,#1b2024)] text-[#d8a06c]'
              }`}
            >
              {index === 6 || index === 8 || index === 12
                ? '●'
                : (index + 1) % 3 === 0
                  ? '✹'
                  : '▦'}
            </span>
          ))}
        </div>
        <div className="relative mt-2.5 text-right text-[0.58rem] font-black tracking-[0.23em] text-zinc-500">
          {t('app.lobby.bombsReady') || 'BOMBS READY / PLAYER MODE'}
        </div>
      </div>
    </div>
  );
}
