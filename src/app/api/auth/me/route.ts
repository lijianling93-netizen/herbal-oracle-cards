import { NextRequest, NextResponse } from "next/server";
import { userManager } from "@/storage/database";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log('[Auth Me API] ========== 获取用户信息请求 ==========');
    console.log('[Auth Me API] 请求 URL:', request.url);
    console.log('[Auth Me API] 请求 Headers:', Object.fromEntries(request.headers.entries()));

    const allCookies = request.cookies.getAll();
    console.log('[Auth Me API] 所有 Cookies:', allCookies);

    // 尝试从 cookie 中获取 token
    let token = request.cookies.get("auth-token")?.value;

    // 如果 Cookie 中没有 token，尝试从 Authorization header 获取（用于 Coze 环境）
    if (!token) {
      const authHeader = request.headers.get('authorization');
      console.log('[Auth Me API] Cookie 中未找到 token，尝试从 Authorization header 获取');
      console.log('[Auth Me API] Authorization header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'null');

      token = extractTokenFromHeader(authHeader) || undefined;
    }

    if (!token) {
      console.log('[Auth Me API] 未找到 token（Cookie 和 Authorization header 都为空）');
      console.log('[Auth Me API] Cookie 名称列表:', allCookies.map(c => c.name));
      console.log('[Auth Me API] ========== 请求结束（未登录） ==========');
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    console.log('[Auth Me API] 找到 token，长度:', token.length);

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      console.log('[Auth Me API] Token 验证失败');
      console.log('[Auth Me API] ========== 请求结束（验证失败） ==========');
      return NextResponse.json(
        { success: false, error: "登录已过期" },
        { status: 401 }
      );
    }

    console.log('[Auth Me API] Token 验证成功，userId:', payload.userId);

    // 获取用户最新信息
    const user = await userManager.getUserById(payload.userId);
    if (!user) {
      console.log('[Auth Me API] 用户不存在');
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    console.log('[Auth Me API] 获取用户成功:', { id: user.id, email: user.email });
    console.log('[Auth Me API] ========== 请求完成 ==========');

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth Me API] 获取用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}
