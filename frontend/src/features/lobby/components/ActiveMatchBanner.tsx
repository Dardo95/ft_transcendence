import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';
import { useNavigate } from 'react-router-dom';

interface Props {
  gameId: string;
}

/**
 * Prominent call-to-action shown while the user already has a match running.
 * Navigation lives here so the banner stays self-contained.
 */
export function ActiveMatchBanner({ gameId }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="border-primary/40 bg-primary/10 mb-4 flex flex-col items-center justify-between gap-3 p-4 text-center sm:flex-row sm:text-left">
      <p className="text-secondary-foreground text-sm font-semibold">
        {t('app.lobby.activeMatchNotice') ||
          'Ya tienes una partida en curso. Vuelve a ella para seguir jugando.'}
      </p>

      <Button
        type="button"
        className={`${UI.btn.action} shrink-0`}
        onClick={() => navigate(`/game/${encodeURIComponent(gameId)}`)}
      >
        {t('app.lobby.returnToActiveMatch') || 'Ir a partida en curso'} →
      </Button>
    </Card>
  );
}
