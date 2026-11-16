// import { useState, type FormEvent } from 'react';
// import type {
//   ChangePasswordInput,
//   ChangePasswordResponse,
// } from '@transcendence/shared';
// import { Check, X } from 'lucide-react';
// import { Button } from '../../../components/ui/button';
// import { FieldError } from '../../../components/ui/field';
// import { UI } from '@/components/layout/layoutStyles';
// import { useLanguage } from '../../../locales/useLanguage';
// import { PasswordInput } from './PasswordInput';
// import {
//   validatePasswordChange,
//   type PasswordChangeFormErrors,
// } from '../utils/validation';

// Form component for changing the user's password, with validation and error handling.
// interface ChangePasswordFormProps {
//   onChangePassword: (
//     input: ChangePasswordInput
//   ) => Promise<ChangePasswordResponse>;
//   onCancel: () => void;
//   onSuccess: () => void;
// }

// export function ChangePasswordForm({
//   onChangePassword,
//   onCancel,
//   onSuccess,
// }: ChangePasswordFormProps) {
//   const { t } = useLanguage();
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [fieldErrors, setFieldErrors] = useState<PasswordChangeFormErrors>({});
//   const [submitError, setSubmitError] =
//     useState<PasswordChangeFormErrors['newPassword']>(undefined);
//   const [isSaving, setIsSaving] = useState(false);

//   Clears the error for a specific field when the user starts typing in that field.
//   function clearFieldError(field: keyof PasswordChangeFormErrors) {
//     if (!fieldErrors[field]) return;

//     setFieldErrors((current) => ({ ...current, [field]: undefined }));
//   }

//   Handles the form submission for changing the password, including validation and API call.
//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setSubmitError(undefined);

//     const errors = validatePasswordChange({
//       currentPassword,
//       newPassword,
//       confirmPassword,
//     });
//     setFieldErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       const firstInvalidField = (
//         [
//           ['currentPassword', 'change-password-current'],
//           ['newPassword', 'change-password-new'],
//           ['confirmPassword', 'change-password-confirm'],
//         ] as const
//       ).find(([field]) => errors[field]);

//       if (firstInvalidField) {
//         document.getElementById(firstInvalidField[1])?.focus();
//       }
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const result = await onChangePassword({
//         currentPassword,
//         newPassword,
//       });

//       switch (result.outcome) {
//         case 'updated':
//           setCurrentPassword('');
//           setNewPassword('');
//           setConfirmPassword('');
//           onSuccess();
//           return;
//         case 'invalid_current_password':
//           setFieldErrors({
//             currentPassword: 'auth.validation.currentPasswordInvalid',
//           });
//           document.getElementById('change-password-current')?.focus();
//           return;
//         case 'same_password':
//           setFieldErrors({
//             newPassword: 'auth.validation.samePassword',
//           });
//           document.getElementById('change-password-new')?.focus();
//           return;
//         case 'oauth_account':
//           setSubmitError('auth.validation.oauthAccount');
//           return;
//         default:
//           setSubmitError('auth.validation.passwordUpdateFailed');
//       }
//     } catch {
//       setSubmitError('auth.validation.passwordUpdateFailed');
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
//       <div className="space-y-2">
//         <label
//           htmlFor="change-password-current"
//           className={`block ${UI.text.sublabel}`}
//         >
//           {t('profile.currentPassword') || 'Current password'}
//         </label>
//         <PasswordInput
//           id="change-password-current"
//           value={currentPassword}
//           onChange={(value) => {
//             setCurrentPassword(value);
//             clearFieldError('currentPassword');
//           }}
//           autoComplete="current-password"
//           placeholder={
//             t('profile.currentPasswordPlaceholder') ||
//             'Enter your current password'
//           }
//           disabled={isSaving}
//           invalid={Boolean(fieldErrors.currentPassword)}
//           describedBy={
//             fieldErrors.currentPassword
//               ? 'change-password-current-error'
//               : undefined
//           }
//         />
//         {fieldErrors.currentPassword && (
//           <FieldError id="change-password-current-error">
//             {t(fieldErrors.currentPassword)}
//           </FieldError>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label
//           htmlFor="change-password-new"
//           className={`block ${UI.text.sublabel}`}
//         >
//           {t('profile.newPassword') || 'New password'}
//         </label>
//         <PasswordInput
//           id="change-password-new"
//           value={newPassword}
//           onChange={(value) => {
//             setNewPassword(value);
//             clearFieldError('newPassword');
//             setSubmitError(undefined);
//           }}
//           autoComplete="new-password"
//           placeholder={
//             t('profile.newPasswordPlaceholder') || 'Enter your new password'
//           }
//           disabled={isSaving}
//           invalid={Boolean(fieldErrors.newPassword)}
//           describedBy={
//             fieldErrors.newPassword ? 'change-password-new-error' : undefined
//           }
//         />
//         {fieldErrors.newPassword && (
//           <FieldError id="change-password-new-error">
//             {t(fieldErrors.newPassword)}
//           </FieldError>
//         )}
//       </div>

//       <div className="space-y-2">
//         <label
//           htmlFor="change-password-confirm"
//           className={`block ${UI.text.sublabel}`}
//         >
//           {t('profile.confirmPassword') || 'Confirm new password'}
//         </label>
//         <PasswordInput
//           id="change-password-confirm"
//           value={confirmPassword}
//           onChange={(value) => {
//             setConfirmPassword(value);
//             clearFieldError('confirmPassword');
//           }}
//           autoComplete="new-password"
//           placeholder={
//             t('profile.confirmPasswordPlaceholder') || 'Repeat the new password'
//           }
//           disabled={isSaving}
//           invalid={Boolean(fieldErrors.confirmPassword)}
//           describedBy={
//             fieldErrors.confirmPassword
//               ? 'change-password-confirm-error'
//               : undefined
//           }
//         />
//         {fieldErrors.confirmPassword && (
//           <FieldError id="change-password-confirm-error">
//             {t(fieldErrors.confirmPassword)}
//           </FieldError>
//         )}
//       </div>

//       {submitError && <FieldError role="alert">{t(submitError)}</FieldError>}

//       <div className="flex flex-wrap gap-2">
//         <Button
//           type="submit"
//           size="sm"
//           disabled={isSaving}
//           className="gap-1.5 text-xs font-semibold"
//         >
//           <Check className="size-3.5" aria-hidden="true" />
//           {isSaving
//             ? t('profile.saving') || 'Saving...'
//             : t('profile.changePassword') || 'Change password'}
//         </Button>

//         <Button
//           type="button"
//           size="sm"
//           variant="ghost"
//           disabled={isSaving}
//           onClick={onCancel}
//           className="gap-1.5 text-xs"
//         >
//           <X className="size-3.5" aria-hidden="true" />
//           {t('profile.cancel') || 'Cancel'}
//         </Button>
//       </div>
//     </form>
//   );
// }
