import { Outlet } from 'react-router-dom';
import { FooterPublic } from './FooterPublic';

export function AppLayoutPublic() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-orange-500/5 via-transparent to-transparent blur-3xl" />

      <main className="z-10 flex w-full grow flex-col items-center justify-center">
        <Outlet />
      </main>

      <FooterPublic />
    </div>
  );
}
