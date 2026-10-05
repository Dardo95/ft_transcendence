/**
 * Root Component: App
 * Description: Main entry point linking the Layout with current Features.
 */
import { AppLayout } from "./components/layout/AppLayout";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";

function App() {
	return (
		<AppLayout>
			<LoginForm />
			<RegisterForm />
		</AppLayout>

	);
}

export default App;
