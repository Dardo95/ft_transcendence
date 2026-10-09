/**
 * Application entry point.
 * Category: Entry Point
 *
 * Responsible for:
 * - Initializing the React application.
 * - Mounting the root App component.
 * - Registering global providers.
 * - Loading global styles.
 *
 * This file should contain only application bootstrap logic.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./locales/LanguageProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LanguageProvider>
			<App />
		</LanguageProvider>
	</StrictMode>,
);
