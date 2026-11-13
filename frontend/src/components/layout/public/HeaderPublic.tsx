import { LanguageSwitcher } from '../LanguageSwitcher';
import logoUrl from '@/assets/ui_logo.svg';
import { useNavigate } from 'react-router-dom';

export function HeaderPublic() {
  const navigate = useNavigate();
  const isLoginPage = window.location.pathname === '/login';

  return (
    <header className="z-10 flex w-full justify-end bg-transparent px-4 py-3">
      {!isLoginPage && (
        <div className="absolute top-5 left-8 flex items-center gap-2">
          <img
            src={logoUrl}
            alt="ft_bomberman Logo"
            className="h-12 object-contain"
            onClick={() => navigate('/login')}
          />
        </div>
      )}
      <LanguageSwitcher />
    </header>
  );
}
