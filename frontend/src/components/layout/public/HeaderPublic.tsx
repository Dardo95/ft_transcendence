import { LanguageSwitcher } from '../LanguageSwitcher';
import logoUrl from '@/assets/ui_logo.svg';
import { useNavigate } from 'react-router-dom';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';

export function HeaderPublic() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isLoginPage = window.location.pathname === '/login';

  return (
    <header className="z-10 flex w-full justify-end bg-transparent px-4 py-3">
      {!isLoginPage && (
        <div className="absolute top-5 left-8 flex items-center gap-2">
          <img
            src={logoUrl}
            alt={t('app.general.logoAlt') || 'ft_bomberman logo'}
            className={`h-12 ${UI.chrome.logo}`}
            onClick={() => navigate('/login')}
          />
        </div>
      )}
      <LanguageSwitcher />
    </header>
  );
}
