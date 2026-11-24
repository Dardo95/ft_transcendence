import { Outlet } from 'react-router-dom';
import { FooterPublic } from './FooterPublic';
import { HeaderPublic } from './HeaderPublic';
import { UI } from '@/components/layout/layoutStyles';

export function AppLayoutPublic() {
  return (
    <div className={UI.chrome.publicFrame}>
      <HeaderPublic />

      <main className="flex w-full grow flex-col items-center justify-center p-4 md:p-8">
        <Outlet />
      </main>

      <FooterPublic />
    </div>
  );
}
