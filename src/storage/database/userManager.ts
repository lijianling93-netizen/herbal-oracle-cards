import { eq, and, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { users, insertUserSchema, updateUserSchema, loginSchema } from "./shared/schema";
import type { User, InsertUser, UpdateUser, LoginData } from "./shared/schema";
import * as bcrypt from "bcryptjs";

export class UserManager {
  async createUser(data: InsertUser): Promise<Omit<User, "password">> {
    const db = await getDb();
    const validated = insertUserSchema.parse(data);

    // 加密密码
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const [user] = await db
      .insert(users)
      .values({
        ...validated,
        password: hashedPassword,
      })
      .returning();

    // 返回用户时不包含密码
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<Omit<User, "password"> | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<Omit<User, "password"> | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 验证用户密码（用于登录）
   * @param email 邮箱
   * @param password 明文密码
   * @returns 验证成功返回用户信息（不含密码），失败返回 null
   */
  async verifyUser(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: UpdateUser): Promise<Omit<User, "password"> | null> {
    const db = await getDb();
    const validated = updateUserSchema.parse(data);

    const [user] = await db
      .update(users)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));

    return (result.rowCount ?? 0) > 0;
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const userManager = new UserManager();
