import { useLanguage } from '@/locales/useLanguage';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';

import type { GameSettings } from '../types';

interface Props {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  isHost: boolean;
  isPublicMode: boolean;
  disabled?: boolean;
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
    <label className={`block px-3 py-3 ${UI.card.inner}`}>
      <span className="text-secondary-foreground flex items-center justify-between gap-3 text-[0.68rem] font-bold tracking-wider">
        {label}
        <b className="text-primary">{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-primary mt-2 w-full disabled:cursor-not-allowed"
      />
    </label>
  );
}

export function GameSettingsCard({
  settings,
  onChange,
  isHost,
  isPublicMode,
  disabled = false,
}: Props) {
  const { t } = useLanguage();
  const isDisabled = disabled || isPublicMode || !isHost;

  return (
    <Card
      className={`min-w-0 p-4 transition-opacity ${
        isDisabled ? 'opacity-60 select-none' : 'opacity-100'
      }`}
    >
      <div className={UI.row.sectionLabel}>
        <span>03 / {t('app.lobby.settingsLabel') || 'AJUSTES'}</span>
        <small className={UI.text.hint}>
          {isPublicMode
            ? t('app.lobby.fixedPublicLabel') || 'Valores fijos en público'
            : !isHost
              ? t('app.lobby.hostOnlyLabel') || 'Solo anfitrión'
              : t('app.lobby.settingsHint') || 'Personaliza la partida'}
        </small>
      </div>

      <div className={UI.shell.grid3Tight}>
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
    </Card>
  );
}
