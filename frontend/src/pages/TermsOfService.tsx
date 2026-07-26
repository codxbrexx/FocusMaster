import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  Cpu,
  UserCheck,
  ShieldAlert,
  FileText,
  Scale,
  AlertTriangle,
  Gavel,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TermsOfService() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', label: '1. Acceptance of Terms', icon: CheckCircle },
    { id: 'description', label: '2. Description of Service', icon: Cpu },
    { id: 'accounts', label: '3. User Accounts', icon: UserCheck },
    { id: 'use', label: '4. Acceptable Use', icon: ShieldAlert },
    { id: 'intellectual', label: '5. Intellectual Property', icon: FileText },
    { id: 'liability', label: '6. Limitation of Liability', icon: Scale },
    { id: 'termination', label: '7. Termination', icon: AlertTriangle },
    { id: 'dispute', label: '8. Dispute Resolution', icon: Gavel },
    { id: 'contact', label: '9. Contact Us', icon: Mail },
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
              Terms of Service
            </h1>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground print:text-[8px] print:text-gray-600">
              <Badge variant="secondary" className="font-normal print:bg-gray-100 print:text-black print:border-gray-300">
                Version 2.0.0
              </Badge>
              <span className="text-muted-foreground/30 print:hidden">•</span>
              <span>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-green-500 font-medium print:text-black">Active & Binding</span>
            </div>
          </div>
          <Button onClick={handlePrint} variant="outline" className="gap-2 shrink-0 print:hidden">
            <Printer className="w-4 h-4" /> Print Terms
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
                <h3 className="font-semibold text-lg">Please read carefully</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to FocusMaster. These Terms of Service ("Terms") govern your access to and use of FocusMaster's website, products, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Terms Sections */}
            <div className="space-y-6 print:grid print:grid-cols-3 print:gap-2 print:space-y-0">
              
              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">1. Acceptance of Terms</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      By accessing, signing up for, or using FocusMaster ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and others who access or use the Service.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2 */}
              <section id="description" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">2. Description of Service</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      FocusMaster provides productivity tools including task management systems, Pomodoro timers, third-party integrations (e.g., Spotify playback features), calendar syncing, and analytics visualizers. We reserve the right to modify, suspend, or discontinue any feature or part of the Service at any time without notice.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3 */}
              <section id="accounts" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">3. User Accounts</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      To access certain features of the Service, you must create an account. You are responsible for safeguarding your credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach of your account.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4 */}
              <section id="use" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">4. Acceptable Use</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      You agree to use FocusMaster for legitimate productivity purposes. You explicitly agree not to use the Service to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-1 print:text-[7px] print:leading-tight print:text-gray-700">
                      <li>Violate any local, state, national, or international laws or regulations.</li>
                      <li>Attempt to bypass security measures or access unauthorized user data.</li>
                      <li>Interfere with or disrupt the stability of our servers.</li>
                      <li>Automate usage of the Service (e.g. bots, scrapers) without permission.</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5 */}
              <section id="intellectual" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">5. Intellectual Property</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      The Service, including original code, logos, visual designs, assets, and databases are and remain the exclusive property of FocusMaster. Our trademarks and assets may not be used in connection with any product or service without prior written consent.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6 */}
              <section id="liability" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Scale className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">6. Limitation of Liability</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      In no event shall FocusMaster, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from your access or use of the Service.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 7 */}
              <section id="termination" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">7. Termination</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      We may suspend or terminate your access to FocusMaster immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 8 */}
              <section id="dispute" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Gavel className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">8. Dispute Resolution</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-700">
                      These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which FocusMaster operates, without regard to conflict of law provisions. Disputes will be settled in local courts of the operating jurisdiction.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Section 9 */}
              <section id="contact" className="scroll-mt-6">
                <Card className="bg-card border border-border hover:border-primary/20 transition-all duration-300 print:border-gray-300 print:bg-white print:text-black print:shadow-none">
                  <CardContent className="p-6 md:p-8 space-y-4 print:p-2 print:space-y-1">
                    <div className="flex items-center gap-3 print:gap-1">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg print:hidden">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading print:text-[10px] print:text-black">9. Contact Us</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed print:text-[8px] print:leading-normal print:text-gray-750">
                      If you have questions, feedback, or concerns regarding these Terms of Service, please reach out to our legal department directly:
                    </p>
                    <div className="p-4 bg-muted/40 rounded-lg border border-border flex items-center gap-3 print:p-1 print:bg-gray-50 print:border-gray-250">
                      <Mail className="w-5 h-5 text-primary print:hidden" />
                      <a href="mailto:legal@focusmaster.app" className="text-primary hover:underline font-semibold print:text-[8px] print:text-black">
                        legal@focusmaster.app
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
