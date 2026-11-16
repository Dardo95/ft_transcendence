import { useState } from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';

// Password input component with a lock icon on the left and a show/hide toggle button (eye icon) on the right.
// The toggle button is of type "button" to prevent form submission when clicked.
interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
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
  disabled,
  invalid,
  describedBy,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <LockIcon className={UI.form.inputIcon} aria-hidden="true" />
      <Input
        id={id}
        className={UI.form.inputWithIcons}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
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
        className={`${UI.btn.ghost} absolute top-1/2 right-2 -translate-y-1/2`}
      >
        {isVisible ? (
          <EyeOffIcon className={UI.icon.sm} aria-hidden="true" />
        ) : (
          <EyeIcon className={UI.icon.sm} aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
