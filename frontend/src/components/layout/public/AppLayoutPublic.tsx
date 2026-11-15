import { Outlet } from 'react-router-dom';
import { FooterPublic } from './FooterPublic';
import { HeaderPublic } from './HeaderPublic';
import { UI } from '@/components/layout/layoutStyles';

export function AppLayoutPublic() {
  return (
    <div className={UI.chrome.publicFrame}>
      <HeaderPublic />

      <main className="z-10 flex w-full grow flex-col items-center justify-center">
        <Outlet />
      </main>

      <FooterPublic />
    </div>
  );
}
