/**
 * Application root component.
 * Category: Application
 *
 * Responsible for:
 * - Defining the main application structure.
 * - Registering global providers and application-level components.
 * - Defining the main routing structure.
 *
 * Does not:
 * - Contain business logic.
 * - Perform API requests directly.
 * - Manage feature-specific state.
 */

import { AppLayout } from "./components/layout/AppLayout";
import { AuthStatus } from "./features/auth/components/AuthStatus";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";

function App() {
	return (
		<AppLayout>
			<LoginForm />
			<RegisterForm />
			<AuthStatus />
		</AppLayout>
	);
}

export default App;
