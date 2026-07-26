import { Github, Linkedin, Twitter } from 'lucide-react';

export const FooterSection = () => {
  return (
    <footer className="relative z-10 border-t border-slate-800 bg-transparent pt-20 pb-12 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/FM_logo.png"
                alt="FocusMaster Logo"
                className="h-9 w-auto"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                FocusMaster
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Elevate your productivity with our modern focus engine. Track time, manage tasks, and achieve deep work effortlessly without context switching.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
              />
              <SocialLink
                href="https://github.com/codxbrexx"
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin className="w-4 h-4" />}
                label="LinkedIn"
              />
            </div>
          </div>

          {/* Links - Product */}
          <div>
            <h4 className="text-slate-100 font-bold mb-6 tracking-wide uppercase text-xs">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="/login" className="hover:text-indigo-400 transition-colors">Login</a></li>
              <li><a href="/register" className="hover:text-indigo-400 transition-colors">Start Free Trial</a></li>
            </ul>
          </div>

          {/* Links - Resources */}
          <div>
            <h4 className="text-slate-100 font-bold mb-6 tracking-wide uppercase text-xs">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Guides & Tutorials</a></li>
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h4 className="text-slate-100 font-bold mb-6 tracking-wide uppercase text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-settings" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/60 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} FocusMaster. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with focus by{' '}
            <a
              href="https://github.com/codxbrexx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold"
            >
              codxbrexx
            </a>
          </p>
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
    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 hover:-translate-y-1 shadow-sm"
  >
    {icon}
  </a>
);
