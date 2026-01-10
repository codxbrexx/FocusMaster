import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Sparkles, MessageSquare, CheckCircle, Circle, Laptop, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface IssueReport {
    id: string;
    type: 'bug' | 'feature' | 'other';
    status: 'open' | 'resolved';
    message: string;
    email?: string;
    deviceInfo: {
        platform: string;
        screenSize: string;
    };
    createdAt: string;
}

const MOCK_ISSUES: IssueReport[] = [
    {
        id: 'issue-1',
        type: 'bug',
        status: 'open',
        message: 'The Pomodoro timer sometimes resets when I switch tabs on mobile.',
        email: 'alex@example.com',
        deviceInfo: { platform: 'Linux armv8l', screenSize: '390x844' },
        createdAt: '10 mins ago'
    },
    {
        id: 'issue-2',
        type: 'feature',
        status: 'open',
        message: 'It would be great to have a "Dark Mode" toggle in the settings.',
        email: 'sarah@test.com',
        deviceInfo: { platform: 'MacIntel', screenSize: '1440x900' },
        createdAt: '2 hours ago'
    },
    {
        id: 'issue-3',
        type: 'bug',
        status: 'resolved',
        message: 'Login page layout is broken on iPad Mini.',
        deviceInfo: { platform: 'iPad', screenSize: '768x1024' },
        createdAt: '1 day ago'
    },
    {
        id: 'issue-4',
        type: 'other',
        status: 'open',
        message: 'How do I delete my account data completely? GDPR question.',
        email: 'privacy@eu.org',
        deviceInfo: { platform: 'Win32', screenSize: '1920x1080' },
        createdAt: '2 days ago'
    },
    {
        id: 'issue-5',
        type: 'feature',
        status: 'resolved',
        message: 'Add Spotify integration please!',
        deviceInfo: { platform: 'MacIntel', screenSize: '1728x1117' },
        createdAt: '1 week ago'
    }
];

export const IssueReportsTable = () => {
    const [issues, setIssues] = useState<IssueReport[]>(MOCK_ISSUES);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

    const handleToggleStatus = (id: string) => {
        setIssues(prev => prev.map(issue => {
            if (issue.id === id) {
                const newStatus = issue.status === 'open' ? 'resolved' : 'open';
                toast.success(`Marked issue as ${newStatus}`);
                return { ...issue, status: newStatus };
            }
            return issue;
        }));
    };

    const filteredIssues = issues.filter(i => filter === 'all' || i.status === filter);

    const getIcon = (type: string) => {
        switch (type) {
            case 'bug': return <Bug size={16} className="text-red-400" />;
            case 'feature': return <Sparkles size={16} className="text-purple-400" />;
            default: return <MessageSquare size={16} className="text-blue-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bug': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'feature': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-14rem)] max-h-[800px]">
            {/* Header / Filter */}
            <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-secondary/20">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">User Reports</h3>
                    <div className="flex bg-secondary/50 rounded-lg p-1 border border-border/50">
                        {(['all', 'open', 'resolved'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <span className="text-xs text-muted-foreground">
                    {filteredIssues.length} {filteredIssues.length === 1 ? 'Report' : 'Reports'}
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <div className="divide-y divide-border/20">
                    <AnimatePresence initial={false}>
                        {filteredIssues.map((issue) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key={issue.id}
                                className={`p-4 flex gap-4 hover:bg-secondary/30 transition-colors group ${issue.status === 'resolved' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                            >
                                {/* Status Toggle */}
                                <button
                                    onClick={() => handleToggleStatus(issue.id)}
                                    className={`mt-1 flex-shrink-0 transition-colors ${issue.status === 'resolved' ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-foreground'}`}
                                    title={issue.status === 'open' ? "Mark as Resolved" : "Re-open Issue"}
                                >
                                    {issue.status === 'resolved' ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </button>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1.5 ${getTypeColor(issue.type)}`}>
                                                {getIcon(issue.type)}
                                                {issue.type}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Laptop size={12} />
                                                {issue.deviceInfo.platform}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-mono">{issue.createdAt}</span>
                                    </div>

                                    <p className="text-sm text-foreground leading-relaxed">
                                        {issue.message}
                                    </p>

                                    {issue.email && (
                                        <div className="flex items-center gap-1.5 text-xs text-primary/80">
                                            <Mail size={12} />
                                            <a href={`mailto:${issue.email}`} className="hover:underline">{issue.email}</a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredIssues.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <CheckCircle size={40} className="mx-auto mb-4 opacity-20" />
                            <p>No reports found matching this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
