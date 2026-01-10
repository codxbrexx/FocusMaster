const mongoose = require('mongoose');

const errorLogSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        stack: {
            type: String
        },
        path: {
            type: String
        },
        method: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        statusCode: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

// Automatically delete logs after 7 days (604800 seconds)
errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

module.exports = ErrorLog;
