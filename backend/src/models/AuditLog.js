const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            index: true
        },
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        actorName: {
            type: String,
            required: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        details: {
            type: String
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
);

// Index for chronological queries
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
