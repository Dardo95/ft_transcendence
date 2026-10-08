/**
 * Root Component: App
 * Description: Main entry point linking the Layout with current Features.
 */
import { AppLayout } from "./components/layout/AppLayout";
import { AuthStatus } from "./components/auth/AuthStatus";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";

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
