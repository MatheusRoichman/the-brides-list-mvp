import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  ADMIN_NAME: z.string(),
  ADMIN_PASSWORD: z.string(),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
