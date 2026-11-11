import { useLanguage } from '@/locales/useLanguage';

import type { GameMode } from '../types';

interface Props {
  selectedMode: GameMode;
  onChange: (mode: GameMode) => void;
  disabled?: boolean;
}

interface ModeOption {
  id: GameMode;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
}

export function GameModeSelector({ selectedMode, onChange, disabled }: Props) {
  const { t } = useLanguage();

  const modes: ModeOption[] = [
    {
      id: 'practice',
      icon: '🎮',
      title: t('app.lobby.modePracticeTitle') || 'PRÁCTICA',
      subtitle: t('app.lobby.modePracticeSub') || '1 jugador + Bot pasivo',
      badge: t('app.lobby.modePracticeBadge') || 'IDEAL PARA PROBAR',
    },
    {
      id: 'private',
      icon: '👥',
      title: t('app.lobby.modePrivateTitle') || 'PRIVADA',
      subtitle:
        t('app.lobby.modePrivateSub') || 'Solo los miembros de tu lobby (2–4).',
      badge: t('app.lobby.modePrivateBadge') || 'SIN RANDOMS',
    },
    {
      id: 'public',
      icon: '🌐',
      title: t('app.lobby.modePublicTitle') || 'PÚBLICA',
      subtitle: t('app.lobby.modePublicSub') || 'Tu lobby contra otros grupos.',
      badge: t('app.lobby.modePublicBadge') || 'MATCHMAKING',
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4">
      <div className="mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider text-orange-400">
        <span>01 / {t('app.lobby.modeLabel') || 'MODO DE JUEGO'}</span>
        <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
          {t('app.lobby.modeHint') || 'Selecciona tu desafío'}
        </small>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={`min-w-0 cursor-pointer rounded-xl border p-3 text-left text-[#f5eee4] transition hover:-translate-y-0.5 hover:border-orange-400/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${
                isSelected
                  ? 'border-orange-400 bg-[linear-gradient(145deg,rgba(255,145,77,0.13),rgba(255,145,77,0.035))] shadow-[inset_0_0_0_1px_rgba(255,145,77,0.08)]'
                  : 'border-white/10 bg-white/[0.025]'
              }`}
            >
              <span className="mb-2 block text-2xl">{mode.icon}</span>
              <strong className="block text-[0.72rem] font-black tracking-wider">
                {mode.title}
              </strong>
              <small className="mt-1.5 block min-h-[2.1rem] text-[0.66rem] leading-snug text-zinc-400">
                {mode.subtitle}
              </small>
              <span className="mt-2 inline-block text-[0.53rem] font-black tracking-wider text-orange-300">
                {mode.badge}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
