/**
 * Layout Component: Footer
 * Description: Bottom bar with mandatory links to Terms of Service and Privacy Policy.
 */
export function Footer() {
	return (
		<footer className="mt-auto p-6 bg-gray-100 text-center text-gray-500 text-sm border-t border-gray-200">
			<p>
				{" "}
				2026 ft_transcendence |{" "}
				<a href="/terms" className="hover:underline">
					Terms of Service
				</a>{" "}
				|{" "}
				<a href="/privacy" className="hover:underline">
					Privacy Policy
				</a>
			</p>
		</footer>
	);
}
