import { Outlet } from 'react-router-dom';
import { FooterPublic } from './FooterPublic';
import { HeaderPublic } from './HeaderPublic';

export function AppLayoutPublic() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-slate-100">
      <HeaderPublic />

      <main className="z-10 flex w-full grow flex-col items-center justify-center">
        <Outlet />
      </main>

      <FooterPublic />
    </div>
  );
}
