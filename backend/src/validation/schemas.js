const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");
const email = z.email("Invalid email address").trim().toLowerCase();
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/\d/, "Password must include at least one number");
const safeString = (label, max = 500) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);
const optionalTrimmedString = (max = 500) =>
  z.string().trim().max(max, `Must be at most ${max} characters`).optional();
const isoDate = z.coerce.date();

const taskBodySchema = z
  .object({
    title: safeString("Title", 120),
    description: optionalTrimmedString(2000),
    priority: z.enum(["low", "medium", "high"]).optional(),
    estimatedPomodoros: z
      .coerce.number()
      .int()
      .min(1)
      .max(100)
      .optional(),
    category: optionalTrimmedString(120),
    deadline: isoDate.optional(),
    dueDate: isoDate.optional(),
    isAllDay: z.coerce.boolean().optional(),
    isCompleted: z.coerce.boolean().optional(),
    completedPomodoros: z.coerce.number().int().min(0).max(1000).optional(),
  })
  .strict();

const taskUpdateBodySchema = taskBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const sessionBodySchema = z
  .object({
    task: objectId.optional(),
    type: z.enum(["focus", "shortBreak", "longBreak"]),
    startTime: isoDate,
    endTime: isoDate.optional(),
    duration: z.coerce.number().min(0).max(86400),
    mood: z.enum(["happy", "neutral", "sad", "focused", "distracted"]).optional(),
  })
  .strict();

const sessionUpdateBodySchema = z
  .object({
    task: objectId.optional().nullable(),
    endTime: isoDate.optional(),
    duration: z.coerce.number().min(0).max(86400).optional(),
    mood: z.enum(["happy", "neutral", "sad", "focused", "distracted"]).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const userSettingsSchema = z
  .object({
    theme: z.enum(["light", "dark"]).optional(),
    autoStartSession: z.boolean().optional(),
    autoStartBreak: z.boolean().optional(),
    motivationalQuotes: z.boolean().optional(),
    focusDuration: z.coerce.number().int().min(1).max(240).optional(),
    shortBreakDuration: z.coerce.number().int().min(1).max(60).optional(),
    longBreakDuration: z.coerce.number().int().min(1).max(120).optional(),
    dailyGoal: z.coerce.number().int().min(1).max(24).optional(),
    soundEnabled: z.boolean().optional(),
    strictMode: z.boolean().optional(),
  })
  .strict();

const authSchemas = {
  register: z
    .object({
      name: safeString("Name", 100),
      email,
      password,
    })
    .strict(),
  login: z
    .object({
      email,
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
  guest: z
    .object({
      guestId: objectId.optional(),
    })
    .strict(),
  google: z
    .object({
      token: safeString("Token", 4096),
    })
    .strict(),
  profileUpdate: z
    .object({
      name: safeString("Name", 100).optional(),
      email: email.optional(),
      password: password.optional(),
      settings: userSettingsSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
  otpSend: z
    .object({
      newEmail: email,
    })
    .strict(),
  otpVerify: z
    .object({
      otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
    })
    .strict(),
};

const feedbackBodySchema = z
  .object({
    message: safeString("Message", 4000),
    email: email.optional(),
    category: z.enum(["bug", "feature", "other"]).optional(),
    deviceInfo: z
      .object({
        userAgent: optionalTrimmedString(500),
        platform: optionalTrimmedString(200),
        screenSize: optionalTrimmedString(50),
      })
      .strict()
      .optional(),
  })
  .strict();

const llmBodySchema = z
  .object({
    prompt: safeString("Prompt", 12000),
    model: optionalTrimmedString(100),
    options: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

const spotifyCallbackSchema = z
  .object({
    code: safeString("Code", 2048),
  })
  .strict();

const workLogStopSchema = z
  .object({
    notes: optionalTrimmedString(2000),
    breakTime: z.coerce.number().min(0).max(86400).optional(),
  })
  .strict();

const idParamSchema = z
  .object({
    id: objectId,
  })
  .strict();

const sessionQuerySchema = z
  .object({
    range: z.enum(["today", "week", "month"]).optional(),
  })
  .strict();

const adminUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(1000).optional(),
    search: optionalTrimmedString(120),
    role: z.enum(["user", "admin"]).optional(),
    status: z.enum(["active", "banned", "suspended"]).optional(),
  })
  .strict();

const adminUserStatusBodySchema = z
  .object({
    status: z.enum(["active", "banned", "suspended"]),
    banReason: optionalTrimmedString(500),
  })
  .strict();

const adminFeedbackStatusBodySchema = z
  .object({
    status: z.enum(["new", "in-progress", "resolved", "closed"]),
  })
  .strict();

module.exports = {
  adminFeedbackStatusBodySchema,
  adminUserStatusBodySchema,
  adminUsersQuerySchema,
  authSchemas,
  feedbackBodySchema,
  idParamSchema,
  llmBodySchema,
  sessionBodySchema,
  sessionQuerySchema,
  sessionUpdateBodySchema,
  spotifyCallbackSchema,
  taskBodySchema,
  taskUpdateBodySchema,
  workLogStopSchema,
};
