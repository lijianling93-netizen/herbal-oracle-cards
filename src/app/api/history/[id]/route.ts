import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { historyManager } from "@/storage/database";

// GET /api/history/[id] - 获取单条历史记录详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 从 cookie 中获取 token
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "未登录，请先登录" },
        { status: 401 }
      );
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    // 获取历史记录ID
    const { id } = await params;
    const historyId = parseInt(id);

    if (isNaN(historyId)) {
      return NextResponse.json(
        { error: "历史记录ID无效" },
        { status: 400 }
      );
    }

    // 获取历史记录
    const history = await historyManager.getHistoryById(historyId, payload.userId);

    if (!history) {
      return NextResponse.json(
        { error: "历史记录不存在或无权访问" },
        { status: 404 }
      );
    }

    // 解析 cards JSON 字符为数组
    return NextResponse.json({
      success: true,
      history: {
        ...history,
        cards: JSON.parse(history.cards),
      },
    });
  } catch (error) {
    console.error("获取历史记录详情失败:", error);
    return NextResponse.json(
      { error: "获取历史记录详情失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// DELETE /api/history/[id] - 删除历史记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 从 cookie 中获取 token
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "未登录，请先登录" },
        { status: 401 }
      );
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    // 获取历史记录ID
    const { id } = await params;
    const historyId = parseInt(id);

    if (isNaN(historyId)) {
      return NextResponse.json(
        { error: "历史记录ID无效" },
        { status: 400 }
      );
    }

    // 删除历史记录
    const success = await historyManager.deleteHistory(historyId, payload.userId);

    if (!success) {
      return NextResponse.json(
        { error: "历史记录不存在或无权删除" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除历史记录失败:", error);
    return NextResponse.json(
      { error: "删除历史记录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
