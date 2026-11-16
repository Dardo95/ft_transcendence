import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { cropImageToSquare } from '../../../lib/imageCrop';
import { useLanguage } from '../../../locales/useLanguage';
import { Button } from '../../../components/ui/button';
import { UI } from '@/components/layout/layoutStyles';
import type { TranslationKey } from '../../../locales/translations';
import { validateAvatarFile } from '../utils/validation';
import defaultAvatar from '../../../assets/default.jpg';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  username: string;
  onAvatarUpdated: (blob: Blob) => Promise<void>;
}

export function AvatarUpload({
  currentAvatarUrl,
  username,
  onAvatarUpdated,
}: AvatarUploadProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<TranslationKey | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Clean up the object URL when the component unmounts or when a new preview is set.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Handle file input change event to validate, crop, and upload the avatar.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // Crop image to a 1:1 square ratio before uploading.
      const croppedBlob = await cropImageToSquare(file, 400);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const nextPreviewUrl = URL.createObjectURL(croppedBlob);
      previewUrlRef.current = nextPreviewUrl;
      setPreview(nextPreviewUrl);

      try {
        await onAvatarUpdated(croppedBlob);
      } catch {
        // The avatar was not persisted, so do not keep showing it as applied.
        URL.revokeObjectURL(nextPreviewUrl);
        previewUrlRef.current = null;
        setPreview(null);
        setError('auth.validation.avatarUploadFailed');
      }
    } catch {
      setError('auth.validation.avatarInvalidImage');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="group relative size-55 shrink-0">
        <div className="border-primary/50 bg-secondary size-55 overflow-hidden rounded-2xl border-2 shadow-lg">
          <img
            src={preview || currentAvatarUrl || defaultAvatar}
            alt={username}
            className={UI.avatar.full}
            onError={(e) => {
              // Default placeholder svg fallback
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            }}
          />
        </div>

        <Button
          type="button"
          size="icon"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          aria-label={t('profile.uploadAvatar') || 'Upload avatar'}
          className="absolute right-0 bottom-0 shadow-md active:scale-95"
        >
          {isUploading ? (
            <Loader2 className={`${UI.icon.sm} ${UI.icon.spinner}`} />
          ) : (
            <Camera className={UI.icon.sm} />
          )}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="text-destructive max-w-55 text-center text-xs font-medium"
        >
          {t(error)}
        </p>
      )}
    </div>
  );
}
