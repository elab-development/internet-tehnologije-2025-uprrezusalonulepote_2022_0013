import { Config } from "drizzle-kit";

export default {
  out: "./src/app/db/migrations",
  schema: "src/app/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
