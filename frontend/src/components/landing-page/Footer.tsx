import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-background/20 backdrop-blur-lg py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        {/* Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 opacity-90">
            <img src="/fmasterlogo.png" alt="Logo" className="w-6 h-6 rounded-md shadow-sm" />
            <span className="font-bold text-sm sm:text-base tracking-wide">FocusMaster</span>
          </div>
          <span className="hidden md:block text-muted-foreground/30">|</span>
          <p className="text-xs sm:text-sm text-muted-foreground">
              build by{' '}
            <a
              href="https://github.com/codxbrexx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-purple-500 transition-colors"
            >
              codxbrexx
            </a>
          </p>
        </div>

        {/* Socials & Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex gap-4">
            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
            <SocialLink
              href="https://github.com/codxbrexx"
              icon={<Github className="w-4 h-4" />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin/mozammilali"
              icon={<Linkedin className="w-4 h-4" />}
              label="LinkedIn"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200 p-2 hover:bg-white/10 rounded-lg"
  >
    {icon}
  </a>
);
