/**
 * Authentication status component.
 * Category: Feature Component
 *
 * Responsible for:
 * - Displaying the current authentication state.
 * - Displaying authenticated user information.
 * - Providing authentication-related UI actions.
 *
 * Does not:
 * - Perform authentication requests directly.
 * - Implement authentication logic.
 * - Manage API communication.
 */

import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useLanguage } from "../../../locales/useLanguage";
import { useAuthStore } from "../store/useAuthStore";

export function AuthStatus() {
	const { t } = useLanguage();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handleLogout() {
		setIsLoggingOut(true);
		setErrorMessage(null);

		try {
			await logout();
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: t("auth.errors.logout"),
			);
		} finally {
			setIsLoggingOut(false);
		}
	}

	return (
		<Card className="w-full max-w-sm mx-auto mt-6 text-center">
			<p className="text-lg font-semibold">
				{isAuthenticated
					? t("auth.status.loggedIn")
					: t("auth.status.notLoggedIn")}
			</p>
			{isAuthenticated && user && (
				<p className="mt-2 text-sm text-gray-600">
					{t("auth.status.userLabel")}: {user.username}
				</p>
			)}
			{errorMessage && (
				<p className="mt-2 text-sm text-red-600">{errorMessage}</p>
			)}
			{isAuthenticated && (
				<Button
					type="button"
					variant="danger"
					className="mt-4"
					onClick={handleLogout}
					disabled={isLoggingOut}
				>
					{isLoggingOut
						? t("auth.status.loggingOut")
						: t("auth.status.logout")}
				</Button>
			)}
		</Card>
	);
}
