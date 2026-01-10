import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";
import { historyManager } from "@/storage/database";
import { createDivinationHistorySchema } from "@/storage/database/shared/schema";

// POST /api/history - 保存占卜历史
export async function POST(request: NextRequest) {
  try {
    console.log('[History API] 收到保存请求');
    console.log('[History API] Cookies:', request.cookies.getAll());

    // 尝试从 cookie 中获取 token
    let token = request.cookies.get("auth-token")?.value;

    // 如果 Cookie 中没有 token，尝试从 Authorization header 获取（用于 Coze 环境）
    if (!token) {
      const authHeader = request.headers.get('authorization');
      console.log('[History API] Cookie 中未找到 token，尝试从 Authorization header 获取');
      token = extractTokenFromHeader(authHeader) || undefined;
    }

    if (!token) {
      console.log('[History API] 未找到 token（Cookie 和 Authorization header 都为空）');
      return NextResponse.json(
        { error: "未登录，请先登录" },
        { status: 401 }
      );
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      console.log('[History API] Token 验证失败');
      return NextResponse.json(
        { error: "登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    console.log('[History API] Token 验证成功，userId:', payload.userId);

    // 解析请求体
    const body = await request.json();

    // 验证数据
    const validated = createDivinationHistorySchema.parse(body);

    // 创建历史记录
    const history = await historyManager.createHistory({
      userId: payload.userId,
      cards: JSON.stringify(validated.cards),
      intention: validated.intention,
      interpretation: validated.interpretation || null,
    });

    return NextResponse.json({
      success: true,
      history: {
        id: history.id,
        userId: history.userId,
        cards: validated.cards,
        intention: history.intention,
        interpretation: history.interpretation,
        createdAt: history.createdAt,
      },
    });
  } catch (error: any) {
    console.error("保存历史记录失败:", error);

    // 处理 Zod 验证错误
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "数据格式错误", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "保存失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// GET /api/history - 获取历史记录列表
export async function GET(request: NextRequest) {
  try {
    // 尝试从 cookie 中获取 token
    let token = request.cookies.get("auth-token")?.value;

    // 如果 Cookie 中没有 token，尝试从 Authorization header 获取（用于 Coze 环境）
    if (!token) {
      const authHeader = request.headers.get('authorization');
      token = extractTokenFromHeader(authHeader) || undefined;
    }

    if (!token) {
      return NextResponse.json(
        { error: "未登录，请先登录" },
        { status: 401 }
      );
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      console.log('[History API] Token 验证失败');
      return NextResponse.json(
        { error: "登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    console.log('[History API] Token 验证成功，userId:', payload.userId);

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "分页参数无效" },
        { status: 400 }
      );
    }

    // 获取历史记录
    const { histories, total } = await historyManager.getUserHistories(
      payload.userId,
      page,
      limit
    );

    // 解析 cards JSON 字符为数组
    const parsedHistories = histories.map((history) => ({
      ...history,
      cards: JSON.parse(history.cards),
    }));

    return NextResponse.json({
      success: true,
      histories: parsedHistories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取历史记录失败:", error);
    return NextResponse.json(
      { error: "获取历史记录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
