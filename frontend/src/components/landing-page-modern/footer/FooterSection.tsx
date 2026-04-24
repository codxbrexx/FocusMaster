import { Github, Linkedin, Twitter } from 'lucide-react';

export const FooterSection = () => {
  return (
    <footer className="relative z-10 border-t border-slate-700 bg-[#0f0f1e] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/fmasterlogo.png"
                alt="FocusMaster Logo"
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span className="font-bold text-lg tracking-wide text-white">FocusMaster</span>
            </div>
            <span className="hidden md:block text-slate-600">•</span>
            <p className="text-sm text-slate-400">
              Built with focus by{' '}
              <a
                href="https://github.com/codxbrexx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
              >
                codxbrexx
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <SocialLink
              href="https://twitter.com"
              icon={<Twitter className="w-5 h-5" />}
              label="Twitter"
            />
            <SocialLink
              href="https://github.com/codxbrexx"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com"
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/50 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 FocusMaster. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Contact
            </a>
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
    className="p-3 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 hover:scale-110"
  >
    {icon}
  </a>
);
