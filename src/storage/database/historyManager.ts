import { eq, and, desc } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { divinationHistory, insertDivinationHistorySchema, createDivinationHistorySchema } from "./shared/schema";
import type { DivinationHistory, InsertDivinationHistory, CreateDivinationHistory } from "./shared/schema";

export class HistoryManager {
  /**
   * 创建占卜历史记录
   * @param data 创建历史记录的数据
   * @returns 新创建的历史记录
   */
  async createHistory(data: InsertDivinationHistory): Promise<DivinationHistory> {
    const db = await getDb();
    const validated = insertDivinationHistorySchema.parse(data);

    const [history] = await db
      .insert(divinationHistory)
      .values(validated)
      .returning();

    return history;
  }

  /**
   * 获取用户的历史记录列表（分页）
   * @param userId 用户ID
   * @param page 页码（从1开始）
   * @param limit 每页记录数
   * @returns 历史记录列表和总数
   */
  async getUserHistories(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ histories: DivinationHistory[]; total: number }> {
    const db = await getDb();
    const offset = (page - 1) * limit;

    // 查询总记录数
    const result = await db
      .select({ count: divinationHistory.id })
      .from(divinationHistory)
      .where(eq(divinationHistory.userId, userId));

    // 查询分页记录
    const histories = await db
      .select()
      .from(divinationHistory)
      .where(eq(divinationHistory.userId, userId))
      .orderBy(desc(divinationHistory.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      histories,
      total: result.length,
    };
  }

  /**
   * 根据ID获取单条历史记录（验证所有权）
   * @param id 历史记录ID
   * @param userId 用户ID
   * @returns 历史记录详情，不存在或无权限返回 null
   */
  async getHistoryById(id: number, userId: string): Promise<DivinationHistory | null> {
    const db = await getDb();
    const [history] = await db
      .select()
      .from(divinationHistory)
      .where(
        and(
          eq(divinationHistory.id, id),
          eq(divinationHistory.userId, userId)
        )
      );

    return history || null;
  }

  /**
   * 删除历史记录（验证所有权）
   * @param id 历史记录ID
   * @param userId 用户ID
   * @returns 删除成功返回 true，否则返回 false
   */
  async deleteHistory(id: number, userId: string): Promise<boolean> {
    const db = await getDb();
    const result = await db
      .delete(divinationHistory)
      .where(
        and(
          eq(divinationHistory.id, id),
          eq(divinationHistory.userId, userId)
        )
      );

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取用户的占卜次数统计
   * @param userId 用户ID
   * @returns 占卜总次数
   */
  async getUserDivinationCount(userId: string): Promise<number> {
    const db = await getDb();
    const result = await db
      .select()
      .from(divinationHistory)
      .where(eq(divinationHistory.userId, userId));

    return result.length;
  }
}

export const historyManager = new HistoryManager();
