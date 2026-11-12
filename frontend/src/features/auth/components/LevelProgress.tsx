import { useLanguage } from '../../../locales/useLanguage';

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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-wider text-orange-400 uppercase">
          {t('profile.level') || 'Level'} {level}
        </span>
        <span className="text-xs font-semibold text-zinc-300">
          {xp} {t('profile.totalXp') || 'XP'}
        </span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={`${t('profile.level') || 'Level'} ${level}`}
      >
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[11px] text-zinc-500">
        {(t('profile.xpToNextLevel') || '{xp} XP to next level').replace(
          '{xp}',
          String(remaining)
        )}
      </p>
    </div>
  );
}
