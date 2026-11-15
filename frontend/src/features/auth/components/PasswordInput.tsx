import { useState } from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../../locales/useLanguage';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
}

/**
 * Input de contraseña con candado a la izquierda y botón de
 * mostrar/ocultar (ojo) a la derecha. El toggle es un botón
 * `type="button"` para que no envíe el formulario.
 */
export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <LockIcon
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        id={id}
        className="h-10 pr-10 pl-9"
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={
          isVisible
            ? t('auth.login.hidePassword') || 'Hide password'
            : t('auth.login.showPassword') || 'Show password'
        }
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
      >
        {isVisible ? (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
