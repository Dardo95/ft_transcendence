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
          size="sm"
          className="h-9 gap-2 rounded-md border-1 border-zinc-800 bg-zinc-900 px-4 font-black text-zinc-400 transition-none hover:border-zinc-800 hover:bg-zinc-800 hover:text-white focus:ring-0 focus-visible:ring-0 data-[state=open]:border-orange-500 data-[state=open]:bg-orange-500 data-[state=open]:text-white"
        >
          <Globe className="h-4 w-4 text-orange-500 group-data-[state=open]/button:text-white" />
          <span className="text-xs tracking-widest uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="flex min-w-0 flex-row items-center gap-1 rounded-md border-zinc-700 bg-zinc-900 px-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
      >
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang;

          return (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`cursor-pointer rounded-sm border-2 px-3 py-1 text-xs font-black tracking-widest uppercase transition-none ${
                isSelected
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-transparent bg-zinc-800 text-zinc-300 hover:bg-orange-800 hover:text-white'
              }`}
            >
              {lang}
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
