/**
 * File: src/features/auth/LoginForm.tsx
 * Purpose: Handles user authentication input and submission.
 * Usage: Rendered inside the main layout when the user is not authenticated.
 */
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useLanguage } from "../../locales";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useLanguage();

	function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			alert(`Login attempt for: ${email}`);
		}, 1000);
	}

	return (
		<Card className="w-full max-w-sm mx-auto mt-12">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
				{t("auth.login.title")}
			</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label={t("auth.login.email")}
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t("auth.login.emailPlaceholder")}
					required
				/>
				<Input
					label={t("auth.login.password")}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder={t("auth.login.passwordPlaceholder")}
					required
				/>

				<Button type="submit" disabled={isSubmitting} className="mt-2">
					{isSubmitting
						? t("auth.login.connecting")
						: t("auth.login.playNow")}
				</Button>
			</form>
		</Card>
	);
}
