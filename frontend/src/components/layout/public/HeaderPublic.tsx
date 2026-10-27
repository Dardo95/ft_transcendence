import { LanguageSwitcher } from '../LanguageSwitcher';

export function HeaderPublic() {
  return (
    <header className="z-10 flex w-full justify-end px-4 py-3">
      <LanguageSwitcher />
    </header>
  );
}
