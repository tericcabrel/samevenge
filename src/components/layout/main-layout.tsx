import Link from 'next/link';
import type { ReactNode } from 'react';
import { GithubIcon } from '../icons/github';

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">AWS SAM Event Generator</h1>
          <Link
            href="https://github.com/tericcabrel/samevenge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub">
            <GithubIcon height={24} width={24} />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AWS SAM Event Generator. Built with ❤️ by{' '}
            <Link href="https://tericcabrel.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Eric Cabrel
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};
