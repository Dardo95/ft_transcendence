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

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../../locales/useLanguage";
import { useAuthStore } from "../store/useAuthStore";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function RegisterForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { t } = useLanguage();
	const register = useAuthStore((state) => state.register);
	const navigate = useNavigate();

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrorMessage(null);

		try {
			setIsSubmitting(true);
			await register({ username, email, password });
			navigate("/lobby", { replace: true });
		} catch (error: unknown) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: t("auth.errors.register") || "Error at registration",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card className="w-full max-w-sm mx-auto">
			<h2 className="text-xl font-bold mb-4 text-center text-orange-400">
				{t("auth.register.title") || "New User"}
			</h2>

			{errorMessage && (
				<div className="mb-4 p-2.5 text-xs text-red-300 bg-red-950/70 border border-red-700/80 rounded-xl text-center flex items-center justify-center gap-1.5">
					<span>⚠️</span>
					<span>{errorMessage}</span>
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
				<Input
					label={t("auth.register.newUser") || "New User"}
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder={
						t("auth.register.userPlaceholder") ||
						"Enter your username"
					}
					required
				/>
				<Input
					label={t("auth.register.email") || "Email"}
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={
						t("auth.register.emailPlaceholder") ||
						"Enter your email"
					}
					required
				/>
				<Input
					label={t("auth.register.password") || "Password"}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder={
						t("auth.register.passwordPlaceholder") || "********"
					}
					required
				/>

				<Button type="submit" disabled={isSubmitting} className="mt-2">
					{isSubmitting
						? t("auth.register.connecting") || "Registering..."
						: t("auth.register.playNow") || "Registered"}
				</Button>
			</form>
		</Card>
	);
}
