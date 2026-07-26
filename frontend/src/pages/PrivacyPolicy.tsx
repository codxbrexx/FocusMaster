import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Database,
  Eye,
  Clock,
  ShieldCheck,
  Share2,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('collect');

  const sections = [
    { id: 'collect', label: '1. Information We Collect', icon: Database },
    { id: 'use', label: '2. How We Use Your Data', icon: Eye },
    { id: 'retention', label: '3. Data Retention', icon: Clock },
    { id: 'rights', label: '4. Your Rights (GDPR / CCPA)', icon: ShieldCheck },
    { id: 'thirdparty', label: '5. Third-Party Services', icon: Share2 },
    { id: 'contact', label: '6. Contact Us', icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 lg:px-16 print:py-2 print:px-2 print:bg-white print:text-black">
      <div className="max-w-6xl mx-auto space-y-10 print:space-y-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border print:pb-2 print:mb-2 print:gap-1">
          <div className="space-y-3 print:space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 -ml-2 text-muted-foreground hover:text-foreground print:hidden"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading print:text-xl print:text-black">
              Privacy Policy
            </h1>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground print:text-[8px] print:text-gray-600">
              <Badge variant="secondary" className="font-normal print:bg-gray-100 print:text-black print:border-gray-300">
                Version 2.0.0
              </Badge>
              <span className="text-muted-foreground/30 print:hidden">•</span>
              <span>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-green-500 font-medium print:text-black">GDPR & CCPA Compliant</span>
            </div>
          </div>
          <Button onClick={handlePrint} variant="outline" className="gap-2 shrink-0 print:hidden">
            <Printer className="w-4 h-4" /> Print Policy
          </Button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 print:hidden">
            <div className="sticky top-6 space-y-2 hidden lg:block bg-card p-4 rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3">
                On This Page
              </p>
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all text-left ${
                      activeSection === sec.id
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 print:col-span-4 print:space-y-2">
            
            {/* Quick Introduction Banner */}
            <Card className="bg-card border border-border print:hidden">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-lg">Your Privacy is Paramount</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  At FocusMaster, we believe in complete transparency and data ownership. This policy explains what information we collect, how it is processed, and your rights concerning your personal information. We do not sell your personal data to third parties.
                </p>
              </CardContent>
            </Card>

            {/* Privacy Sections */}
            <div className="space-y-6 print:grid print:grid-cols-3 print:gap-2 print:space-y-0">
              
              {/* Section 1 */}
              <section id="collect" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Database className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">1. Information We Collect</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      We collect minimal info to provide our service:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li><strong>Account:</strong> Email, name, hashed passwords.</li>
                      <li><strong>Activity:</strong> Focus sessions, tags, timestamps.</li>
                      <li><strong>Technical:</strong> IP and system logs (only with consent).</li>
                      <li><strong>Analytics:</strong> Feature interaction statistics.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2 */}
              <section id="use" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Eye className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">2. How We Use Your Data</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      We process your data exclusively to run our service:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li>Render metrics dashboard graphics.</li>
                      <li>Transmit account alerts and verification.</li>
                      <li>Perform system debug and security audits.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3 */}
              <section id="retention" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">3. Data Retention</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      We minimize storage:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li><strong>Account Data:</strong> Deleted immediately upon account termination.</li>
                      <li><strong>Activity History:</strong> Wiped after 12 months of user inactivity.</li>
                      <li><strong>Analytics:</strong> Cached for up to 90 days.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4 */}
              <section id="rights" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">4. Your Rights</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      Under GDPR/CCPA, you control your data:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li><strong>Portability:</strong> Download a full JSON data export.</li>
                      <li><strong>Erasure:</strong> Permanent, self-serve account deletion in settings.</li>
                      <li><strong>Cookies:</strong> Edit parameters in cookie settings.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5 */}
              <section id="thirdparty" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">5. Third-Party Services</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      Integrations used to power features:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li><strong>Spotify playback:</strong> Encrypted auth token session playback.</li>
                      <li><strong>Analytics:</strong> Fully disablable event tracking.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6 */}
              <section id="contact" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">6. Contact Us</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      Direct queries to our DPO:
                    </p>
                    <div className="p-4 bg-muted/40 rounded-lg border border-border flex items-center gap-3 print:p-1 print:bg-gray-50 print:border-gray-250">
                      <Mail className="w-5 h-5 text-primary print:hidden" />
                      <a href="mailto:privacy@focusmaster.app" className="text-primary hover:underline font-semibold print:text-[8px] print:text-black">
                        privacy@focusmaster.app
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
