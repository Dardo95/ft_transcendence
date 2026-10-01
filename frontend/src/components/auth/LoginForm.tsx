/**
 * File: src/features/auth/LoginForm.tsx
 * Purpose: Handles user authentication input and submission.
 * Usage: Rendered inside the main layout when the user is not authenticated.
 */
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

export function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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
				Sign In
			</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Input
					label="Username"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your login"
					required
				/>
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
				/>
				<Button type="submit" disabled={isSubmitting} className="mt-2">
					{isSubmitting ? "Connecting..." : "Play Now"}
				</Button>
			</form>
		</Card>
	);
}
