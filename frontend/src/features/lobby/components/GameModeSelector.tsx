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
      title: t('app.lobby.modePracticeTitle') || 'PRACTICE',
      subtitle: t('app.lobby.modePracticeSub') || '1 player + passive bot',
      badge: t('app.lobby.modePracticeBadge') || 'Great for testing',
    },
    {
      id: 'private',
      icon: '👥',
      title: t('app.lobby.modePrivateTitle') || 'PRIVATE',
      subtitle:
        t('app.lobby.modePrivateSub') || 'Only members of your lobby (2–4).',
      badge: t('app.lobby.modePrivateBadge') || 'Friends only',
    },
    {
      id: 'public',
      icon: '🌐',
      title: t('app.lobby.modePublicTitle') || 'PUBLIC',
      subtitle:
        t('app.lobby.modePublicSub') || 'Your lobby against other groups.',
      badge: t('app.lobby.modePublicBadge') || 'Open matchmaking',
    },
  ];

  return (
    <Card className="min-w-0 p-4">
      <div className={UI.row.sectionLabel}>
        <span>01 / {t('app.lobby.modeLabel') || 'GAME MODE'}</span>
        <small className={UI.text.hint}>
          {t('app.lobby.modeHint') || 'Choose your challenge'}
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
