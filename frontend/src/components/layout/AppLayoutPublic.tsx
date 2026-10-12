import { Outlet } from "react-router-dom";
import { FooterPublic } from "./FooterPublic";

export function AppLayoutPublic() {
	return (
		<div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-orange-500/5 via-transparent to-transparent blur-3xl" />

			<main className="flex-grow w-full flex flex-col items-center justify-center z-10">
				<Outlet />
			</main>

			<FooterPublic />
		</div>
	);
}
