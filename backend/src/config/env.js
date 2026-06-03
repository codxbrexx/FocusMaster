const { z } = require("zod");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters long"),
    FRONTEND_URL: z.string().url().optional(),
    FRONTEND_URLS: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    SPOTIFY_CLIENT_ID: z.string().optional(),
    SPOTIFY_CLIENT_SECRET: z.string().optional(),
    SPOTIFY_REDIRECT_URI: z.string().url().optional(),
  })
  .superRefine((env, ctx) => {
    if (
      env.NODE_ENV === "production" &&
      !env.FRONTEND_URL &&
      !env.FRONTEND_URLS
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["FRONTEND_URLS"],
        message: "Set FRONTEND_URL or FRONTEND_URLS in production",
      });
    }

    if (env.NODE_ENV === "production" && env.JWT_SECRET.length < 32) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message: "JWT_SECRET must be at least 32 characters long in production",
      });
    }
  });

const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return result.data;
};

module.exports = { validateEnv };
