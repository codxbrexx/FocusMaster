import { MessageSquareWarning } from 'lucide-react';
import { IssueReportsTable } from '../features/issues/IssueReportsTable';
import { RequirePermission } from '../components/guards/RequirePermission';

export const IssueReportsPage = () => {
  return (
    <RequirePermission permission="VIEW_SUPPORT">
      <div className="max-w-5xl mx-auto p-2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquareWarning className="text-amber-500" />
            Issue Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user-submitted bug reports, feature requests, and inquiries.
          </p>
        </div>

        <IssueReportsTable />
      </div>
    </RequirePermission>
  );
};
