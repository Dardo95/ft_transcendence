import { useLanguage } from '@/locales/useLanguage';

import type { GameSettings } from '../types';

interface Props {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  isHost: boolean;
  isPublicMode: boolean;
}

interface SettingRowProps {
  label: string;
  value: string;
  min: number;
  max: number;
  current: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

function SettingRow({
  label,
  value,
  min,
  max,
  current,
  disabled,
  onChange,
}: SettingRowProps) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
      <span className="flex items-center justify-between gap-3 text-[0.68rem] font-bold tracking-wider text-zinc-300">
        {label}
        <b className="text-orange-300">{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-orange-500 disabled:cursor-not-allowed"
      />
    </label>
  );
}

export function GameSettingsCard({
  settings,
  onChange,
  isHost,
  isPublicMode,
}: Props) {
  const { t } = useLanguage();
  const isDisabled = isPublicMode || !isHost;

  return (
    <section
      className={`min-w-0 rounded-2xl border border-white/10 bg-zinc-900/90 p-4 transition-opacity ${
        isDisabled ? 'opacity-60 select-none' : 'opacity-100'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-4 text-[0.68rem] font-black tracking-wider text-orange-400">
        <span>03 / {t('app.lobby.settingsLabel') || 'AJUSTES'}</span>
        <small className="text-[0.68rem] font-medium tracking-normal text-zinc-500">
          {isPublicMode
            ? t('app.lobby.fixedPublicLabel') || 'Valores fijos en público'
            : !isHost
              ? t('app.lobby.hostOnlyLabel') || 'Solo anfitrión'
              : t('app.lobby.settingsHint') || 'Personaliza la partida'}
        </small>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <SettingRow
          label={t('app.lobby.initialBombsLabel') || 'Bombas iniciales'}
          value={String(settings.initialBombs)}
          min={1}
          max={3}
          current={settings.initialBombs}
          disabled={isDisabled}
          onChange={(initialBombs) => onChange({ ...settings, initialBombs })}
        />

        <SettingRow
          label={t('app.lobby.initialSpeedLabel') || 'Velocidad base'}
          value={String(settings.initialSpeed)}
          min={1}
          max={3}
          current={settings.initialSpeed}
          disabled={isDisabled}
          onChange={(initialSpeed) => onChange({ ...settings, initialSpeed })}
        />

        <SettingRow
          label={t('app.lobby.fuseTimeLabel') || 'Mecha'}
          value={`${settings.fuseTime}s`}
          min={2}
          max={5}
          current={settings.fuseTime}
          disabled={isDisabled}
          onChange={(fuseTime) => onChange({ ...settings, fuseTime })}
        />
      </div>
    </section>
  );
}
