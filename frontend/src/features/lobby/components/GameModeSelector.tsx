import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

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
    <Card className="min-w-0 p-4">
      <div className={UI.row.sectionLabel}>
        <span>01 / {t('app.lobby.modeLabel') || 'MODO DE JUEGO'}</span>
        <small className={UI.text.hint}>
          {t('app.lobby.modeHint') || 'Selecciona tu desafío'}
        </small>
      </div>

      <div className={UI.shell.grid3Tight}>
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={`${UI.btn.option} p-3 ${
                isSelected ? UI.btn.optionActive : UI.card.inner
              }`}
            >
              <span className="mb-2 block text-2xl">{mode.icon}</span>
              <strong className="block text-[0.72rem] font-black tracking-wider">
                {mode.title}
              </strong>
              <small className={UI.text.optionHint}>{mode.subtitle}</small>
              <span className="text-primary mt-2 inline-block text-[0.53rem] font-black tracking-wider">
                {mode.badge}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
