/**
 * User registration form.
 * Category: Feature Component
 *
 * Responsible for:
 * - Collecting registration information.
 * - Validating user input.
 * - Triggering the registration flow.
 * - Displaying registration errors to the user.
 *
 * Does not:
 * - Perform HTTP requests directly.
 * - Implement authentication business logic.
 * - Manage global authentication state.
 */

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useLanguage } from "../../../locales/useLanguage";
import { useAuthStore } from "../store/useAuthStore";

export function RegisterForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { t } = useLanguage();
	const register = useAuthStore((state) => state.register); // Zustand method

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setErrorMessage(null);

		try {
			await register({ username, email, password });
			setUsername("");
			setEmail("");
			setPassword("");
		} catch (error: unknown) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: t("auth.errors.register"),
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card className="w-full max-w-sm mx-auto mt-12">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
				{t("auth.register.title")}
			</h2>

			{errorMessage && (
				<div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded text-center">
					{errorMessage}
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label={t("auth.register.newUser")}
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder={t("auth.register.userPlaceholder")}
					required
				/>
				<Input
					label={t("auth.register.email")}
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t("auth.register.emailPlaceholder")}
					required
				/>
				<Input
					label={t("auth.register.password")}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder={t("auth.register.passwordPlaceholder")}
					required
				/>

				<Button type="submit" disabled={isSubmitting} className="mt-2">
					{isSubmitting
						? t("auth.register.connecting")
						: t("auth.register.playNow")}
				</Button>
			</form>
		</Card>
	);
}
