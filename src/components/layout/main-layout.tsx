import type { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">AWS SAM Event Generator</h1>
          <p className="text-muted-foreground">Generate AWS SAM event payloads for local testing</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, TailwindCSS, and ShadCN UI</p>
        </div>
      </footer>
    </div>
  );
};
