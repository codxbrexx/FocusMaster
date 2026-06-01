const cron = require('node-cron');
const Session = require('../models/Session');
const ErrorLog = require('../models/ErrorLog');
const AuditLog = require('../models/AuditLog');

const startCleanupJob = () => {
  // Run daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cleanup] Starting automated data cleanup...');
    
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      // Delete old activity logs
      const deletedSessions = await Session.deleteMany({
        createdAt: { $lt: thirtyDaysAgo }
      });
      console.log(`  Deleted ${deletedSessions.deletedCount} old sessions`);
      
      // Delete old error logs
      const deletedErrors = await ErrorLog.deleteMany({
        createdAt: { $lt: ninetyDaysAgo }
      });
      console.log(`  Deleted ${deletedErrors.deletedCount} old error logs`);
      
      // Archive old audit logs
      const archivedAudits = await AuditLog.updateMany(
        { createdAt: { $lt: ninetyDaysAgo }, archived: false },
        { archived: true }
      );
      console.log(`  Archived ${archivedAudits.modifiedCount} old audit logs`);
    } catch (error) {
      console.error('[Cleanup] Error during automated data cleanup:', error);
    }
  });

  console.log('[Cleanup] Automated cleanup scheduled for daily at 2 AM');
};

module.exports = startCleanupJob;
