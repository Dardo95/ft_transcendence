import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';

interface LevelProgressProps {
  xp: number;
}

/**
 * Shared XP/level bar used by both the private and the public profile.
 * Every 100 XP grants a new level.
 */
export function LevelProgress({ xp }: LevelProgressProps) {
  const { t } = useLanguage();
  const level = Math.floor(xp / 100);
  const progress = xp % 100;
  const remaining = 100 - progress;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={UI.text.sublabel}>
          {t('profile.level') || 'Level'}{' '}
          <span className="text-primary font-extrabold">{level}</span>
        </span>
        <span className="text-secondary-foreground text-xs font-semibold">
          {xp} {t('profile.totalXp') || 'XP'}
        </span>
      </div>

      <div
        className="bg-secondary h-2.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={`${t('profile.level') || 'Level'} ${level}`}
      >
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-muted-foreground text-[11px]">
        {(t('profile.xpToNextLevel') || '{xp} XP to next level').replace(
          '{xp}',
          String(remaining)
        )}
      </p>
    </div>
  );
}
