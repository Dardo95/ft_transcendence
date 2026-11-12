import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { cropImageToSquare } from '../../../lib/imageCrop';
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
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Crop image to a 1:1 square ratio before uploading
      const croppedBlob = await cropImageToSquare(file, 400);
      setPreview(URL.createObjectURL(croppedBlob));
      await onAvatarUpdated(croppedBlob);
    } catch (err) {
      console.error('Failed to crop or upload avatar:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="group relative size-28 shrink-0">
      <div className="size-28 overflow-hidden rounded-2xl border-2 border-orange-500/50 bg-zinc-800 shadow-lg">
        <img
          src={preview || currentAvatarUrl || defaultAvatar}
          alt={username}
          className="size-full object-cover"
          onError={(e) => {
            // Default placeholder svg fallback
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
          }}
        />
      </div>

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload avatar"
        className="absolute right-0 bottom-0 rounded-xl bg-orange-600 p-2 text-white shadow-md transition-transform hover:bg-orange-500 active:scale-95 disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
    </div>
  );
}
