/**
 * Main application layout.
 * Category: Layout Component
 *
 * Responsible for:
 * - Defining the common application page structure.
 * - Rendering shared layout elements.
 * - Providing the main content area.
 *
 * Typical structure:
 * - Header
 * - Main content
 * - Footer
 *
 * Does not:
 * - Contain feature-specific business logic.
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SideDrawer } from './SideDrawer';

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 font-sans text-slate-100">
      {/* Top navigation bar */}
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Collapsible left navigation drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Main view container rendered by React Router */}
      <main className="flex w-full grow flex-col items-center p-4 md:p-8">
        <Outlet />
      </main>

      {/* Application footer */}
      <Footer />
    </div>
  );
}
