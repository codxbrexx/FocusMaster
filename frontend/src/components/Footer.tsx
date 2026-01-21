import { Github, Linkedin } from 'lucide-react';
import { ReportBugDialog } from './ReportBugDialog';

export const Footer = () => {
  return (
    <footer className="hidden lg:block w-full mt-auto py-4 border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
        <div className="flex items-center gap-2 font-mono order-2 md:order-1">
          <span>FocusMaster V_2.0.0</span>
          <span className="hidden md:inline">•</span>
          <span className="opacity-75">
            Built by{' '}
            <a
              href="https://github.com/codxbrexx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-500 transition-colors"
            >
              codxbrexx
            </a>
          </span>
        </div>

        <div className="flex items-center gap-4 order-1 md:order-2">
          <ReportBugDialog />
          <div className="h-4 w-px bg-border/60" />
          <a
            href="https://github.com/codxbrexx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200"
            title="View on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/mozammilali"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200"
            title="Connect on LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
