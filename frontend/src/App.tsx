/**
 * Root Component: App
 * Description: Main entry point linking the Layout with current Features.
 */
import { AppLayout } from "./components/layout/AppLayout";
import { LoginForm } from "./components/auth/LoginForm";

function App() {
	return (
		<AppLayout>
			<LoginForm />
		</AppLayout>
	);
}

export default App;
