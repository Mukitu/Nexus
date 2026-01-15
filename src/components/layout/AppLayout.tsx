import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 pb-20 lg:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
