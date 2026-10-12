/**
 * Dynamic layout that conditionally renders either the public or private layout based on the user's authentication status.
 * Category: Layout Component
 *
 * Responsible for:
 * - Rendering the appropriate layout based on the user's authentication status.
 * - Providing a seamless user experience across different sections of the application.
 *
 * Does not:
 * - Contain any business logic.
 * - Perform any API requests.
 */

import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { AppLayout } from "./AppLayout";
import { AppLayoutPublic } from "./AppLayoutPublic";

export function DynamicLayout() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <AppLayout />;
	}

	return <AppLayoutPublic />;
}
