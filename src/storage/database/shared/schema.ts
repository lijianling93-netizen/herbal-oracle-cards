import { pgTable, varchar, text, timestamp, index, serial, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    username: varchar("username", { length: 100 }),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

// 使用 createSchemaFactory 配置 date coercion（处理前端 string → Date 转换）
const { createInsertSchema: createCoercedInsertSchema, createUpdateSchema: createCoercedUpdateSchema } = createSchemaFactory({
  coerce: { date: true },
});

// Zod schemas for validation
export const insertUserSchema = createCoercedInsertSchema(users).pick({
  email: true,
  password: true,
  username: true,
  avatar: true,
});

export const updateUserSchema = createCoercedUpdateSchema(users)
  .pick({
    username: true,
    avatar: true,
  })
  .partial();

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6位"),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// Divination History Table
export const divinationHistory = pgTable(
  "divination_history",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cards: text("cards").notNull(), // JSON string: array of card IDs
    intention: text("intention").notNull(),
    interpretation: text("interpretation"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("divination_history_user_id_idx").on(table.userId),
    createdAtIdx: index("divination_history_created_at_idx").on(table.createdAt),
  })
);

// Zod schemas for divination history
export const insertDivinationHistorySchema = createCoercedInsertSchema(divinationHistory).pick({
  userId: true,
  cards: true,
  intention: true,
  interpretation: true,
});

export const createDivinationHistorySchema = z.object({
  cards: z.array(z.number()),
  intention: z.string(),
  interpretation: z.string().optional(),
});

// TypeScript types
export type DivinationHistory = typeof divinationHistory.$inferSelect;
export type InsertDivinationHistory = z.infer<typeof insertDivinationHistorySchema>;
export type CreateDivinationHistory = z.infer<typeof createDivinationHistorySchema>;
