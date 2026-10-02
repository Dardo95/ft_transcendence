/**
 * File: src/features/auth/LoginForm.tsx
 * Purpose: Handles user authentication input and submission.
 * Usage: Rendered inside the main layout when the user is not authenticated.
 */
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useLanguage } from "../../languages";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t, setLanguage } = useLanguage();

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			alert(`Login attempt for: ${username}`);
		}, 1000);
	}

	return (
		<Card className="w-full max-w-sm mx-auto mt-12">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
				{t("auth.login.title")}
			</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label={t("auth.login.username")}
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your login"
					required
				/>
				<Input
					label={t("auth.login.password")}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="*****"
					required
				/>
				
				{/* Mover a header */}
				<div className="flex gap-2 mb-4">
					<button onClick={() => setLanguage("es")}>ES</button>
					<button onClick={() => setLanguage("en")}>EN</button>
					<button onClick={() => setLanguage("it")}>IT</button>
				</div>

				<Button type="submit" disabled={isSubmitting} className="mt-2">
					{isSubmitting
						? t("auth.login.connecting")
						: t("auth.login.playNow")}
				</Button>
			</form>
		</Card>
	);
}
