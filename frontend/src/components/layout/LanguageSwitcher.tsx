import { Globe } from 'lucide-react';
import { useLanguage } from '../../locales/useLanguage';
import type { SupportedLanguage } from '../../locales/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const LANGUAGES: SupportedLanguage[] = ['es', 'en', 'it'];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="border-border bg-card text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground data-[state=open]:border-primary data-[state=open]:bg-primary data-[state=open]:text-primary-foreground gap-2 px-4 font-black"
        >
          <Globe className="text-primary group-data-[state=open]/button:text-primary-foreground h-4 w-4" />
          <span className="text-xs tracking-widest uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="border-border bg-card flex min-w-0 flex-row items-center gap-1 px-1"
      >
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang;

          return (
            <Button
              key={lang}
              type="button"
              size="sm"
              variant={isSelected ? 'default' : 'ghost'}
              onClick={() => setLanguage(lang)}
              className="px-3 tracking-widest uppercase"
            >
              {lang}
            </Button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
